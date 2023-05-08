const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    console.log(req.app.hole);
    res.render('index', {name: 'Andrew'});
});

module.exports =  router;
