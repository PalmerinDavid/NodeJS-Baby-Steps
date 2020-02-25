import 'dotenv/config';
import 'babel-polyfill';

import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import models from '../models';
import { request, response } from 'express';

var connection = mongoose.connect(process.env.DATABASE_TEST);
var testUsers = [];
var testMessages = [];

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

    testUsers.push(user1);
    testUsers.push(user2);

    testMessages.push(message1);
    testMessages.push(message2);
}

beforeAll(async () => {
    // await mongoose.connection.db.dropCollection('messages');
    // await mongoose.connection.db.dropCollection('users');
    await app.listen(process.env.PORT);
    await createUsersWithMessages();
});

describe('Test to check user session', () => {
    test('It should response the GET method', done => {
        supertest(app).get('/session').expect(200);
        done();
    });
});


describe('Test to check session has a user assigned', () => {
    test('It should check for Melissa, a session user', async done => {
        supertest(app)
        .get('/session')
        .then(response => {
            if (response.body.username !== 'Melissa')
                throw Error('User didn\'t match ');
        });
        done();
    });
});

// describe('Test to get all the users', () => {

//     test('It should retrieve all the users in the db', async done => {
//         supertest(app).get('/users/').expect(response => {
//             response.forEach(element => console.log(element));
//         });
//         done();
//     });
// });

describe('Test to check post operation on users', () => {
    test('It should store a new user into db', async done => {
        const userSchema = new models.User({
            username: 'testUser', 
        });

        await supertest(app).post('/users/').send(userSchema);
        await models.User.findOne({'username' : userSchema.username})
        .then( res => {
            if (res){
                expect(res).toBeTruthy();
                if (res.username !== 'testUser') 
                    throw Error('Error - username does not match.');
            }
            else 
                throw Error('Error - User hasn\'t been saved');
        });
        done();
    });
});

describe('Test to check that a message is stored', () => {
    test('It should store a message from Melissa', async done => {
        models.User.findOne({'username' : 'Melissa'})
        .then( async user => {
            if(!user)
                throw Error('User hasn\'t been found');
            else {
                const message = new models.Message({
                    text: 'Another message from Melissa',
                    username: user.id,
                });
                await supertest(app).post('/messages').send(message);
                await models.Message.find({ 'user' : user.id })
                .then( async messages => {
                    console.log(messages);
                    if (!messages)
                        throw Error('Received no messages. There should be at least one');
                    var contains = false;    
                    messages.forEach(msg => {
                        if (msg.user == user.id)
                            contains = true;
                    });
                    await expect(contains).toBeTruthy();
                })
                .catch( error => {
                    console.log('Error');
                    expect(false).toBeTruthy();
                });
            }
        });
        done();
    });
});

afterAll(async done => {
    await mongoose.connection.db.dropCollection('messages');
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.close();
    done();
});