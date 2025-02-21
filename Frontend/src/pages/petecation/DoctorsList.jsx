import React, { useState, useEffect } from 'react';
import './doctors.css';
import { useNavigate } from 'react-router-dom';

export const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('https://baby-steps-backend-2.onrender.com/doctors');
                if (!response.ok) {
                    throw new Error('Failed to fetch doctors');
                }
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);
    const handelAdd = (el) => {
        navigate(`/book-appointment/${el.name}`)
    }
    return (
        <div className="doctors-container">
            <h2>Doctors List</h2>

            {loading && <p>Loading doctors...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && doctors.length === 0 && <p>No doctors available.</p>}

            <ul className="doctors-list">
                {doctors.map((doctor) => (
                    <li key={doctor._id} className="doctor-card" onClick={() => handelAdd(doctor)}>

                        <h3>{doctor.name}</h3>
                        <p><strong>Working Hours:</strong> {doctor.workingHours.start} - {doctor.workingHours.end}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
