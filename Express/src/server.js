import 'dotenv/config';

import models, {connectDb} from './models';
import app from './app.js';

const eraseDatabaseOnSync = true;

const createUsersWithMessages = async () => {
    const user1 = new models.User({
        username: 'Palmerin',
    });

    const message1 = new models.Message({
        text: 'My message',
        user: user1.id,
    });

    const user2 = new models.User({
        username: 'Melissa',
    });

    const message2 = new models.Message({
        text: 'Melissa\'s message',
        user: user2.id,
    });

    await user1.save();
    await user2.save();

    await message1.save();
    await message2.save();
}

connectDb().then(async () => {
    if (eraseDatabaseOnSync) {
        await Promise.all([
            models.User.deleteMany({}),
            models.Message.deleteMany({}),
        ]);

        await createUsersWithMessages();
    }

    app.listen(process.env.PORT, () => {
        console.log(`Express app listenting on port ${process.env.PORT}!`);
    });
});
