const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  jobTitle: { type: String, required: true },
  worker: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'shortlisted', 'hired', 'rejected'], 
    default: 'pending' 
  },
  workerSnapshot: {
    name: { type: String },
    phone: { type: String },
    skills: [{ type: String }]
  }
}, { timestamps: true });

// Ek worker ek job pe sirf ek baar apply kar sakta hai
applicationSchema.index({ job: 1, worker: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);