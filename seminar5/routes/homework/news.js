var express = require("express");
var router = express.Router();

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");
const upload = require('../../config/multer');
const moment = require('moment');

router.get("/", async (req, res) => {
    const getAllNewsQuery = 'SELECT * FROM news ORDER BY writetime DESC';
    const getAllNewsResult = await db.queryParam_None(getAllNewsQuery);
    console.log(getAllNewsResult);

    if (!getAllNewsResult) {
        //기사 조회 실패
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.NEWS_SELECT_FAIL));
    } else {
        //기사 조회 성공
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NEWS_SELECT_SUCCESS, getAllNewsQuery));
    }
});

//news와 contents newsIdx가 일치하는 것 찾아줘야함. join해서 idx 찾음.
router.get("/:idx", async (req, res) => {
    const selectNewsQuery = 'SELECT * FROM news JOIN contents ON news.newsIdx = contents.newsIdx WHERE news.newsIdx = ?';
    const selectNewsResult = await db.queryParam_Parse(selectNewsQuery, [req.params.idx]);
    console.log(selectNewsResult);

    if (!selectNewsResult) {
        //기사 조회 실패
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.NEWS_SELECT_FAIL));
    } else {//성공
        if (selectNewsResult[0] == null) {
            //ID와 일치하는 게시물이 없습니다
            res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.NOT_FOUND_NEWSIDX));
        } else {
            //게시물 조회 성공
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NEWS_SELECT_SUCCESS, selectNewsResult));
        }
    }
});


// req.body title, writer, imgs여러개, contents 여러개(imgs.length-1개)
// writer title thumnail writetime
// content contentImg
router.post('/', upload.array('imgs'), async (req, res) => {
    const title = req.body.title;
    const writer = req.body.writer;
    const imgs = req.files;
    const contents = req.body.contents; //여러개의 content 배열로 담겨있음.
    const writetime = moment().format('YYYY-MM-DD HH:mm:ss');

    if (imgs.length === 0 || !title || !writer || contents.length === 0) {
        //제목, 작성자, 내용들, 이미지들을 알맞게 입력 안함
        res.status(200).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        if (imgs.length != contents.length + 1) {    //req.body 입력 실패.
            res.status(200).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NOT_CORRECT_VALUE_IMGS_CONTENTS));
        } else {
            const thumnail = imgs[0].location;
            const contentImg = new Array();
            for (let i = 1; i < imgs.length; i++) {
                contentImg.push(imgs[i].location);
            }

            const insertNewsQuery = 'INSERT INTO news (writer, title, thumnail, writetime) VALUES (?,?,?,?)';
            const insertNewsResult = await db.queryParam_Parse(insertNewsQuery, [writer, title, thumnail, writetime]);

            const newsIdx = insertNewsResult.insertId;
            const insertContentsQuery = 'INSERT INTO contents (content, contentImg, newsIdx) VALUES (?,?,?)';
            for (let i = 0; i < contentImg.length; i++) {
                const insertContentsResult = await db.queryParam_Parse(insertContentsQuery, [contents[i], contentImg[i], newsIdx]);
            }

            if (!insertNewsResult) {
                //기사 삽입 실패
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.NEWS_INSERT_FAIL));
            } else {
                //기사 삽입 성공
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NEWS_INSERT_SUCCESS));
            }
        }
    }
});


router.put('/:newsIdx', upload.array('imgs'), async (req, res) => {  
    const { newsIdx } = req.params;
    const { title, writer, contents } = req.body;
    const imgs = req.files;  
    const writetime = moment().format('YYYY-MM-DD HH:mm:ss');

    const selectNewsQuery = 'SELECT * FROM news JOIN contents ON news.newsIdx = contents.newsIdx WHERE news.newsIdx = ?';
    const selectNewsResult = await db.queryParam_Parse(selectNewsQuery, [newsIdx]);

    //console.log(`newsIdx : ${newsIdx}`);
    //console.log(`selectNewsResult[0].newsIdx: ${selectNewsResult[0].newsIdx}`);

    if (selectNewsResult[0] == null) {
        //newsIdx와 일치하는 게시물이 없습니다
        res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.NOT_FOUND_NEWSIDX));
    } else {
        if (imgs.length === 0 || !title || !writer || contents.length === 0) {
            //수정된 내용이 없습니다
            res.status(200).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_UPDATE_VALUE));
        } else {
            if (imgs.length != contents.length + 1) {    //req.body 입력 실패.
                res.status(200).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NOT_CORRECT_VALUE_IMGS_CONTENTS));
            } else {
                const thumnail = imgs[0].location;
                const contentImg = new Array();
                for (let i = 1; i < imgs.length; i++) {
                    contentImg.push(imgs[i].location);
                }

                const updateNewsQuery = 'UPDATE news SET writer = ?, title = ?, thumnail= ?, writetime = ? WHERE newsIdx = ?';
                const updateNewsResult = await db.queryParam_Parse(updateNewsQuery, [writer, title, thumnail, writetime, newsIdx]);

                const updateContentsQuery = 'UPDATE contents SET content = ?, contentImg = ? WHERE newsIdx = ?';
                for (let i = 0; i < contentImg.length; i++) {
                    const updateContentsResult = await db.queryParam_Parse(updateContentsQuery, [contents[i], contentImg[i], newsIdx]);
                }
                if (!updateNewsResult) {
                    //기사 수정 실패
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.NEWS_UPDATE_FAIL));
                } else {
                    //기사 수정 성공
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NEWS_UPDATE_SUCCESS));
                }
            }
        }
    }
});


router.delete("/:newsIdx", async (req, res) => {
    const { newsIdx } = req.params;

    const selectNewsQuery = 'SELECT * FROM news JOIN contents ON news.newsIdx = contents.newsIdx WHERE news.newsIdx = ?';
    const selectNewsResult = await db.queryParam_Parse(selectNewsQuery, newsIdx);

    if (selectNewsResult[0] == null) {
        //newsIdx와 일치하는 게시물이 없습니다
        res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.NOT_FOUND_NEWSIDX));
    } else {
        const deleteNewsQuery = 'DELETE FROM news WHERE newsIdx= ? ';
        const deleteNewsResult = await db.queryParam_Parse(deleteNewsQuery, newsIdx);

        const deleteContentsQuery = 'DELETE FROM contents WHERE newsIdx= ? ';
        const deleteContentsResult = await db.queryParam_Parse(deleteContentsQuery, newsIdx);

        if (!deleteNewsResult || !deleteContentsResult) {
            //기사 삭제 실패
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.NEWS_DELETE_FAIL));
        } else {
            //기사 삭제 성공
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NEWS_DELETE_SUCCESS));
        }
    }
});

module.exports = router;
