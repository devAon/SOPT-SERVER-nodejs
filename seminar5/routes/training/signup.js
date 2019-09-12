var express = require('express');
var router = express.Router();
const async = require('async');
const upload = require('../../config/multer');
const db = require('../../module/pool');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');


router.post('/', upload.single('profileImg'),async(req, res) => {
    if (!req.body.id || !req.body.name || !req.body.password) {
        res.status(200).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.MEMBERSHIP_INSERT_FAIL));
    } else { 
        const info = {
            id : req.body.id,
            name : req.body.name,
            profileImg : req.file.location,
            password :  req.body.password
        }

        const insertInfoQuery= 'INSERT INTO signup(id, name, profileImg, password) VALUES (?,?,?,?)';
        const insertInfoResult = await db.queryParam_Parse(insertInfoQuery, [info.id, info.name, info.profileImg, info.password]);

        if(!insertInfoResult){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.MEMBERSHIP_INSERT_FAIL));
        }else{
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.MEMBERSHIP_INSERT_SUCCESS));
        }
        
        console.log(info);
    }
});


module.exports = router;