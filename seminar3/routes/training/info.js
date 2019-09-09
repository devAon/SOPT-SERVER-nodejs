// 실행 순서
// 1. post먼서 실행해 내 정보 먼저 저장                //localhost:3000/training/info
// 2.get 내 학번 정보 있다면 학생 정보 출력       //localhost:3000/training/info/20100000

// 실행결과
// get
// {"status":200,"success":true,"data":{"id":"20100000","name":"최예원","univ":"동덕여대","major":"컴퓨터학과"}
// post
// {"status":201,"success":true}

module.exports = router;

var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
var json2csv = require('async-json2csv');
var csv = require("csvtojson");
const fs = require("fs");

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

//localhost:3000/training/info/20160589
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
    readCsv('studentInfo.csv').then((studentData) => {
        for (var i = 0; i < studentData.length; i++) {
            if (studentData[i].id == req.params.id) {
                break;
            }
        }

        if (i < studentData.length) {   //studentData 있음
            delete studentData[i].age;
            delete studentData[i].salt;
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.STUDENT_SELECT_SUCCESS, studentData[i]));
        } else {    ////studentData 없음
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NO_STUDENT));
        }
    }, (message) => {
        res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, message));
    });
});


//localhost:3000/training/info?
router.post('/', async (req, res) => {
    //body = { "id": 20160589, "name":"최예원", "univ": "동덕여대", "major": "컴퓨터학과", "age": 23}

    if (!req.body.id || !req.body.name) {   //실패
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {    //성공. 학생 정보 stuInfo에 담기.
        const stuInfo = {
            id: req.body.id,
            name: req.body.name,
            univ: req.body.univ,
            major: req.body.major,
            age: req.body.age
        }

        //try/catch로 await의 오류 예외처리 가능.
        try {
            const salt = await crypto.randomBytes(32);
            const hashedAge = await crypto.pbkdf2(stuInfo.age.toString(), salt.toString('base64'), 1000, 32, 'SHA512');

            stuInfo.salt = salt.toString('base64');
            stuInfo.age = hashedAge.toString('base64');

            const options = {
                data: [stuInfo],
                fields: ['id', 'name', 'univ', 'major', 'age', 'salt'],
                header: true
            }

            const stuInfoCsv = await json2csv(options);
            fs.writeFileSync('studentInfo.csv', stuInfoCsv);
            console.log(options);   //콘솔에 options찍어봄

            res.status(200).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS));
        } catch (err) {
            res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.SAVE_FAIL));
        }
    }
});

module.exports = router;