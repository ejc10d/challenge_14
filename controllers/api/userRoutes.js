const router = require('express').Router();
const { User } = require('../../models');

router.post("/", async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: { username: req.body.username }
        });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect username' });
            return;
        }

        const validatePassword = await userData.checkPassword(req.body.password);

        if (!validatePassword) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are signed in.' });
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// router.post('/signup', async (req, res) => {
//     try{
//         const newUser = await User.create({
//             ...req.body,
//             user_id: req.session.user_id,
//         });

//         res.status(200).json(newUser);
//     } catch (err) {
//         res.status(400).json(err);
//     }
// });

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(400).end();
    }
});

module.exports = router;