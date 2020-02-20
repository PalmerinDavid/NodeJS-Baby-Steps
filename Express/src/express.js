import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import routes from './routes';
import models, {connectDb} from './models';

const app = express();
const eraseDatabaseOnSync = true;

const createUsersWithMessages = async () => {
    const user1 = new models.User({
        username: 'palmerin',
    });

    const message1 = new models.Message({
        text: 'Mensaje mio xddd',
        user: user1.id,
    });

    const user2 = new models.User({
        username: 'melissa',
    });

    const message2 = new models.Message({
        text: 'Mensaje de melissa xddd',
        user: user2.id,
    });

    await user1.save();
    await user2.save();

    await message1.save();
    await message2.save();
}

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended : true }));

app.use(async (req, res, next) => {
    req.context = {
        models, 
        me : await models.User.findByLogin('palmerin'),
    };
    next();
});

app.use('/session', routes.session);
app.use('/messages', routes.message);
app.use('/users', routes.user);

connectDb().then(async () => {
    if (eraseDatabaseOnSync) {
        await Promise.all([
            models.User.deleteMany({}),
            models.Message.deleteMany({}),
        ]);

        createUsersWithMessages();
    }

    app.listen(process.env.PORT, () => {
        console.log(`Express app listenting on port ${process.env.PORT}!`);
    });
});


