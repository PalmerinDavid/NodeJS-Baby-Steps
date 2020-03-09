import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import models from './models';
import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended : true }));

app.use(async (req, res, next) => {
    req.context = {
        models,
        me: await models.User.findByLogin('Ping01'),
    };
    next();
});

app.use('/users', routes.user);
app.use('/conversations', routes.conversation);

export default app;
