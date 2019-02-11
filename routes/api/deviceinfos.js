const express = require('express');
const router = express.Router()
const passport = require('passport')

const DeviceInfo = require('../../models/DeviceInfo');


// @route  POST api/DeviceInfo/add
// @desc   添加设备接口
// @access Private
router.post(
    '/add',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const deviceInfoFields = {};
        if(req.body.deviceID) deviceInfoFields.deviceID = req.body.deviceID;
        if(req.body.devicePwd) deviceInfoFields.devicePwd = req.body.devicePwd;
        if(req.body.deviceDetail) deviceInfoFields.deviceDetail = req.body.deviceDetail;
        if(req.body.deviceAddr) deviceInfoFields.deviceAddr = req.body.deviceAddr;
        if(req.body.deviceName) deviceInfoFields.deviceName = req.body.deviceName;

        new DeviceInfo(deviceInfoFields).save().then(deviceInfo => {
            res.json(deviceInfo);
        });
    }
);

// @route  GET api/profiles
// @desc   获取所有信息
// @access Private
router.get(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        DeviceInfo.find()
            .then(deviceInfo => {
                if(!deviceInfo){
                    return res.status(404).json('没有设备信息');
                } else {
                    res.json(deviceInfo);
                }
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route  POST api/profiles/debug
// @desc   设备编辑接口
// @access Private
router.post(
    '/edit/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const deviceInfoFields = {};
        if(req.body.deviceID) deviceInfoFields.deviceID = req.body.deviceID;
        if(req.body.devicePwd) deviceInfoFields.devicePwd = req.body.devicePwd;
        if(req.body.deviceDetail) deviceInfoFields.deviceDetail = req.body.deviceDetail;
        if(req.body.deviceAddr) deviceInfoFields.deviceAddr = req.body.deviceAddr;
        if(req.body.deviceName) deviceInfoFields.deviceName = req.body.deviceName;
        DeviceInfo.findOneAndUpdate(
            { _id: req.params.id },
            { $set: profileFields },
            { new: true }
        ).then(deviceInfo => res.json(deviceInfo));
    }
);

router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    (res, req) => {
        console.log(req.params.id);
        DeviceInfo.findOneAndRemove({ _id: req.params.id })
        .then(deviceInfo => {
            deviceInfo.save().then(deviceInfo => res.json(deviceInfo));
        })
        .catch(err => res.status(404).json('删除失败'));
    }
)

module.exports = router;