import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface ILead
  extends Document {
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
  createdAt: Date;
}

const LeadSchema =
  new Schema<ILead>(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      company: {
        type: String,
      },

      status: {
        type: String,
        enum: [
          "New",
          "Contacted",
          "Qualified",
          "Lost",
        ],
        default: "New",
      },

      source: {
        type: String,
        enum: [
          "Website",
          "Instagram",
          "Referral",
        ],
        default: "Website",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<ILead>(
  "Lead",
  LeadSchema
);