import User from "../models/user.js";


// Controller to create a new user
const createUser = async (req, res) => {
  try {
    // Extract phone_number and priority from the request body
    const { phone_number, priority } = req.body;

    // Create a new user instance
    const newUser = new User({ phone_number, priority });

    // Save the new user to the database
    await newUser.save();

    // Return success response
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    // Return error response
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Return users in the response
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return error response
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Other controller methods (update, delete, etc.) can be added as needed

export default {
  createUser,
  getAllUsers
};
