import React, { useState } from 'react';
import './docter.css';

export const DoctorAdd = () => {
    const [doctor, setDoctor] = useState({
        name: '',
        workingHours: { start: '', end: '' }
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctor((prev) =>
            name === 'name'
                ? { ...prev, name: value }
                : { ...prev, workingHours: { ...prev.workingHours, [name]: value } }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (doctor.workingHours.start >= doctor.workingHours.end) {
            setMessage({ type: 'error', text: 'End time must be later than start time.' });
            return;
        }

        const doctorData = {
            name: doctor.name,
            workingHours: { start: doctor.workingHours.start, end: doctor.workingHours.end }
        };

        try {
            const response = await fetch('https://baby-steps-backend-2.onrender.com/doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doctorData),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Doctor added successfully!' });
                setDoctor({ name: '', workingHours: { start: '', end: '' } });
            } else {
                setMessage({ type: 'error', text: 'Failed to add doctor. Please try again.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error occurred while adding doctor.' });
            console.error('Error:', error);
        }
    };

    return (
        <div className="doctor-add-container">
            <h2>Add Doctor</h2>

            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                    <button className="close-message" onClick={() => setMessage(null)}>×</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="doctor-form">
                <div className="form-group">
                    <label>Doctor Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={doctor.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Start Time:</label>
                    <input
                        type="time"
                        name="start"
                        value={doctor.workingHours.start}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>End Time:</label>
                    <input
                        type="time"
                        name="end"
                        value={doctor.workingHours.end}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Add Doctor</button>
            </form>
        </div>
    );
};
