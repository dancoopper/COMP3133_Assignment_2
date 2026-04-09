const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const resolvers = {
    Query: {
        login: async (_, { username, password }) => {
            const user = await User.findOne({
                $or: [{ username }, { email: username }]
            });

            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET || 'secret_key_placeholder',
                { expiresIn: '1h' }
            );

            return token;
        },
        getAllEmployees: async () => {
            return await Employee.find();
        },
        searchEmployeeByEid: async (_, { id }) => {
            return await Employee.findById(id);
        },
        searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
            const query = {};
            if (designation) query.designation = designation;
            if (department) query.department = department;
            return await Employee.find(query);
        }
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                throw new Error('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                password: hashedPassword
            });

            await user.save();
            return user;
        },
        addNewEmployee: async (_, args) => {
            // Validate inputs if not using express-validator middleware or Mongoose validation
            // Mongoose validation will handle most constraints defined in the schema

            const existingEmployee = await Employee.findOne({ email: args.email });
            if (existingEmployee) {
                throw new Error('Employee with this email already exists');
            }

            const employee = new Employee(args);
            await employee.save();
            return employee;
        },
        updateEmployeeByEid: async (_, { id, ...updates }) => {
            const employee = await Employee.findByIdAndUpdate(
                id,
                { ...updates, updated_at: Date.now() },
                { new: true, runValidators: true }
            );

            if (!employee) {
                throw new Error('Employee not found');
            }

            return employee;
        },
        deleteEmployeeByEid: async (_, { id }) => {
            const employee = await Employee.findByIdAndDelete(id);
            if (!employee) {
                throw new Error('Employee not found');
            }
            return 'Employee deleted successfully';
        }
    }
};

module.exports = resolvers;
