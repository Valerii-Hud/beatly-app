import { getAuth, clerkClient } from '@clerk/express';

export const protectRoute = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized - login required' });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = await clerkClient.users.getUser(userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === user.primaryEmailAddress?.emailAddress;

    if (!isAdmin)
      return res.status(403).json({ message: 'Forbidden - admin only' });

    next();
  } catch (error) {
    next(error);
  }
};
