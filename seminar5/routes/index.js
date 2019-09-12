var express = require('express');
var router = express.Router();

router.use('/image', require('./image'));

//아무리 스케줄러만 있는 파일이라도 꼭 라우팅등록 해줘야지 scheduler가 돌아감.
router.use('/scheduler', require('./scheduler'));  
router.use('/training/signup', require('./training/signup'));
router.use('/homework/news', require('./homework/news'));
module.exports = router;