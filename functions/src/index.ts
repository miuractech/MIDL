import * as functions from "firebase-functions";
import { getAuth } from "firebase-admin/auth";
import { initializeApp } from "firebase-admin";

import { TRole } from "./types";

initializeApp();

exports.assignRole = functions.firestore
  .document("roles/{docId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data() as TRole;
    try {
      const user = await getAuth().getUserByEmail(data.email);
      console.log(user);
      if (user) {
        getAuth().setCustomUserClaims(user.uid, { role: data.role });
      }
    } catch (error) {
      console.error(error);
    }
  });
