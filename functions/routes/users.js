const express = require('express');
const router = express.Router();
const {getCustomer} = require("../public/javascripts/service/user/GetProfileCustomerService");
const {editProfileUser} = require("../public/javascripts/service/user/EditProfileCustomerService");
const {getMentorPendings} = require("../public/javascripts/service/user/GetUserPending");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");
const {acceptedMentors} = require("../public/javascripts/service/user/AccptedMentor");
const UserService = require("../public/javascripts/service/user/UserService");
const MentorService = require("../public/javascripts/service/user/MentorService");

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
});

router.get('/api/mentor/pending', authorizeRole("ADMIN"),
    async function(req, res, next) {
      res.send(await getMentorPendings(req.params.id));
    });

router.put('/api/accepted', authorizeRole("ADMIN"),
    async function(req, res, next) {
        res.send(await acceptedMentors(req.body.email, req.body.reason));
    });

router.get('/api/user/reject', authorizeRole("ADMIN"),
    async function(req, res, next) {
    const object = new UserService();
    const response = await object.getMentorReject();
        res.send(response);
    });

router.put('/api/profile/mentor/update', authorizeRole("MENTOR"),
    async function(req, res, next) {
        const object = new MentorService();
        const response = await object.updateProfile(req);
        res.send(response);
    });

router.get('/api/profile/mentor', authorizeRole("MENTOR"),
    async function(req, res, next) {
        const object = new MentorService();
        const response = await object.getProfile(req);
        res.send(response);
    });


module.exports = router;
