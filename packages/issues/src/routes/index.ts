import Router from 'express';
import * as issueRoutes from './issue';
import * as projectRoutes from './project';

const router = Router();

/* Issue routes */
router.get('/issue', issueRoutes.getIssue);
router.post('/issue', issueRoutes.postIssue);
router.put('/issue', issueRoutes.putUpdateIssue);

router.get('/issues', issueRoutes.getIssues);

/* Project routes */
router.get('/project', projectRoutes.getProject);
router.post('/project', projectRoutes.postCreateProject);
router.put('/project', projectRoutes.putUpdateProject);
router.delete('/project', projectRoutes.deleteProject);

export default router;
