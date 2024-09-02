const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const User = require('./User');

// Schema to create User model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

thoughtSchema.pre('save', async function (next) {

    // check unique username
    const existingUser = await User.findOneAndUpdate(
        { username: { $regex: new RegExp(`^${this.username}$`, 'i') } },
        { $push: { thoughts: this._id } }, // add id new thought
        { new: true }
    );
    if (!existingUser) {
        return next(new Error('Username not found.'));
    }

    this.username = existingUser.username;
    next();
});


thoughtSchema.pre('findOneAndUpdate', async function (next) {

    const update = this.getUpdate();
    if (update.$set.username) {
        update.$set.username = this.username;
    }

    if (update.$addToSet && update.$addToSet.reactions) {
        const user = update.$addToSet.reactions.username;
        const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${user}$`, 'i') } },);
        if (!existingUser) {
            return next(new Error('Username not found.'));
        } else {
            update.$addToSet.reactions.username = existingUser.username;
        }
    }

    next();
});

// Create a virtual property reactionCount return count friends
thoughtSchema
    .virtual('reactionCount')
    // Getter
    .get(function () {
        return this.reactions.length;
    })

// Initialize our Thought model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
