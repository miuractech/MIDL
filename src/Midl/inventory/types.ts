import { TFirestoreDefault } from "rxf";

export interface TLocation extends TFirestoreDefault {
  name: string;
  index: number;
  contactInfo: string;
  isDefault: boolean;
  address: {
    addressOne: string;
    addressTwo: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}
