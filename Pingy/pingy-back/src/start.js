import 'dotenv/config';
import 'babel-polyfill';

import models, {connectDb} from './models';
import app from './app.js';

console.log(models.Conversation);

const eraseDatabaseOnSync = true;

const createUsers = async () => {
    const user1 = new models.User({
        username: 'Ping01',
        level: 4,
        location: {
            type : 'Point',
            coordinates : [80, 80],
        },
    });
    
    const user2 = new models.User({
        username: 'Ping02',
        level: 2,
        location: {
            type : 'Point',
            coordinates : [81.00001, 81.00001],
        },

    });

    const user3 = new models.User({
        username: 'Ping03',
        level: 5,
        location: {
            type : 'Point',
            coordinates : [80, 80],
        },
    });

    const user4 = new models.User({
        username: 'Ping04',
        level: 5,
        location: {
            type : 'Point',
            coordinates : [80, 80],
        },
    });

    const user5 = new models.User({
        username: 'Ping05',
        level: 5,
        location: {
            type : 'Point',
            coordinates : [80, 80],
        },
    });

    const message1 = new models.Message({
        user : user1.id,
        text: "Hey, how r u?",
    }); 

    const message2 = new models.Message({
        user : user1.id,
        text: "Doin\' gud, n u?",
    }); 

    const conversation1 = new models.Conversation({
        messages: [message1.id, message2.id],
    }); 

    user1.conversations = conversation1;

    await user1.save();
    await user2.save();
    await user3.save();
    await user4.save();
    await user5.save();

    await message1.save();
    await message2.save();

    await conversation1.save();
};

connectDb().then(async () => {
    if (eraseDatabaseOnSync){
        await models.User.deleteMany({});
        await models.Conversation.deleteMany({});
        await createUsers().catch(err => { console.log(err); });
    }

    app.listen(process.env.PORT, () => {
        console.log(`Express app listening on port ${process.env.PORT}`);
    });
}).catch(err => {console.log(err);});