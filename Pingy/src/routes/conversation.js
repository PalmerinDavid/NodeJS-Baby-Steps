import {Router} from 'express';
import mongoose, { models } from 'mongoose';

const router = new Router();

const hasConversation = (user, conversationId) => {
    var authenticated = false;
    user.conversations.forEach(id => {
        if (id.toString() == conversationId)
            authenticated = true;
    });

    return authenticated;
}

router.get('/:conversationId', async (req, res) => {
    await req.context.models.User.findById(req.context.me.id)
    .then(user => {
        const authenticated = hasConversation(user, req.params.conversationId);
        if (authenticated) {
            req.context.models.Conversation.findById(req.params.conversationId)
            .then(async conversation => {
                var thread = await Promise.all(conversation.messages.map(async id => {
                    const message = await req.context.models.Message.findById(id);
                    console.log(message)
                    return message.text;
                }));
                return res.send(thread);
                //return res.send(conversation);
            })
            .catch(err => {
                console.log(err);
            });
        }
    })
    .catch(err => {
        console.log(err);
    });
});

router.post('/:conversationId', async (req, res) => {
    await req.context.models.User.findById(req.context.me.id)
    .then(async user => {
        const authenticated = hasConversation(user, req.params.conversationId);
        if (authenticated) {
            console.log('authenticated');
            const message = new models.Message({
                user: req.context.me.id,
                text: req.body.text
            });
            message.save();
            req.context.models.Conversation.updateOne(
                {"_id": req.params.conversationId}, 
                {"$push" : {"messages": message}},
                function (err) {
                    if (err) 
                        console.log(err); 
                }
            );
        }   
    })
    .catch(err => {
        console.log(err);
    });
    return res.send([]);
});


export default router;