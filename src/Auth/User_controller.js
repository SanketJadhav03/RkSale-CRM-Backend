
const { Op } = require("sequelize");
const User = require("./User_model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = async (req, res) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Find the user by email in the database
        const user = await User.findOne({ where: { email: email } });

        // If the user is not found, return an error
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return an error
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid Password' });
        }

        // Passwords match, generate a JWT token for authentication
        const token = jwt.sign({ userId: user.id }, 'replace-with-a-strong-secret-key', {
            expiresIn: '1h',
        });
        // const token = 'yourAuthToken'; // Replace with a real authentication token
        res.cookie('authToken', token, { httpOnly: true, secure: true });


        // Return the token in the response
        res.status(200).json({ user, token });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const index = async (req, res) => {
    try {
        const userstatus = await User.findAll();
        res.json(userstatus);
    } catch (error) {
        console.log(error);
    }
}
const store = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            user_type,
            hr_type,
            name,
            address,
            user_role_id,
            salary,
            mobile_no,
            emergency_contact,
            profile_photo,
            email,
            aadhar_card,
            pan_card,
            bank_passbook,
            password,

        } = req.body;
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a new user in the database
        const newUser = await User.create({
            user_type,
            hr_type,
            name,
            address,
            user_role_id,
            salary,
            mobile_no,
            emergency_contact,
            profile_photo,
            email,
            aadhar_card,
            pan_card,
            bank_passbook,
            password: hashedPassword,
            status: 1
        });

        // Send a success response with the created user data
        res.status(201).json(newUser);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
// const show = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const branch = await Branch.findByPk(id);
//         if (!branch) {
//             return res.status(404).json({ error: "Branch not found" });
//         }
//         res.json(branch);
//     } catch (error) {
//         console.error("Error showing branch by id:", error);
//         res.status(500).json({ error: "Error showing branch by id" });
//     }
// }
const updated = async (req, res) => {
    try {
        // const userId = req.params.id;
        const {
            id,
            name,
            address,
            salary,
            mobile_no,
            emergency_contact,
            profile_photo,
            email,
            aadhar_card,
            pan_card,
            bank_passbook,

        } = req.body;
        // res.status(200).json(req.body);
        // Find the user by ID
        const user = await User.findOne(id);
        // res.status(200).json(user);

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user information
        user.name = name || user.name;
        user.address = address || user.address;
        user.salary = salary || user.salary;
        user.mobile_no = mobile_no || user.mobile_no;

        user.bank_passbook = bank_passbook || user.bank_passbook;
        user.pan_card = pan_card || user.pan_card;
        user.aadhar_card = aadhar_card || user.aadhar_card;
        user.email = email || user.email;

        user.profile_photo = profile_photo || user.profile_photo;
        user.emergency_contact = emergency_contact || user.emergency_contact;


        // Save the updated user to the database
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
// const deleted = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const branch = await Branch.findByPk(id);
//         if (!branch) {
//             return res.status(404).json({ error: "Branch not found" });
//         }
//         await branch.destroy();
//         return res.json({ message: "Branch deleted successfully!", status: 1 });
//     } catch (error) {
//         console.error("Error deleting branch:", error);
//         res.status(500).json({ error: "Error deleting branch:" });
//     }
// }
module.exports = {
    index,
    login,
    store,
    updated,
    // deleted
};