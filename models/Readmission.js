const mongoose = require("mongoose");

const readmissionSchema = new mongoose.Schema({
    readmission_id: { type: Number, required: true, unique: true },
    procedure_id: { type: Number, required: true, ref: "Procedures" },
    admission_date: { type: Date, required: true },
    discharge_date: { type: Date },
    specialty: { type: String, required: true }  // Orthopedics, Rheumatology, Infectious diseases
});

module.exports = mongoose.model("Readmissions", readmissionSchema);
