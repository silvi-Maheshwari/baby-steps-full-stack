import React, { useState, useEffect } from 'react';
import './appointments.css';
import { Link } from 'react-router-dom';

export const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('https://baby-steps-backend-2.onrender.com/appointments');
                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="appointments-wrapper">
            <div className="appointments-header">
                <h2>Appointments List</h2>
                <Link to="/add-doctor" className="add-doctor-btn">Add New Doctor</Link>
            </div>

            {loading && <p className="loading">Loading appointments...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && appointments.length === 0 && (
                <p className="no-appointments">No appointments available.</p>
            )}

            <ul className="appointments-list">
                {appointments.map((appointment) => (
                    <li key={appointment._id} className="appointment-card">
                        <h3>{appointment.patientName}</h3>
                        <p><strong>Date & Time:</strong> {new Date(appointment.date).toLocaleString()}</p>
                        <p><strong>Duration:</strong> {appointment.duration} minutes</p>
                        <p><strong>Type:</strong> {appointment.appointmentType}</p>
                        {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
};
