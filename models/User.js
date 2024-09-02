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

userSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const previousUser = await User.findOne(this.getQuery()); // find prevUser
        if (!previousUser) {
            return next();
        }
        const update = this.getUpdate();

        // email to lower case
        if (update.$set) {
            update.$set.email = update.$set.email.toLowerCase();

            // check unique username
            if (update.$set.username && update.$set.username !== previousUser.username) {
                const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${update.$set.username}$`, 'i') } });
                if (existingUser) {
                    return next(new Error('Username already exists with different case.'));
                }
            }

            // update Thought.username, if update username
            if (update.$set.username) {
                if (previousUser && previousUser.username !== update.$set.username) {
                    const Thought = require('./Thought');
                    await Thought.updateMany(
                        { username: new RegExp(`^${previousUser.username}$`, 'i') }, // find all Thought with prevUser.username
                        { $set: { username: update.$set.username } } // update username
                    );
                }
            }
        }


        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.pre('findOneAndDelete', async function (next) {
    try {
        const user = await this.model.findOne(this.getQuery());

        if (user) {
            const Thought = require('./Thought');
            // delete all thought if found user
            await Thought.deleteMany({ username: { $regex: new RegExp(`^${user.username}$`, 'i') } });
        }

        next();

    } catch (error) {
        next(error)
    }
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
