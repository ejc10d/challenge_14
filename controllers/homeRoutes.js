const router = require('express').Router();
const {Blog, User} = require ('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const blog_posts = blogData.map((blog_post) => blog_post.get({plain: true }));

        res.render('homepage', {
            blog_posts,
            signed_in: req.session.signed_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/blog/:id', async (req,res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const blog_post = blogData.get({plain: true});

        res.render('blog', {
            ...blog_post,
            signed_in: req.session.signed_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/profile', withAuth, async (req, res) => {
    try {
        const blogData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password']}, include: [{ model: Blog}],
        });

        const user = userData.get({plain: true});

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