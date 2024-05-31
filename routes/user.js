const router = require("express").Router();
const { restart } = require("nodemon");
const User = require("../models/user.model.js");

router.route("/add-or-update").post((req, res) => {
    const { email, name, user_id, verified_email, picture } = req.body;

    User.findOneAndUpdate(
        { email: email },
        { email, name, user_id, verified_email, picture },
        { new: true, upsert: true }
    )
    .then(user => res.json("User added/updated successfully!"))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/get").get((req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json("Error: Email is required");
    }
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json("Error: User not found");
            }
            res.json(user);
        })
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/update/:email").put((req, res) => {
    User.findOne({ email: req.params.email })
        .then(user => {
            if (user) {
                user.name = req.body.name || user.name;
                user.email = req.body.email || user.email;
                user.verified_email = req.body.verified_email || user.verified_email;
                user.picture = req.body.picture || user.picture;
                user.save()
                    .then(() => res.status(200).json("User updated successfully!"))
                    .catch(err => res.status(400).json("Error: " + err));
            } else {
                res.status(404).json("User not found");
            }
        })
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/delete/:name").delete((req, res) => {
    User.findOneAndDelete({ name: req.params.name })
        .then(item => res.json(item))
        .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
