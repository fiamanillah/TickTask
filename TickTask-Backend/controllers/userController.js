const User = require('../models/userSchema');

// Add user to database (only if not already exists)
const addUser = async (req, res) => {
    try {
        const { uid, email, displayName } = req.body;

        if (!uid || !email || !displayName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let user = await User.findOne({ uid });

        if (!user) {
            user = new User({ uid, email, displayName });
            await user.save();
        }

        res.status(200).json({ message: 'User added successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { addUser };
