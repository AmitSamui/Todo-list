
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = [];


app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/' , (req , res) => {
    
    var today = new Date();
    
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    var days = today.toLocaleDateString("en-US" , options);
    

    res.render('index' , {cDay: days , newListItem: items});
});

app.post('/' , (req , res) => {
   
    var newListItem = req.body.task;
    items.push(newListItem);
    res.redirect('/')
})

app.listen(3000 , () => {
    console.log("the server is running at port 3000");
})