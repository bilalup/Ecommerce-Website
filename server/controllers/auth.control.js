import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const Signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User with this email already exists" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user using User model
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: email === "bstech500@gmail.com" // Simplified admin check
        });

        // Save the user to database
        const savedUser = await newUser.save();

        generateTokenAndSetCookie(res, savedUser._id);
        
        res.status(201).json({ 
            success: true, 
            message: "User registered successfully",
            user: {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                isAdmin: savedUser.isAdmin
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Login endpoint (this is correct as is)
export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email});
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        } else {
            generateTokenAndSetCookie(res, user._id);
            res.status(200).json({ success: true, message: "Login successful", user });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Logout Endpoint (correct as is)
export const Logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,         // must match the login cookie
        sameSite: "none",     // must match too
        path: "/",            // must match
    });
    res.status(200).json({ success: true, message: "Logout successful" });
}

// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, message: "Users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// get one user
export const GetOneUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User fetched successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// update User Profile
export const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { name, email, isAdmin } = req.body;
    try {
        if (!name && !email && !isAdmin) {
            return res.status(400).json({ success: false, message: "Name or email is required" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (isAdmin) user.isAdmin = isAdmin;
        await user.save();
        res.status(200).json({ success: true, message: "User profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
       
}

// delete User
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Check Auth
export const CheckAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(200).json({ 
                isAuthenticated: false,
                user: null
            });
        }

        res.status(200).json({
            isAuthenticated: true,
            user: req.user
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(200).json({
            isAuthenticated: false,
            user: null
        });
    }
};