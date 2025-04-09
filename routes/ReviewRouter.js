const express = require('express');
const router = express.Router();

const {newReview} = require("../public/javascripts/service/review/CreateReviewService")
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

/* GET home page. */
router.post('/api/task/:id', authorizeRole("USER"),
    async function(req,
                   res, next) {
    res.send(await newReview(req));
});

module.exports = router;
