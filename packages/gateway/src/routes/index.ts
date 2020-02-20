import { Router } from 'express';
import * as userRoutes from './user';
import * as teamRoutes from './team';
import * as issueRoutes from './issue';
import * as projectRoutes from './project';
import * as auth from '../auth';

const router = Router();

/* User routes */
router.get('/user', auth.authorize, userRoutes.getUser);
router.put('/user', auth.authorize, userRoutes.putUpdateUser);
router.delete('/user', auth.authorize, userRoutes.deleteUser);
router.post('/user', userRoutes.postRegister);

router.post('/register', userRoutes.postRegister);
router.post('/login', userRoutes.postLogin);

/* Team routes */
router.get('/team', auth.authorize, teamRoutes.getTeam);
router.post('/team', auth.authorize, teamRoutes.postCreateTeam);
router.put('/team', auth.authorize, teamRoutes.putUpdateTeam);
router.delete('/team', auth.authorize, teamRoutes.deleteTeam);

/* Issue routes */
router.get('/issue', auth.authorize, issueRoutes.getIssue);
router.post('/issue', auth.authorize, issueRoutes.postIssue);
router.put('/issue', auth.authorize, issueRoutes.putUpdateIssue);

router.get('/issues', auth.authorize, issueRoutes.getIssues);

/* Project routes */
router.get('/project', auth.authorize, projectRoutes.getProject);
router.post('/project', auth.authorize, projectRoutes.postProject);
router.put('/project', auth.authorize, projectRoutes.putUpdateProject);
router.delete('/project', auth.authorize, projectRoutes.deleteProject);


export default router;
