const express = require('express');
const moment = require('moment');
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { name, workingHours } = req.body;

  if (!name || !workingHours || !workingHours.start || !workingHours.end) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newDoctor = new Doctor({ name, workingHours });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});


module.exports = router;
