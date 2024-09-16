const mongoose = require("mongoose");

const surveillanceModelSchema = new mongoose.Schema({
    model_id: { type: Number, required: true, unique: true },
    model_name: { type: String, required: true },
    description: { type: String },
    required_categories: { type: Number, required: true }  // Number of categories that need to be fulfilled (e.g., m1, m2, etc.)
});

module.exports = mongoose.model("SurveillanceModels", surveillanceModelSchema);
