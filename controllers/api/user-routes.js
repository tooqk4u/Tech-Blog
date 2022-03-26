const router = require('express').Router();
// add withAuth helper
const { User } = require('../../models');


// Get all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] },
    })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get one user
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id,
        },
        // include will go here for post and comments
    })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
})

// Create a user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
    })
    .then(dbUserData => {
        // session code here
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// login

// logout

// Update and Delete Logic would go here

module.exports = router; 