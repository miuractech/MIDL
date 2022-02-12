/**
 *
 * Serialized Firebase User Type if You want to Use Redux With Serialized Objects
 *
 */
export interface TApplicationUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  phoneNumber: string | null;
  providerId: string;
}
