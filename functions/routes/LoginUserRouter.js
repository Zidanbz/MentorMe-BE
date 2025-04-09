var express = require('express');
var router = express.Router();
const {loginUserService} = require("../public/javascripts/service/login/LoginUserService")

/* Post users listing. */
router.post('/api/login/user',
    async function(req,
                   res, next) {
    res.send(await loginUserService(req.body));
});

module.exports = router;