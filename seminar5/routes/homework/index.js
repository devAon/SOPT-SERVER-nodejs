var express = require('express');
var router = express.Router();

router.use('/', require('./news'));

module.exports = router;