const e = require("express");
const mongoose = require("mongoose");
const { EventEmitterAsyncResource } = require("nodemailer/lib/xoauth2");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const patientSchema = new mongoose.Schema({
  patient_id: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true ,unique: true},
  age: { type: Number, required: true }, // Age in years
  height: { type: Number }, // Height in centimeters (cm)
  diabietic: { type: String, enum: ['yes', 'no'], required: true },
  weight: { type: Number }, // Weight in kilograms (kg)
  bmi: { type: Number }, // Body Mass Index (BMI)
  gender: { type: String, required: true },
  admission_date: { type: Date, required: true },
  discharge_date: { type: Date },
  procedure_name: { type: String, required: true },
  admittingDepartment: { type: String, required: true },
  surgeon: { type: String, required: true },
  theatre: { type: String, required: true },
  wound_class: {
    type: String,
    enum: ['clean', 'cleanContaminated', 'contaminated', 'dirtyInfected'],
    required: true
  },
  pap_given: { type: String, enum: ['yes', 'no'], required: true },
  antibiotics_given: { type: String },
  duration_of_pap: { type: String },
  ssi_event_occurred: { type: String, enum: ['yes', 'no'], required: true },
  event_date: { type: Date },

  // New fields from the Antibiotic Susceptibility Form
  microorganisms: {
    organism1: { type: String },
    organism2: { type: String }
  },

  isolate1: [
    {
      sensitive: { type: String },
      resistant: { type: String },
      intermediate: { type: String }
    }
  ],

  isolate2: [
    {
      sensitive: { type: String },
      resistant: { type: String },
      intermediate: { type: String }
    }
  ],

  // New fields for antibiotics and times
  priorAntibiotics: [
    {
      name: { type: String },
      route: { type: String },
      duration: { type: String },
      doses: { type: Number }
    }
  ],

  prePeriAntibiotics: [
    {
      name: { type: String },
      route: { type: String },
      duration: { type: String },
      doses: { type: Number }
    }
  ],

  postAntibiotics: [
    {
      name: { type: String },
      route: { type: String },
      duration: { type: String },
      doses: { type: Number }
    }
  ],

  times: {
    induction: { type: String },
    incision: { type: String },
    surgeryEnd: { type: String }
  }
});
patientSchema.plugin( AutoIncrement, { inc_field: "patient_id", start_seq: 1000 });

module.exports = mongoose.model("Patients", patientSchema);
