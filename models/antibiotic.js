const mongoose = require("mongoose");

const antibioticSchema = new mongoose.Schema({
    antibiotic_id: { type: Number, required: true, unique: true },
    procedure_id: { type: Number, required: true, ref: "Procedures" },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    days_of_exposure: { type: Number, required: true }
});

module.exports = mongoose.model("Antibiotics", antibioticSchema);
