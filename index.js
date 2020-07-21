const express = require('express');
const app = express();
var userAuth=require('./userAuthRoute');
var usernotes=require('./userNotesRoute');

app.use("/app/user",userAuth);
app.use("/app/sites",usernotes);


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});