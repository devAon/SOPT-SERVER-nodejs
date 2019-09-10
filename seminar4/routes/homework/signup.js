var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', async (req, res) => {
    const idQuery = 'SELECT id FROM user WHERE id = ?'
    const idResult = await db.queryParam_Parse(idQuery, req.body.id);
    const signupQuery = 'INSERT INTO user (id,name,password,salt) VALUES (?, ?, ?, ?)';


    if(idResult[0] == null) {  //아이디 중복 없음
        const buf= await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        const hashedPw = await crypto.pbkdf2(req.body.password.toString(), salt, 1000, 32, 'SHA512');
        const signupResult = await db.queryParam_Parse(signupQuery, [req.body.id, req.body.name, hashedPw.toString('base64'), salt]);
        if (!signupResult) {
            //console.log("멤버십 조회 실패");
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.SIGNUP_FAIL));
        } else {  
            //console.log("멤버십 삽입 성공");
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
        }
    } else {
        console.log("중복된 ID가 있습니다.");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DUPLICATED_ID_FAIL));
    }
});
module.exports = router;
