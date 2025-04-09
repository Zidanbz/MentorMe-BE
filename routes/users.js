const express = require('express');
const router = express.Router();
const {getCustomer} = require("../public/javascripts/service/user/GetProfileCustomerService");
const {editProfileUser} = require("../public/javascripts/service/user/EditProfileCustomerService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

const user = {
  username: 'admin',
  password: 'admin',
  email: 'admin@gmail.com',
  password_confirmation: 'admin@gmail.com',
}

/* GET users listing. */
router.get('/users', authorizeRole("MENTOR"),
      function(req,
             res, next) {
  res.send(user);
});

router.get('/api/profile/get', authorizeRole("USER"),
    async function(req,
                   res, next) {
  res.send(await getCustomer(req));
})

/**
 * @reg dalam bentuk form-data
 */
router.put('/api/profile/edit', authorizeRole("USER"),
    async function(req,
                   res, next) {
      res.send(await editProfileUser(req));
})


module.exports = router;
