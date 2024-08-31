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
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please fill a valid email address']
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
