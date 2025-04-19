var express = require('express');
var router = express.Router();
const {loginUserService} = require("../public/javascripts/service/login/LoginUserService")

/* Post users listing. */
router.post('/api/login/user',
    async function(req,
                   res, next) {
    const { email, password, fcmToken } = req.body;

    const response = await loginUserService({ email, password }, fcmToken);
    res.status(response.code).json(response);
});

module.exports = router;