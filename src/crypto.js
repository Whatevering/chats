import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createECDH,
} from "crypto";

export const encrypt = async (key, plainText) => {
  // iv
  const iv = randomString(16);

  // encrypted
  const cipher = createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let cipherText = cipher.update(plainText, "utf8", "hex");
  cipherText += cipher.final("hex");

  // auth tag
  const authTag = cipher.getAuthTag().toString("hex");

  // final encrypted
  const payload = iv + cipherText + authTag;
  const payload64 = Buffer.from(payload, "hex").toString("base64");

  return payload64;
};

export const decrypt = async (key, payload64) => {
  try {
    const payload = Buffer.from(payload64, "base64").toString("hex");

    const iv = payload.substr(0, 32);
    const cipherText = payload.substr(32, payload.length - 32 - 32);
    const authTag = payload.substr(payload.length - 32, 32);

    // set iv
    const decipher = createDecipheriv(
      "aes-256-gcm",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );

    // set auth tag
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let plainText = decipher.update(cipherText, "hex", "utf8");
    plainText += decipher.final("utf8");

    return plainText;
  } catch (err) {
    return false;
  }
};

export const randomString = (length) => {
  return randomBytes(length).toString("hex");
};

export const createKey = () => {
  const myKey = createECDH("secp256k1");
  myKey.generateKeys();

  return {
    privateKey: myKey.getPrivateKey().toString("hex"),
    publicKey: myKey.getPublicKey().toString("hex"),
  };
};

export const computeSecret = (myPrivateKey, myPublicKey, publicKey) => {
  const myKey = createECDH("secp256k1");
  myKey.setPrivateKey(myPrivateKey, "hex");

  return myKey.computeSecret(publicKey, "hex", "hex");
};
