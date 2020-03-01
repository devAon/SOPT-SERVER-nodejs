var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', async(req, res) => {
    const idQuery = 'SELECT * FROM user WHERE id = ?'
    const idResult = await db.queryParam_Parse(idQuery, req.body.id);

    if(idResult[0]==null){
        //ID가 존재하지 않거나 비밀번호가 일치하지 않습니다._id없음
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_USERINFO));
    }else{
        const salt= idResult[0].salt;
        const hashedEnterPw= await crypto.pbkdf2(req.body.password.toString(),salt,1000, 32, 'SHA512');
        
        if(idResult[0].password==hashedEnterPw.toString('base64')){
            //게시물 조회 성공
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNIN_SUCCESS,idQuery[0].userIdx));
        }else{
            //ID가 존재하지 않거나 비밀번호가 일치하지 않습니다._비밀번호 없음
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_USERINFO));
        }
    }
});
module.exports = router;
