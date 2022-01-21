import * as functions from "firebase-functions";

import { AdminRole, StaffRoles } from "./constants";
import { TRole } from "./types";
import { assignRole } from "./utils";

exports.assignStaffRoleOnCreate = functions.firestore
  .document("roles/{docId}")
  .onCreate(async (snapshot, context) => {
    await assignRole(snapshot.data() as TRole, StaffRoles);
  });

exports.assignStaffRoleOnUpdate = functions.firestore
  .document("roles/{docId}")
  .onUpdate(async (snapshot, context) => {
    await assignRole(snapshot.after.data() as TRole, StaffRoles);
  });

exports.assignAdminRoleOnCreate = functions.firestore
  .document("admin/{docId}")
  .onCreate(async (snapshot, context) => {
    await assignRole(snapshot.data() as TRole, AdminRole);
  });

exports.assignAdminRoleOnUpdate = functions.firestore
  .document("admin/{docId}")
  .onUpdate(async (snapshot, context) => {
    await assignRole(snapshot.after.data() as TRole, AdminRole);
  });
