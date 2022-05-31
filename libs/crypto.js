import { randomBytes } from "crypto";

export const randomString = (length) => {
  return randomBytes(length / 2).toString("hex");
};
