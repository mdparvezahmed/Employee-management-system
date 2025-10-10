const Employee = require('../models/Employee');
const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }

});

const upload = multer({
    storage: storage
})

const addEmployee = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        const {
            name,
            email,
            password,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            image,
            salary,
            role


        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !employeeId || !dob || !gender || !maritalStatus || !designation || !department || !salary) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Profile image is required'
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            console.log('User already exists with email:', email);
            return res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'employee',
            profileImage: req.file ? req.file.filename : '',


        });
        const savedUser = await newUser.save();

        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId,
            name,
            email,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            image: req.file ? req.file.filename : '',
            password: hashedPassword,
            role: role || 'employee'
        });

        await newEmployee.save();

        res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            employee: newEmployee
        });
    } catch (error) {
        console.log('Error in addEmployee:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
}

const getEmployee = async (req, res) => {


    try {
        const employees = await Employee.find().populate('userId', {password: 0}).populate('department');
        return res.status(200).json({
            success: true,
            employees
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: 'get employee controller ' + error.message
        })
    }
}

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id)
            .populate('userId', { password: 0 })
            .populate('department');
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            employee
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: 'get employee by id controller ' + error.message
        });
    }
}

const editEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            password,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            role
        } = req.body;

        // Find the employee
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // Update fields
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (employeeId) updateData.employeeId = employeeId;
        if (dob) updateData.dob = dob;
        if (gender) updateData.gender = gender;
        if (maritalStatus) updateData.maritalStatus = maritalStatus;
        if (designation) updateData.designation = designation;
        if (department) updateData.department = department;
        if (salary) updateData.salary = salary;
        if (role) updateData.role = role;

        // Handle image update
        if (req.file) {
            updateData.image = req.file.filename;
        }

        // Handle password update
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // Update employee
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('department');

        // Also update user data if email, name, role, or password changed
        const userUpdateData = {};
        if (name) userUpdateData.name = name;
        if (email) userUpdateData.email = email;
        if (role) userUpdateData.role = role;
        if (req.file) userUpdateData.profileImage = req.file.filename;
        if (password && password.trim() !== '') {
            userUpdateData.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(userUpdateData).length > 0) {
            await User.findByIdAndUpdate(employee.userId, userUpdateData);
        }

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            employee: updatedEmployee
        });
    } catch (error) {
        console.log('Error in editEmployee:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
}

module.exports = { addEmployee, upload, getEmployee, getEmployeeById, editEmployee };