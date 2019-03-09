const express = require('express');
const router = express.Router();
const passport = require('passport');
const MsgProfile = require('../../models/MsgProfile');

// $route  POST api/profile/addmsg
// @desc   添加消息记录
// @access private
router.post(
    '/add',
    passport.authenticate('jwt', {session: false}),
    (req, res) =>{
        const profileFields = {};
        //profileFields.user = req.user._id;
        console.log(req.body)
        MsgProfile.findOne({ target: req.body.target, user_id: req.body.user_id })
            .then(profile => {
                if(!profile) {
                    if(req.body.target) profileFields.target = req.body.target;
                    if(req.body.user_id) profileFields.user_id = req.body.user_id;
                    profileFields.count = req.body.count;
                    if(req.body.message) profileFields.message =req.body.message;
                    new MsgProfile(profileFields).save().then(profile => res.json(profile));
                } else {
                    profile.message = req.body.message;
                    profile.count = req.body.count;
                    profile.save().then(profile => res.json(profile));
                }
    })
});

// $route  GET api/profile/msg/:user_id
// @desc   获取用户的所有消息记录
// @access private 
router.get(
    '/msg/:user_id', 
    //passport.authenticate('jwt', {session: false}), 
    (req, res) => {
        MsgProfile.find()
            .then(profiles => {
                if(!profiles) {
                    errors.noprofile = "没有任何消息";
                    res.status(404).json(errors);
                }
                let result = profiles.filter(profile => {
                    return profile.user_id == req.params.user_id;
                })
                res.json(result);
            })
            .catch(err => res.status(404).json(err));

})



module.exports = router;

    