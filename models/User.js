const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['owner', 'worker'], required: true },
  
  // Owner fields
  businessName: { type: String },
  businessType: { type: String },
  businessAddress: { type: String },
  
  // Worker fields
  skills: [{ type: String }],
  experience: { type: String },
  availability: { type: String },
  bio: { type: String },
  
}, { timestamps: true });

// Password hash karo save se pehle
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Password compare karo login ke liye
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
