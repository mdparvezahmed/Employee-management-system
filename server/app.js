const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const dbConnect = require('./config/dbconnect.js');
const authRoutes = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoute.js");
const departmentRouter = require("./routes/department.js");
const employeeRouter = require("./routes/employee.js");

dbConnect();

//middleware
const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true
}));

app.use(express.json());

// Serve static files from public/uploads directory
app.use('/uploads', express.static('public/uploads'));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});


//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);


//run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
});