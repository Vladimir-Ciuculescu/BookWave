import mongoose, { Model, ObjectId, Schema, mongo } from "mongoose";
import { hash, compare } from "bcrypt";

export interface EmailVertificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

const emailVerificationTokenSchema =
  new Schema<EmailVertificationTokenDocument>(
    {
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
    },
    {
      methods: {
        async compareToken(token) {
          const result = await compare(token, this.token);
          return result;
        },
      },
    }
  );

emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }

  next();
});

// emailVerificationTokenSchema.methods.compareToken = async function (
//   token: string
// ) {
//   const result = await compare(token, this.token);
// };

const EmailVerificationTokenModel = mongoose.model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);

export default EmailVerificationTokenModel as Model<EmailVertificationTokenDocument>;
