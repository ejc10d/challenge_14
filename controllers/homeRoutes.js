const router = require('express').Router();
const { Post, User } = require('../models');
const sequelize = require('../config/connection')
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            posts,
            signed_in: req.session.signed_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const post = postData.get({ plain: true });

        res.render('post', {
            ...post,
            signed_in: req.session.signed_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/profile', withAuth, async (req, res) => {
    try {
        const postData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] }, include: [{ model: Post }],
        });

        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            signed_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.signed_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
});

module.exports = router;