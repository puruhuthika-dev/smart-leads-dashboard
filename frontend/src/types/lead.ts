export interface Lead {
  _id?: string;

  name: string;

  email: string;

  company: string;

  status:
    | "New"
    | "Contacted"
    | "Qualified"
    | "Lost";

  source:
    | "Website"
    | "Instagram"
    | "Referral";

  createdAt?: string;
}