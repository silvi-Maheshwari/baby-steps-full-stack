import React, { useState, useEffect } from 'react';
import './appointment.css';
import { Link, useParams } from 'react-router-dom';

export const AppointmentForm = () => {
  const { doctorId } = useParams();
  const [appointment, setAppointment] = useState({
    doctorId: doctorId || '',
    date: '',
    duration: '',
    appointmentType: '',
    patientName: '',
    notes: ''
  });
  console.log("Parameter value (dc):", doctorId);
  
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://baby-steps-backend-2.onrender.com/doctors');
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          console.error('Failed to fetch doctors');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://baby-steps-backend-2.onrender.com/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Appointment added successfully:', result);
        setAppointment({ doctorId: doctorId || '', date: '', duration: '', appointmentType: '', patientName: '', notes: '' });
      } else {
        console.error('Failed to add appointment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="appointment-container">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label>Doctor:</label>
          <select name="doctorId" value={appointment.doctorId} onChange={handleChange} required>
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date & Time:</label>
          <input type="datetime-local" name="date" value={appointment.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Duration (Minutes):</label>
          <input type="number" name="duration" value={appointment.duration} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Appointment Type:</label>
          <input type="text" name="appointmentType" value={appointment.appointmentType} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Patient Name:</label>
          <input type="text" name="patientName" value={appointment.patientName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Notes (Optional):</label>
          <textarea name="notes" value={appointment.notes} onChange={handleChange}></textarea>
        </div>
        <button type="submit" className="submit-button">Book Appointment</button>
      </form>
      <Link to={"/appointmentspt"}>Check app Booking</Link>
    </div>
       
  );
};