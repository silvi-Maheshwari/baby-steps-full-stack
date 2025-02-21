const express = require("express");
const moment = require("moment");
const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");

const router = express.Router();

// @desc Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId", "name");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc Create an appointment
router.post("/", async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } =
      req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointmentStart = moment(date);
    const appointmentEnd = appointmentStart.clone().add(duration, "minutes");

    const existingAppointments = await Appointment.find({
      doctorId,
      date: { $gte: appointmentStart.toDate(), $lt: appointmentEnd.toDate() },
    });

    if (existingAppointments.length > 0) {
      return res.status(400).json({ message: "Time slot is already booked" });
    }

    const newAppointment = await Appointment.create({
      doctorId,
      date,
      duration,
      appointmentType,
      patientName,
      notes,
    });
    console.log(req.body);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc Delete an appointment
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    await appointment.deleteOne();
    res.json({ message: "Appointment canceled" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (doctorId) {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    }

    const appointmentStart = moment(date);
    const appointmentEnd = appointmentStart.clone().add(duration, "minutes");

    const existingAppointments = await Appointment.find({
      doctorId,
      date: { $gte: appointmentStart.toDate(), $lt: appointmentEnd.toDate() },
      _id: { $ne: req.params.id }, // Exclude the current appointment
    });

    if (existingAppointments.length > 0) {
      return res.status(400).json({ message: "Time slot is already booked" });
    }

    appointment.doctorId = doctorId || appointment.doctorId;
    appointment.date = date || appointment.date;
    appointment.duration = duration || appointment.duration;
    appointment.appointmentType = appointmentType || appointment.appointmentType;
    appointment.patientName = patientName || appointment.patientName;
    appointment.notes = notes || appointment.notes;

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
