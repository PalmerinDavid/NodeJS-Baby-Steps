import {Router} from 'express';

const router = new Router();

const hasConversation = async (user, conversationId) => {
    var autenticated = false;
    await user.conversations.forEach(id => {
        if (id.toString() == conversationId)
            autenticated = true;
    });

    return autenticated;
}

router.get('/:conversationId', async (req, res) => {
    const user = await req.context.models.User.findById(req.context.me)
    .catch(err => {
        console.log(err);
    });
    const autenticated = await hasConversation(user, req.params.conversationId);
    if (autenticated) {
        console.log('autenticated');
        const conversation = await req.context.models.Conversation.findById(req.params.conversationId)
        .catch(err => {
            console.log(err);
        });
        const mapText = async function (id) {
            const message = await req.context.models.Message.findById(id);
            return message.text;
        }
        const thread = await conversation.messages.map(mapText);
        return res.send(thread);
    }
    return res.send([]);
});

router.post('/:conversationId', async (req, res) => {
    console.log('Post');
    req.context.models.User.findById(req.context.me._id)
    .then(async user => {
        const autenticated = await hasConversation(user, req.params.conversationId);
        if (autenticated) {
            console.log('autenticated');
            req.context.models.Conversation.updateOne(
                {"_id": req.params.conversationId}, 
                {"$push" : {"messages" : req.body.text}},
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