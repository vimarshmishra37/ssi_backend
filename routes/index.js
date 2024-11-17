const express = require('express');
const router = express.Router();
const user = require('../models/users');
const symptom= require('../models/symptom');
const bcrypt = require('bcrypt');
const { getToken } = require('../utils/helper');
const Patient = require('../models/Patient');
const Antibiotic = require('../models/antibiotic'); 
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vimarshm813@gmail.com',
    pass: 'yefv dtwz ptgi vfox'
  }
})
router.get('/', async function (req, res, next) {
  const newUser = {
    name: "Vimarsh",
    email: "vimarshmishra@gmail.com",
    password: await bcrypt.hash("yourPasswordHere", 10), // Hash the password
    age: 25,
    gender: "Male",
    dob: new Date('1998-01-01'),
    address: "123 Street, City",
    phone: 1234567890,
    role: "User"
  };

  try {
    if (await user.findOne({ email: newUser.email })) {
      return res.send('User already exists');
    }
    const createdUser = await user.create(newUser);
    console.log(createdUser);
    return res.send('User created successfully');
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send('Error creating user');
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  const User = await user.findOne({ email: email });
  if (!User) {
    return res.status(403).json({ Error: "User does not exist" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, User.password);
  if (!isPasswordCorrect) {
    return res.status(403).json({ Error: "Password is incorrect" });
  }

  const token = await getToken(email, User);
  const userToken = { ...User.toJSON(), token };
  delete userToken.password; // Don't return password in response
  return res.status(200).json(userToken);
});

// Patient registration endpoint
router.post('/general', async (req, res) => {
  const { name, patient_id, age, gender, admission_date, discharge_date, admittingDepartment, procedure_name, surgeon, theatre, wound_class, pap_given, antibiotics_given, ssi_event_occurred, event_date, duration_of_pap } = req.body;

  const existingPatient = await Patient.findOne({ patient_id: patient_id });
  if (existingPatient) {
    return res.status(403).json({ Error: "Patient already exists" });
  }

  const newPatient = {
    name,
    patient_id,
    age,
    gender,
    admission_date,
    discharge_date,
    admittingDepartment,
    procedure_name,
    surgeon,
    theatre,
    wound_class,
    pap_given,
    antibiotics_given,
    ssi_event_occurred,
    event_date,
    duration_of_pap
  };

  try {
    const createdPatient = await Patient.create(newPatient);
    const token = await getToken(patient_id, createdPatient);
    const patientToken = { ...createdPatient.toJSON(), token };
    return res.status(200).json(patientToken);
  } catch (error) {
    console.error("Error creating patient:", error);
    return res.status(500).send('Error creating patient');
  }
});

// OTP generation and sending
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Validate the email address
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Mail options
  const mailOptions = {
    from: 'vimarshm813@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  // Sending the OTP email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
      return res.status(500).json({ error: 'Failed to send OTP email' });
    } else {
      console.log('OTP email sent:', info.response);
      return res.status(200).json({ message: 'OTP email sent successfully',otp:otp });
    }
  });
});
// Antibiotics data saving
router.post('/antibiotic', async (req, res) => {
  const { organism1, organism2, isolate1, isolate2, patientId } = req.body;

  try {
    // Find the patient document by patientId
    const patient = await Patient.findOne({ patient_id: patientId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update the relevant fields in the patient document
    patient.microorganisms = { organism1, organism2 };
    patient.isolate1 = isolate1;
    patient.isolate2 = isolate2;

    // Force saving by using validateModifiedOnly option to skip unchanged fields
    await patient.save({ validateModifiedOnly: true });

    res.status(200).json({ message: 'Antibiotic data saved successfully' });
  } catch (error) {
    console.error('Error processing antibiotic data:', error);
    res.status(500).json({ message: 'Error processing antibiotic data', error: error.message });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  const { email, password, name, age, gender, dob, address, phone, role } = req.body;

  const existingUser = await user.findOne({ email: email });
  if (existingUser) {
    return res.status(403).json({ Error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    email,
    password: hashedPassword,
    name,
    age,
    gender,
    dob,
    address,
    phone,
    role
  };

  try {
    const createdUser = await user.create(newUser);
    const token = await getToken(email, createdUser);
    const userToReturn = { ...createdUser.toJSON(), token };
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Get all patients
router.get('/user', async (req, res) => {
  try {
    const patients = await Patient.find();

    res.json({
      success: true,
      patients,
      symptom,
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});
router.post('/user/symptoms/:patient_id', async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { symptoms } = req.body.formData; // Destructure the symptoms from the request

    // Prepare the symptomsData in the expected format (array)
    const symptomsData = Object.keys(symptoms).map(symptomName => {
      return {
        symptom_name: symptomName,
        days: symptoms[symptomName] 
      };
    });

    // Find the patient by patient_id
    let patient = await symptom.findOne({ patient_id: req.params.patient_id });

    if (!patient) {
      console.log("Patient not found, creating a new patient...");

      // If patient doesn't exist, create a new patient with provided symptomsData
      patient = new symptom({
        patient_id: req.params.patient_id,
        symptoms: symptomsData,
      });

      // Save the new patient to the database
      await patient.save();
      console.log("New patient created:", symptom.find());

      return res.json({ message: 'New patient created and symptoms data saved successfully', patient });
    }

    console.log("Patient found, updating symptoms...");

    // If patient exists, update their symptoms
    for (const symptom of symptomsData) {
      const existingSymptom = patient.symptoms.find(s => s.symptom_name === symptom.symptom_name);

      if (existingSymptom) {
        // If the symptom exists, update its days
        existingSymptom.days = symptom.days;
      } else {
        // If the symptom doesn't exist, add a new symptom entry
        patient.symptoms.push({
          symptom_name: symptom.symptom_name,
          days: symptom.days,
        });
      }
    }

    // Save the updated patient record
    await patient.save();
    p=await symptom.find();
    console.log("Patient updated:", p);

    res.json({ message: 'Symptoms data updated successfully', patient });

  } catch (err) {
    console.error("Error in saving/updating patient data:", err);
    res.status(500).send('Server Error');
  }
});

router.get('/user/symptoms/:patient_id', async (req, res) => {
  try {
    const { patient_id } = req.params;
    const patient = await symptom.findOne({ patient_id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/patient', async (req, res) => {
  const { patientId, priorAntibiotics, prePeriAntibiotics, postAntibiotics, times } = req.body;

  try {
    // Find the patient document by patientId
    const patient = await Patient.findOne({ patient_id: patientId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update the relevant fields in the patient document
    patient.priorAntibiotics = priorAntibiotics;
    patient.prePeriAntibiotics = prePeriAntibiotics;
    patient.postAntibiotics = postAntibiotics;
    patient.inductionTime = times.induction;
    patient.incisionTime = times.incision;
    patient.surgeryEndTime = times.surgeryEnd;

    // Force saving by using validateModifiedOnly option to skip unchanged fields
    await patient.save({ validateModifiedOnly: true });

    res.status(200).json({ message: 'Patient data saved successfully' });
  } catch (error) {
    console.error('Error processing patient data:', error);
    res.status(500).json({ message: 'Error processing patient data', error: error.message });
  }
});

// Get specific patient by id
router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findOne({ patient_id: id });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

module.exports = router;
