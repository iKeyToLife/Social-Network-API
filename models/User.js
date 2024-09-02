const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

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

userSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const previousUser = await User.findOne(this.getQuery()); // find prevUser
        if (!previousUser) {
            return next();
        }
        const update = this.getUpdate();

        // email to lower case
        if (update.email) {
            update.email = update.email.toLowerCase();
        }

        // check unique username
        if (update.username) {
            const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${update.username}$`, 'i') } });
            if (existingUser) {
                return next(new Error('Username already exists with different case.'));
            }
        }

        // update Thought.username, if update username
        if (update.username) {
            if (previousUser && previousUser.username !== update.username) {
                await Thought.updateMany(
                    { username: new RegExp(`^${previousUser.username}$`, 'i') }, // find all Thought with prevUser.username
                    { $set: { username: update.username } } // update username
                );
            }
        }

        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.pre('findOneAndDelete', async function (next) {
    const user = await this.model.findOne(this.getQuery());

    if (user) {
        // delete all thought if found user
        await Thought.deleteMany({ username: { $regex: new RegExp(`^${user.username}$`, 'i') } });
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
