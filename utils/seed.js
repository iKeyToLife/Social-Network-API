const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path as needed
const Thought = require('../models/Thought');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
mongoose.connect(process.env.DB_URL, {
}).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection error:', err);
});

const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Thought.deleteMany({});

        // Create users
        const users = await User.insertMany([
            {
                username: 'john',
                email: 'john@example.com',
            },
            {
                username: 'jane',
                email: 'jane@example.com',
            },
            {
                username: 'alice',
                email: 'alice@example.com',
            },
        ]);

        // Create thoughts and associate with users
        const thoughts = await Thought.insertMany([
            {
                thoughtText: 'This is John’s first thought!',
                username: users[0].username,
            },
            {
                thoughtText: 'Jane is having a great day!',
                username: users[1].username,
            },
            {
                thoughtText: 'Alice is learning world!',
                username: users[2].username,
            },
        ]);

        // Associate thoughts with users
        await User.findByIdAndUpdate(users[0]._id, { $push: { thoughts: thoughts[0]._id } });
        await User.findByIdAndUpdate(users[1]._id, { $push: { thoughts: thoughts[1]._id } });
        await User.findByIdAndUpdate(users[2]._id, { $push: { thoughts: thoughts[2]._id } });

        console.log('Seed data inserted successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();