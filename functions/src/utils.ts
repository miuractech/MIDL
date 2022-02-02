import { auth } from "./config";
import { TRole } from "./types";

export async function assignRole(data: TRole, roleArray: Array<string>) {
  try {
    const user = await auth.getUserByEmail(data.email);
    if (user && roleArray.includes(data.role)) {
      await auth.setCustomUserClaims(user.uid, { role: data.role });
    }
  } catch (error) {
    throw error;
  }
}
