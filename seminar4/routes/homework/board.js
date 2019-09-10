var express = require("express");
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

router.get("/", async (req, res) => {
    const getAllBoardQuery = "SELECT boardIdx,title,content,writer,writetime FROM board";
    const getAllBoardResult = await db.queryParam_None(getAllBoardQuery);

    if (!getAllBoardResult) {
        //console.log("게시물 조회 실패");
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.BOARD_SELECT_FAIL));
    } else {
        //console.log("게시물 조회 성공");
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.BOARD_SELECT_SUCCESS, getAllBoardResult));
    }
});
router.get("/:idx", async (req, res) => {

    const boardQuery = ' SELECT boardIdx,title,content,writer,writetime FROM board WHERE boardIdx= ? ';
    const boardResult = await db.queryParam_Parse(boardQuery, req.params.idx);
    if (!boardResult) {
        //console.log("게시물 조회 실패");
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.BOARD_SELECT_FAIL));
    } else {//성공
        if (boardResult[0] == null) {
            //console.log("ID와 일치하는 게시물이 없습니다.");
            res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.NOT_FOUND_BOARDID));
        } else {
            //console.log("게시물 조회 성공");
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.BOARD_SELECT_SUCCESS, boardResult));
        }
    }
});

router.post('/', async (req, res) => {
    if (!req.body.title || !req.body.content || !req.body.boardPw || !req.body.writer) {
        //console.log("제목, 내용, 게시물 비밀번호, 작성자를 모두 입력하세요");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ENTER_ALL));
    } else {
        const insertBoardQuery = 'INSERT INTO board (writer, title, content, writetime, boardPw, salt) VALUES (?,?,?,?,?,?)';

        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        const hashedBoardPw = await crypto.pbkdf2(req.body.boardPw.toString(), salt, 1000, 32, 'SHA512');

        const insertBoardResult = await db.queryParam_Parse(insertBoardQuery,
            [req.body.writer, req.body.title, req.body.content, new Date(), hashedBoardPw.toString('base64'), salt]);

        if (!insertBoardResult) {
            //console.log("게시물 삽입 실패");
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.BOARD_INSERT_FAIL));
        } else {
            //console.log("게시물 삽입 성공");
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.BOARD_INSERT_SUCCESS));
        }
    }
});

router.delete("/", async (req, res) => {
    const boardQuery = 'SELECT *FROM board WHERE boardIdx= ?';
    const boardResult = await db.queryParam_Parse(boardQuery, req.body.boardIdx);

    if (boardResult[0] == null) {
        //console.log("ID와 일치하는 게시물이 없습니다.");
        res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.NOT_FOUND_BOARDID));
    } else {
        const salt = boardResult[0].salt;
        const hashedEnterPw = await crypto.pbkdf2(req.body.boardPw.toString(), salt, 1000, 32, 'SHA512');

        if (boardResult[0].boardPw == hashedEnterPw.toString('base64')) {
            const deleteBoardQuery = 'DELETE FROM board WHERE boardIdx= ? ';
            const deleteBoardResult = await db.queryParam_Parse(deleteBoardQuery, req.body.boardIdx);
            if (!deleteBoardResult) {
                //console.log("게시물 삭제 실패");
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.BOARD_DELETE_FAIL));
            } else {
                //console.log("게시물 삭제 성공");
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.BOARD_DELETE_SUCCESS));
            }
        } else {
            //console.log("게시물 비밀번호가 다릅니다.");
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.BOARD_PASSWORD_ERROR));
        }
    }
});
module.exports = router;
