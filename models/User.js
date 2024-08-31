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

// Save unique field
userSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

// Convert email to lowercase before saving and finding
userSchema.pre('save', function (next) {
    this.email = this.email.toLowerCase();
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
