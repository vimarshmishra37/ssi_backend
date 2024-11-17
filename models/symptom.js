const mongoose = require('mongoose');

// Define the subdocument schema for each day (contains the day number and status)
const daySchema = new mongoose.Schema({
  day: { type: Number },  // Day number (e.g., day 1, day 2)
  status: { type: String, enum: ['tick', 'cross']},  // Status (tick or cross)
});

const symptomSchema = new mongoose.Schema({
  symptom_name: String,
  days: [daySchema],
});

const symptom= new mongoose.Schema({
  patient_id: { type: String, required: true, unique: true },
  symptoms: [symptomSchema], // Array of symptoms for the patient
});
module.exports=mongoose.model("symptom",symptom)
