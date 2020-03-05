import {Router} from 'express';

const router = new Router();

router.get('/all', async (req, res) => {
    const users = await req.context.models.User.find();
    return res.send(users);
});

router.get('/', async (req, res) => {
    const users = await req.context.models.User.find({
        location: {
            $near: {
                $maxDistance: 100000,
                $geometry: {
                    type: "Point",
                    coordinates: req.context.me.location.coordinates,
                }
            }
        }
    }).find((error, results) => {
        if (error) console.log(error);
    });

    console.log(users);
    return res.send(users.filter(x => Math.abs(x.level - req.context.me.level) && x.id != req.context.me.id <= 2));
});

router.get('/:userId', async (req, res) => {
    const user = await req.context.models.User.findById(req.params.userId)
    .catch(err => {
        console.log(err);
    });
    return res.send(user);
});

export default router;