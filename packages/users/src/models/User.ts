import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  username: string;
  email: string;
  password: string;

  profile: {
    name?: string;
    gender?: string;
    location?: string;
    website?: string;
    teamName?: string;
    teamId?: string;
    projectIds?: string[];
  };

  comparePassword: comparePasswordFunction;
}


type comparePasswordFunction =
  (candidatePassword: string) => Promise<boolean>;

const comparePassword: comparePasswordFunction = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const userSchema = new mongoose.Schema({
  username: {
    type: String, unique: true, required: true, lowercase: true, minlength: 3,
  },
  email: {
    type: String, unique: true, required: true, lowercase: true,
  },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    teamName: String,
    teamId: String,
    projectIds: [String],
  },

}, { timestamps: true });


/* Password encryption when save() is called if the password is modified. */
userSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();
});

userSchema.method('comparePassword', comparePassword);

export const User = mongoose.model<UserDocument>('User', userSchema);
