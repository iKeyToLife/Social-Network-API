const { User, } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();

      res.json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error', error: err });
    }
  },

  // find user by id
  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId)
        .populate('thoughts')
        .populate('friends');

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error', error: err });
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  },

  // delete user by id
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: `user deleted` })
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  },

  // Update user by id
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  },

  // add friend for user
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  },

  // delete friend from user
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isDeleted = user.friends.some(friend => friend._id.toString() === req.params.friendId);
      if (!isDeleted) {
        return res.status(404).json({ message: 'Friend not found, nothing was deleted.' });
      }

      res.json({ message: 'friend is removed' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  },
}
