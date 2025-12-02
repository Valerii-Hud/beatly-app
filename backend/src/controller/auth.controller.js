import { User } from './../models/user.model.js';

export const authCallback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    const user = User.findOne({ clerkId: id });

    if (!user) {
      const newUser = await User.create({
        imageUrl,
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
      });
    }
    res.status(200).json({ newUser, success: true });
  } catch (error) {
    console.error(`Error in auth callback: ${error.message}`);
    res.status(500).json({ error, message: 'Internal server error' });
  }
};
