import mongoose, { Model, ObjectId, Schema } from "mongoose";

// ? Interfaces
export interface PasswordResetTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

// ? Schema
const passwordResetTokenSchema = new Schema<PasswordResetTokenDocument>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 10,
    default: Date.now(),
    required: true,
  },
});

// ? Model
const PasswordResetTokenModel = mongoose.model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetTokenModel as Model<PasswordResetTokenDocument>;
