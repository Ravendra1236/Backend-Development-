const app = require("./app")
const mongoose = require("mongoose")


require('dotenv').config();

const DB = process.env.DATABASE 

mongoose.connect (DB , {
  useNewUrlParser : true , 
}).then(() =>{
  console.log("DB Connection successfull!");
})

const port = process.env.PORT || 3001 ;
// START SERVER
app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
