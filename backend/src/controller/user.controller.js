import { User } from '../models/user.model.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUID = req.auth.userId;
    const users = await User.find({
      clerkId: { $ne: currentUID },
    });
    if (!users) {
      console.warn(`The're no users find in app. Users array: ${users}`);
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
