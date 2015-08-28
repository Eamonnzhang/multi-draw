/**
 * Created by Eamonn on 2015/8/28.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('paper', { title: 'Node.js Multiplayer Drawing Game | Tutorialzine Demo' });
});

module.exports = router;
