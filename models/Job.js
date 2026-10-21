const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  businessName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  jobType: { 
    type: String, 
    enum: ['part-time', 'full-time'], 
    required: true 
  },
  salaryMin: { type: Number, required: true },
  salaryMax: { type: Number, required: true },
  salaryType: { 
    type: String, 
    enum: ['monthly', 'daily', 'hourly'], 
    required: true 
  },
  location: {
    city: { type: String, required: true },
    area: { type: String }
  },
  workTimings: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'closed'], 
    default: 'open' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);