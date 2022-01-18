import * as functions from "firebase-functions";

import { auth } from "./config";
import { roles } from "./constants";
import { TRole } from "./types";

exports.assignRoleOnCreate = functions.firestore
  .document("roles/{docId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data() as TRole;
    try {
      const user = await auth.getUserByEmail(data.email);
      if (user && roles.includes(data.role)) {
        await auth.setCustomUserClaims(user.uid, { role: data.role });
      }
    } catch (error) {
      console.error(error);
    }
  });

exports.assignRoleOnUpdate = functions.firestore
  .document("roles/{docId}")
  .onUpdate(async (snapshot, context) => {
    const data = snapshot.after.data() as TRole;
    try {
      const user = await auth.getUserByEmail(data.email);
      if (user && roles.includes(data.role)) {
        await auth.setCustomUserClaims(user.uid, { role: data.role });
      }
    } catch (error) {
      console.error(error);
    }
  });
