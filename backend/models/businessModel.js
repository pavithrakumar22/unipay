// backend/models/businessModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const businessSchema = mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      unique: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
businessSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
businessSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Business = mongoose.model('Business', businessSchema);

export default Business;