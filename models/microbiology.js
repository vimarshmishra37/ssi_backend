const mongoose = require("mongoose");

const microbiologySchema = new mongoose.Schema({
    culture_id: { type: Number, required: true, unique: true },
    procedure_id: { type: Number, required: true, ref: "Procedures" },
    culture_date: { type: Date, required: true },
    positive: { type: Boolean, required: true },
    number_of_cultures: { type: Number, required: true },
    body_site: { type: String, required: true }
});

module.exports = mongoose.model("Microbiology", microbiologySchema);
