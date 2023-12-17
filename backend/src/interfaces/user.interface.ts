import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly addresses: Address[];
  readonly role: string;
  readonly phoneNo: string;
  readonly password: string;
}

interface Address {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
}
