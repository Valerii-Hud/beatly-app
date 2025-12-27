import { User } from './../models/user.model.js';

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      const newUser = await User.create({
        imageUrl,
        clerkId: id,
        fullName: `${firstName || ''} ${lastName || ''}`.trim(),
      });
    }
    res.status(200).json({ newUser, success: true });
  } catch (error) {
    next(error);
  }
};
