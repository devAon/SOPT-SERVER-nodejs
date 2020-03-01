module.exports = router;

var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
var json2csv = require('async-json2csv');
var csv = require("csvtojson");
const fs = require("fs");
const moment = require('moment');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

//get
//localhost:3000/homework/board/20160589
router.get('/:id', (req, res) => {
    const readCsv = (fileName) => {
        return new Promise((resolve, reject) => {
            csv().fromFile(fileName).then((jsonObj) => {
                if (jsonObj != null) {
                    resolve(jsonObj);
                }
                else {
                    reject(resMessage.READ_FAIL);
                }
            })
        })
    }
    readCsv('boardInfo.csv').then((boardData) => {
        for (var i = 0; i < boardData.length; i++) {
            if (boardData[i].id == req.params.id) {
                break;
            }
        }

        if (i < boardData.length) {   //비밀번호, 솔트값 삭제
            delete boardData[i].pw;
            delete boardData[i].salt;
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.BOARD_SELECT_SUCCESS, boardData[i]));
        } else {    
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NO_Board));
        }
    }, (message) => {
        res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, message));
    });
});


//POST
//localhost:3000/homework/board
router.post('/', async (req, res) => {
    //body = { "id": 20160589, "title":"서버개발 짱이 되려면", "content": "그냥 잘..하면 됩..니다..", "pw": 1234}

    if (!req.body.id || !req.body.pw) {   //실패
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {    //성공. boardInfo 담기.
        const boardInfo = {
            id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            time: moment().format(),
            pw: req.body.pw
        }

        //try/catch로 await의 오류 예외처리 가능.
        try {
            const salt = await crypto.randomBytes(32);
            const hashedPw = await crypto.pbkdf2(boardInfo.pw.toString(), salt.toString('base64'), 1000, 32, 'SHA512');

            boardInfo.salt = salt.toString('base64');
            boardInfo.pw = hashedPw.toString('base64');

            const options = {
                data: [boardInfo],
                fields: ['id', 'title', 'content', 'time', 'pw', 'salt'],
                header: true
            }

            const boardInfoCsv = await json2csv(options);
            fs.writeFileSync('boardInfo.csv', boardInfoCsv);
            //console.log(options);   //콘솔에 options찍어봄

            res.status(200).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS));
        } catch (err) {
            res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.SAVE_FAIL));
        }
    }
});

module.exports = router;