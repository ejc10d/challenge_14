const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
    try{
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.signed_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {email: req.body.email}
        });

        if(!userData) {
            res.status(400).json({message: 'Incorrect email'});
            return;
        }

        const validatePassword = await userData.checkPassword(req.body.password);

        if(!validatePassword) {
            res.status(400).json({ message: 'Incorrect password'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.signed_in = true;

            res.join({user: userData, message: 'You are signed in.'});
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if(res.session.signed_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(400).end();
    }
});

module.exports = router;