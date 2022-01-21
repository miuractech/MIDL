import * as admin from "firebase-admin";
const serviceAccountKey = require("../service.account.key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

export const auth = admin.auth();
export const firestore = admin.firestore();
