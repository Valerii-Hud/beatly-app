import { clerkClient } from '@clerk/express';

export const protectRoute = async (req, res, next) => {
  try {
    if (!req.auth.userId) {
      return res
        .status(401)
        .json({ message: 'Unauthorize - you must be logged in' });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
    if (isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({ currentUser, message: 'Unauthorize - you must be logged in' });
    }
  } catch (error) {
    next(error);
  }
};
