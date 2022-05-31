import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useRef, createContext, useContext, useState } from "react";
import { auth } from "../src/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { randomString } from "../libs/crypto";
import { db } from "../src/firebase";
import {
  collection,
  onSnapshot,
  limit,
  where,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { useProgress } from "../contexts/progress";

const FirebaseContext = createContext();

export default function FirebaseProvider({ children }) {
  const { user } = useUser();
  const { setProgress } = useProgress();
  const [isInited, setIsInited] = useState(false);

  // init
  useEffect(() => {
    if (!user || isInited) return;
    setIsInited(true);
    console.log("init");

    (async () => {
      setProgress(10);

      // status: if no key
      const { token } = await fetch("/api/init").then((res) => res.json());
      await signInWithCustomToken(auth, token);

      setProgress(60);

      startChat();
    })();
  }, [user]);

  // onClose
  useEffect(
    () => () => {
      console.log("bye");
      endChat();
      // auth.signOut();
    },
    []
  );

  // for Chats
  const chatUnsubscribeList = useRef([]);
  const [contactList, setContactList] = useState([]);
  const [contactData, setContactData] = useState({});
  const userList = useRef([]);
  const [userData, setUserData] = useState([]);

  const startChat = async () => {
    console.log("start chat");

    // listen to my data
    const unsubscribeUserData = onSnapshot(
      doc(db, "userPublicData", user.sub),
      (doc) => {
        if (!doc.exists) return;
        const data = doc.data();
        setUserData((prev) => {
          return {
            ...prev,
            [user.sub]: data,
          };
        });
      }
    );
    userList.current.push(user.sub);
    chatUnsubscribeList.current.push(unsubscribeUserData);

    const unsubscribeContact = onSnapshot(
      query(
        collection(db, "contact"),
        where("userList", "array-contains", user.sub)
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((snapshot) => {
          const data = snapshot.doc.data();
          const docId = snapshot.doc.id;

          // add to contact details
          if (snapshot.type == "added" || snapshot.type == "modified") {
            setContactData((prev) => {
              return {
                ...prev,
                [docId]: data,
              };
            });
          }

          // add message listen
          addContactMessageListening(docId);

          // add user data listening
          for (let i = 0; i < data.userList.length; i++) {
            addUserDataListening(data.userList[i]);
          }

          // add to conatct LIST
          setContactList((prev) => {
            return [...prev, docId];
          });
        });
      }
    );
    chatUnsubscribeList.current.push(unsubscribeContact);

    setProgress(100);
  };
  const endChat = () => {
    console.log("end chat");
    chatUnsubscribeList.current.forEach((unsubscribe) => unsubscribe());
  };

  const addUserDataListening = (userId) => {
    if (userList.current.includes(userId)) return;
    userList.current.push(userId);

    const unsubscribeUserData = onSnapshot(
      doc(db, "userPublicData", userId),
      (doc) => {
        if (!doc.exists) return;
        const data = doc.data();
        setUserData((prev) => {
          return {
            ...prev,
            [userId]: {
              ...prev[userId],
              ...data,
            },
          };
        });
      }
    );
    chatUnsubscribeList.current.push(unsubscribeUserData);
  };

  const addContact = async (friendCode) => {
    const { success } = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        friendCode,
      }),
    }).then((res) => res.json());
    return success;
  };

  const [message, setMessage] = useState({});
  const addContactMessageListening = (docId) => {
    if (contactList.includes(docId)) return;

    const unsubscribeContactMessage = onSnapshot(
      query(
        collection(db, "contact", docId, "message"),
        orderBy("createdAt", "desc"),
        limit(50)
      ),
      (snapshot) => {
        snapshot.docChanges().forEach(async (_snapshot) => {
          const { createdAt, content, sentBy } = _snapshot.doc.data();
          const id = _snapshot.doc.id;

          if (_snapshot.type === "removed") {
          } else {
            setMessage((prev) => {
              let newMessageList = prev[docId] || [];
              const i = newMessageList.findIndex((item) => item.id === id);
              if (i === -1) {
                newMessageList.push({
                  id: _snapshot.doc.id,
                  sentBy,
                  createdAt: createdAt,
                  content: content,
                });
              } else {
                newMessageList[i] = {
                  id: _snapshot.doc.id,
                  sentBy,
                  createdAt: createdAt,
                  content: content,
                };
              }

              newMessageList = newMessageList.sort((a, b) => {
                return b.createdAt - a.createdAt;
              });

              return {
                ...prev,
                [docId]: newMessageList,
              };
            });
          }
        });
      }
    );
    chatUnsubscribeList.current.push(unsubscribeContactMessage);
  };

  const sendMessage = async (contactId, content) => {
    if (!content.trim().length) return;

    const createdAt = Date.now();
    const id = randomString(20);

    // render first
    setMessage((prev) => {
      let newMessageList = prev[contactId] || [];
      newMessageList.push({
        id,
        sentBy: user.sub,
        createdAt,
        content,
      });
      newMessageList = newMessageList.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
      return {
        ...prev,
        [contactId]: newMessageList,
      };
    });

    await fetch("/api/message", {
      method: "POST",
      body: JSON.stringify({
        id,
        contactId,
        content,
        createdAt,
      }),
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        addContact,
        contactData,
        contactList,
        userData,
        sendMessage,
        message,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  return useContext(FirebaseContext);
};
