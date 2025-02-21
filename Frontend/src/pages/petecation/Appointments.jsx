import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ap.css";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({
        patientName: "",
        date: "",
        duration: "",
        appointmentType: "",
        notes: "",
        doctorId: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get("https://baby-steps-backend-2.onrender.com/appointments");
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`https://baby-steps-backend-2.onrender.com/appointments/${editingId}`, formData);
            } else {
                await axios.post("https://baby-steps-backend-2.onrender.com/appointments", formData);
            }
            setFormData({
                patientName: "",
                date: "",
                duration: "",
                appointmentType: "",
                notes: "",
                doctorId: "",
            });
            setEditingId(null);
            fetchAppointments();
        } catch (error) {
            console.error("Error saving appointment:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://baby-steps-backend-2.onrender.com/appointments/${id}`);
            fetchAppointments();
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    };

    const handleEdit = (appointment) => {
        setFormData({
            patientName: appointment.patientName,
            date: appointment.date.split("T")[0],
            duration: appointment.duration,
            appointmentType: appointment.appointmentType,
            notes: appointment.notes,
            doctorId: appointment.doctorId?._id || "",
        });
        setEditingId(appointment._id);
    };

    return (
        <div className="appointments-container">
            <h2 className="appointments-title">Appointments</h2>
            
            <div className="form-container">
                <form onSubmit={handleSubmit} className="appointment-form">
                    <input type="text" name="patientName" placeholder="Patient Name" value={formData.patientName} onChange={handleChange} required />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    <input type="number" name="duration" placeholder="Duration (minutes)" value={formData.duration} onChange={handleChange} required />
                    <input type="text" name="appointmentType" placeholder="Appointment Type" value={formData.appointmentType} onChange={handleChange} required />
                    <input type="text" name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />
                    <input type="text" name="doctorId" placeholder="Doctor ID" value={formData.doctorId} onChange={handleChange} required />
                    <button type="submit" className="submit-btn">{editingId ? "Update" : "Add"} Appointment</button>
                </form>
            </div>
            
            <div className="appointments-list-container">
                <ul className="appointments-list">
                    {appointments.map((appointment) => (
                        <li key={appointment._id} className="appointment-item">
                            <div className="appointment-info">
                                <strong>{appointment.patientName}</strong> - {appointment.date.split("T")[0]} ({appointment.duration} min)
                            </div>
                            <div className="appointment-actions">
                                <button onClick={() => handleEdit(appointment)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(appointment._id)} className="delete-btn">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Appointments;
