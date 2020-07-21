var express = require('express')
var router = express.Router();
var bodyParser = require("body-parser");
var cookieParser=require('cookie-parser');
var con=require("./db");
var crypto=require('crypto');
const e = require('express');
var pwdKey="password";


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(cookieParser());

router.post('/',(req,res)=>{
    console.log(req.body);
    var query="select count(*) as c from users";
    con.query(query, function (err1, result1) {
        if (err1){
           console.log(err1);
           //res.status(400).send({"status":"Failed: UserName Already exists"});
        }
        else{
           console.log("Result: " + result1);
           //res.send(result);
           var id=result1[0].c+1;
           var pwd=req.body.password;
           var pwdCipher=crypto.createCipher('aes-128-cbc',pwdKey);
           var pwdE=pwdCipher.update(pwd,'utf8','hex');
           pwdE=pwdE+pwdCipher.final('hex');
           var sqlQuery="insert into users(userId,userName,password) values("+id+",\""+req.body.username+"\",\""+pwdE+"\");";
            con.query(sqlQuery, function (err, result) {
                if (err){
                    console.log(err);
                    res.status(400).send({"status":"Failed: UserName Already exists"});
                }  
                else{
                    console.log("Result: " + result);
                    res.status(200).send({"status":"account created"});
                }
            });
           //res.status(200).send({"status":"account created"});
        }
      });
    
});

router.post('/auth',(req,res)=>{
    console.log(req.body);
    var sqlQuery="select userId,password from users where userName=\""+req.body.username+"\";"; 
    con.query(sqlQuery, function (err, result) {
        if (err){
           console.log(err);
           res.status(400).send({"status":"Failed: UserName does not exist"});
        }
        else{
           console.log("IResult: " + result);
           var pwd=result[0].password;
           var pwdCipher=crypto.createDecipher('aes-128-cbc',pwdKey);
           var pwdE=pwdCipher.update(pwd,'hex','utf8');
           pwdE=pwdE+pwdCipher.final('utf8');
           if(pwdE==req.body.password){
                res.send({"status":"success","userId":result[0].userId});
           }
           else{
                res.status(400).send({"status":"password does not match"});
           }
        }
      });
});

module.exports=router;