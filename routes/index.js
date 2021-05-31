var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var connect = require('mysql');
const { emitKeypressEvents } = require('readline');
var mysql=connect.createConnection({
  host:"localhost",
  port:3306,
  user:"root",
  password:"123",
  database:"design"
});
/* GET home page. */
router.get('/', function(req, res, next) {
  var query = 'SELECT * FROM article';
  mysql.query(query,function(err,rows,fields) {
    var articles = rows;
      articles.forEach(function(ele) {
    var year = ele.articleTime.getFullYear()
    var month = ele.articleTime.getMonth() + 1 >10 ?
    ele.articleTime.getMonth() : '0' + (ele.articleTime.getMonth() + 1);
    var date = ele.articleTime.getDate() > 10 ? ele.articleTime.getDate() : '0' + ele.articleTime.getDate() 
    ele.articleTime = year + '-' + month +'-' + date;
      });
      res.render("index",{articles: articles});
      });
    });
/*登录页*/
router.get('/login',function(req,res,next) {
  res.render('login')});
router.post('/login',function(req,res,next) {
  var name = req.body.name;
  var password = req.body.password;
  var hash = crypto.createHash('md5');
  hash.update(password);
  password = hash.digest('hex');
  var query = 'SELECT * FROM author WHERE authorName=' + mysql.escape(name) + 'AND authorPassword=' + mysql.escape(password);
  mysql.query(query, function(err, rows, fields){
    if(err){
      console.log(err);
      return;
    }
    var user =  rows[0];
    if(!user){
      res.render('login');
      return;
    }
    req.session.userSign = true;
    req.session.userID = user.authorID;
      res.redirect('/');
  }); 

});


module.exports = router;
