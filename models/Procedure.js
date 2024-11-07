// procedureSchema.js
const mongoose = require("mongoose");

const procedureSchema = new mongoose.Schema({
    procedure: { type: String, required: true, unique: true },
    patient_id: { type: Number, required: true, ref: "Patients" },
    procedure_type: { type: String, required: true },  // THA or TKA
    surgery_date: { type: Date, required: true }
});

module.exports = mongoose.model("Procedures", procedureSchema);
