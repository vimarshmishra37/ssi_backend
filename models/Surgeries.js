const mongoose = require("mongoose");

const surgerySchema = new mongoose.Schema({
    surgery_id: { type: Number, required: true, unique: true },
    procedure_id: { type: Number, required: true, ref: "Procedures" },
    surgery_date: { type: Date, required: true },
    surgery_type: { type: String, required: true }  // Type of surgery (e.g., revision surgery)
});

module.exports = mongoose.model("Surgeries", surgerySchema);
