
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = [];


app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/' , (req , res) => {
    
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    console.log(time);
    
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    var days = today.toLocaleDateString("en-US" , options);
    

    res.render('index' , {cDay: days , newListItem: items , time : time});
});

app.post('/' , (req , res) => {
   
    var newListItem = req.body.task;
    if(newListItem != ""){
    items.push(newListItem);
    res.redirect('/')}
})

app.listen(process.env.PORT || 3000 , () => {
    console.log("the server is running at port 3000");
})