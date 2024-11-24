// outcomeSchema.js
const mongoose = require("mongoose");
const outcomeSchema = new mongoose.Schema({
    outcome_id: { type: Number, required: true, unique: true },
    procedure_id: { type: Number, required: true, ref: "Procedures" },
    deep_ssi_detected: { type: Boolean, required: true },
    superficial_ssi_detected: { type: Boolean, required: true },
    organ_ssi_detected: { type: Boolean, required: true },
    manual_review_required: { type: Boolean, required: true },
    review_completed: { type: Boolean, required: true }
});

module.exports = mongoose.model("Outcomes", outcomeSchema);
