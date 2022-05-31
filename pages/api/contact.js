import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { db } from "../../libs/firebase";

export default withApiAuthRequired(async (req, res) => {
  // validation
  if (req.method !== "POST")
    return res.status(400).json({
      success: 0,
    });
  const { friendCode } = JSON.parse(req.body);
  if (!friendCode)
    return res.status(400).json({
      success: 0,
    });
  const { user } = getSession(req, res);

  // gogogo
  if (req.method == "POST") {
    let userPublicData = await db
      .collection("userPublicData")
      .where("friendCode", "==", friendCode)
      .get();
    if (!userPublicData.docs.length)
      return res.status(400).json({
        success: -1, // friend does not found.
      });
    const userId = userPublicData.docs[0].id; // friend user id

    const contact = await db
      .collection("contact")
      .where(`user.${user.sub}`, "==", true)
      .where(`user.${userId}`, "==", true)
      .get();
    if (!contact.docs.length)
      // if not friend, add!
      await db.collection("contact").add({
        userList: [user.sub, userId],
        user: {
          [user.sub]: true,
          [userId]: true,
        },
      });

    return res.json({
      success: 1,
    });
  }
});
