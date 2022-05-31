import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { db } from "../../libs/firebase";
import { randomString } from "../../libs/crypto";

export default withApiAuthRequired(async (req, res) => {
  if (req.method !== "POST") return res.status(400).send();
  const {
    id = randomString(20),
    contactId,
    content,
    createdAt,
  } = JSON.parse(req.body);
  if (!contactId || !content || !createdAt) return res.status(400).send();
  const { user } = getSession(req, res);

  const contact = await db.collection("contact").doc(contactId).get();
  if (!contact.exists || !contact.data().userList.includes(user.sub))
    return res.status(400).send();

  await db
    .collection("contact")
    .doc(contactId)
    .collection("message")
    .doc(id)
    .set({
      sentBy: user.sub,
      content,
      createdAt,
    });

  res.send();
});
