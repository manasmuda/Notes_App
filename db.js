var mysql = require('mysql');

var con = mysql.createConnection({
    host: "127.0.0.1",
    port:"3307",
    user: "root",
    password: "root",
    database:"notes_app"
  });
  
  con.connect(function(err) {
    if (err) 
    {
      console.log(err);
    }
    else{
    console.log("Connected!");
    }
  });

module.exports=con;