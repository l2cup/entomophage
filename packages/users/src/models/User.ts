import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;

  profile: {
    name: string;
    gender: string;
    location: string;
    website: string;
    teamName: string;
    teamId: string;
    projectIds: string[];
  };

  comparePassword: comparePasswordFunction;
}

type comparePasswordFunction =
  (candidatePassword: string, cb: (err: Error, isMatch: boolean) => {}) => void;

const comparePassword: comparePasswordFunction = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, cb);
};

const userSchema = new mongoose.Schema({
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

userSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (error: mongoose.Error, hash: string) => {
      if (error) { return next(err); }
      user.password = hash;
      return next();
    });
    return next();
  });
  return next();
});

userSchema.method('comparePassword', comparePassword);

export const User = mongoose.model<UserDocument>('User', userSchema);
