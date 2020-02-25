import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import routes from './routes';
import models from './models';

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended : true }));

app.use(async (req, res, next) => {
    req.context = {
        models, 
        me : await models.User.findByLogin('Melissa'),
    };
    next();
});

app.use('/session', routes.session);
app.use('/messages', routes.message);
app.use('/users', routes.user);

export default app;


