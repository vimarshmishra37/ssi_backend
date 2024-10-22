// patientSchema.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    patient_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    admission_date: { type: Date, required: true },
    discharge_date: { type: Date },
    procedure_name: { type: String, required: true },
    admittingDepartment: { type: String, required: true },
    surgeon: { type: String, required: true },
    theatre: { type: String, required: true },
    wound_class: { type: String, enum: ['clean', 'cleanContaminated', 'contaminated', 'dirtyInfected'], required: true },
    pap_given: { type: String, enum: ['yes', 'no'], required: true },
    antibiotics_given: { type: String },
    duration_of_pap: { type: String },
    ssi_event_occurred: { type: String, enum: ['yes', 'no'], required: true },
    event_date: { type: Date }
});

module.exports = mongoose.model("Patients", patientSchema);
