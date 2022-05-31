import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { auth, db } from "../../libs/firebase";
import { randomString } from "../../libs/crypto";

export default withApiAuthRequired(async (req, res) => {
  if (req.method !== "GET") return res.status(400).send();
  const { user } = getSession(req, res);

  // check for name
  const myPublicData = await db
    .collection("userPublicData")
    .doc(user.sub)
    .get();
  if (!myPublicData.exists) {
    // help set
    await db
      .collection("userPublicData")
      .doc(user.sub)
      .set({
        avatar: {
          type: user.picture ? 1 : 0,
          url: user.picture || "",
        },
        name: user.name,
        friendCode: randomString(8),
      });
  }

  const token = await auth.createCustomToken(user.sub);

  // pass
  return res.json({
    token,
  });
});

/*
Status
1: pass,
2: miss key,
3: miss user name
*/
