// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const doctorRoutes = require('./routes/doctorRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes');
// const errorHandler = require('./middleware/errorMiddleware');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// app.use('/doctors', doctorRoutes);
// app.use('/appointments', appointmentRoutes);

// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors());

app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
