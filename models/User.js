const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address']
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'thought',
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'user',
        }]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);


// Convert email to lowercase before saving and finding
userSchema.pre('save', async function (next) {
    this.email = this.email.toLowerCase();

    // check unique username
    const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${this.username}$`, 'i') } });
    if (existingUser) {
        return next(new Error('Username already exists with different case.'));
    }

    next();
});

userSchema.pre('findOne', function (next) {
    const email = this.getQuery().email;
    if (email) {
        this.getQuery().email = email.toLowerCase();
    }
    next();
});

// Create a virtual property friendCount return count friends
userSchema
    .virtual('friendCount')
    // Getter
    .get(function () {
        return this.friends.length;
    })

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;
