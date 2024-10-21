// antibioticsSchema.js
const mongoose = require("mongoose");

const antibioticSchema = new mongoose.Schema({
    antibiotic_id: { type: Number, required: true, unique: true },
    procedure_id: { type: Number, required: true, ref: "Procedures" },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    days_of_exposure: { type: Number, required: true },
    isolate_data: [
        {
            organism: { type: String, required: true },
            sensitivity: { type: String },
            resistance: { type: String },
            intermediate: { type: String }
        }
    ]
});

module.exports = mongoose.model("Antibiotics", antibioticSchema);
