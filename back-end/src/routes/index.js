import express from 'express';
import view from './view';
import api from './api';

const router = express.Router();

router.use('/', view);
router.use('/api', api);

export default router;