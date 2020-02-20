import Router from 'express';
import * as userRoutes from './user';
import * as teamRoutes from './team';

const router = Router();


/* User routes */
router.post('/register', userRoutes.postRegister);
router.post('/login', userRoutes.postLogin);

router.get('/user', userRoutes.getUser);
router.post('/user', userRoutes.postRegister);
router.put('/user', userRoutes.putUpdateUser);
router.delete('/user', userRoutes.deleteUser);

/* Team routes */
router.get('/team', teamRoutes.getTeam);
router.post('/team', teamRoutes.postCreateTeam);
router.put('/team', teamRoutes.putUpdateTeam);
router.delete('/team', teamRoutes.deleteTeam);

// TODO Move this to teamRoutes
router.get('/team/users/', userRoutes.getAllUsersFromTeam);

export default router;
