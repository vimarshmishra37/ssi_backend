const express = require('express');
const router = express.Router();
const user = require('../models/users');
const bcrypt = require('bcrypt');
const { getToken } = require('../utils/helper');
const Patient = require('../models/Patient');
const Antibiotic = require('../models/antibiotic'); 
/* Create user (for testing purpose only) */

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

/* User login */
router.post('/general', async (req, res) => {
    const { name, patient_id, age, gender, admission_date, discharge_date, admittingDepartment, procedure_name, surgeon, theatre, wound_class, pap_given, antibiotics_given, ssi_event_occurred, event_date, duration_of_pap } = req.body;
    console.log(req.body);
    
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
    }
const createdPatient = await Patient.create(newPatient);
    const token = await getToken(patient_id, createdPatient);
    const patientToken = { ...createdPatient.toJSON(), token };
    return res.status(200).json(patientToken);
});

router.post('/procedures', async (req, res) => {
    const { procedure_id, patient_id, procedure_type, surgery_date } = req.body;
    console.log(req.body);
    
    // Check if the patient exists
    const existingPatient = await Patient.findOne({ patient_id: patient_id });
    if (!existingPatient) {
        return res.status(404).json({ Error: "Patient not found" });
    }
    
    // Check if the procedure already exists for this patient
    const existingProcedure = await Procedures.findOne({ procedure_id: procedure_id });
    if (existingProcedure) {
        return res.status(403).json({ Error: "Procedure already exists" });
    }

    // Create a new procedure entry
    const newProcedure = {
        procedure_id,
        patient_id,
        procedure_type,
        surgery_date,
    };

    try {
        const createdProcedure = await Procedures.create(newProcedure);
        return res.status(200).json(createdProcedure);
    } catch (error) {
        console.log(error)
        console.error("Error creating procedure:", error);
        return res.status(500).json({ Error: "An error occurred while creating the procedure" });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const User = await user.findOne({ email: email });
console.log(User);
    if (!User) {
        return res.status(403).json({ Error: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, User.password);
    if (password !== User.password) {
        return res.status(403).json({ Error: "Password is incorrect" });
    }

    const token = await getToken(email, User);
    const userToken = { ...User.toJSON(), token };
    delete userToken.password; // Corrected typo here
    return res.status(200).json(userToken);
});
/*router.post('/antibiotic', async (req, res) => {
    const {
      organism1,
      organism2,
      isolate1,
      isolate2,
      patientId,
    } = req.body;
  
    try {
      // Create a new Antibiotic document with the provided data
      const newAntibiotic = new Antibiotic({
        patient_id: patientId,
        organism1,
        organism2,
        isolates: [
          {
            organism: organism1,
            data: isolate1,
          },
          {
            organism: organism2,
            data: isolate2,
          },
        ],
      });
      await newAntibiotic.save();
      res.status(201).json({ message: 'Antibiotic data saved successfully' });
    } catch (error) {
      console.error('Error saving antibiotic data:', error);
      res.status(500).json({ error: 'Failed to save antibiotic data' });
    }
  });*/
router.post('/register', async (req, res) => {
  console.log(`req.body`, req.body);
  const{email,password,name,age,gender,dob,address,phone,role}=req.body;
  const xuser = await user.findOne({ email: email });
  console.log("wjyefbw",xuser);
  if (xuser) {
    return res.status(403).json({ Error: "User already exists" });
  }
  const newUser = {
    email,
    password: await bcrypt.hash(password, 10),
    name,
    age,
    gender,
    dob,
    address,
    phone,
    role
  };
  const hashPassword = await bcrypt.hash(newUser.password, 10);
  const createdUser = await user.create(newUser);
  const token = await getToken(email, createdUser);
  console.log(createdUser);
  const userToReturn = { ...createdUser.toJSON(), token };
delete userToReturn.password;
return res.status(200).json(userToReturn);

});
module.exports = router;
