import { Router } from 'express';
import { User } from '../models/user.model.js';

const router = Router();

router.get('/:id', async (req, res) => {
  const { id } = await req.params;
  console.log(id);
  // try {
  //   const user = await User.findById(id);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  // } catch (error) {
  //   console.error(`Error in user route: ${error.message}`);
  //   res.status(404).json({ error, message: 'Error not found' });
  // }
});

export default router;
