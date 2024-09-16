const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    patient_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    admission_date: { type: Date, required: true },
    discharge_date: { type: Date }
});

module.exports = mongoose.model("Patients", patientSchema);
