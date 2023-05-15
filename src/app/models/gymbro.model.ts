export interface Gymbro {
  id: string;
  partnerId: string;
  name: string;
  lastName: string;
  internalId?: string;
  created: Date;
  updated?: Date;
  subscriptionStart: Date;
  subscriptionEnd?: Date;
  subscriptionLap?: number; //number of months
  phone?: string;
  email?: string;
}
