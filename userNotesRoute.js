var express = require('express')
var router = express.Router();
var bodyParser = require("body-parser");
var cookieParser=require('cookie-parser');
var con=require("./db");
var crypto=require('crypto');
var notesKey="notes";

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(cookieParser());

router.get("/list",(req,res)=>{
    console.log(req.query);
    var sqlQuery="select notes from notes where userId="+req.query.user+";";
    con.query(sqlQuery, function (err, result) {
        if (err){
           console.log(err);
           res.status(400).send({"status":"Failed"});
        }
        else{
           console.log("IResult: " + result);
           var response=[];
           for(var i=0;i<result.length;i++){
            console.log(result[i].notes);
            var notesDeCipher=crypto.createDecipher('aes-128-cbc',notesKey);
            var noteE=notesDeCipher.update(result[i].notes,'hex','utf8');
            noteE=noteE+notesDeCipher.final('utf8');
            console.log(noteE);
            response.push({"note":noteE});
           }
           res.send(response);
        }
      });
});

router.post("/",(req,res)=>{
    console.log(req.query);
    console.log(req.body);
    var notesCipher=crypto.createCipher('aes-128-cbc',notesKey);
    var noteE=notesCipher.update(req.body.note,'utf8','hex');
    noteE=noteE+notesCipher.final('hex');
    console.log(noteE);
    var sqlQuery="insert into notes values("+req.query.user+",\""+noteE+"\");";
    con.query(sqlQuery, function (err, result) {
        if (err){
           console.log(err);
           res.status(400).send({"status":"Failed"});
        }
        else{
           console.log("IResult: " + result);
           res.send({"status":"success"});
        }
      });
});

module.exports=router;