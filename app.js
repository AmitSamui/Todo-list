const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
let items = [];
var days = "";
var time = "";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//--data base------------------------------------------------
mongoose.connect("mongodb+srv://amit-samui:yl3lNXctbwTgpnzC@cluster0.qug8g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
});

const itemSchema = {
  name: String,
};

const listSchema = {
  name: String,
  items: [itemSchema],
};

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "new item 1",
});
const item2 = new Item({
  name: "new item 2",
});
const item3 = new Item({
  name: "new item 3",
});

const defaultItems = [item1, item2, item3];

//-----------------------------------------------
app.get("/", (req, res) => {
  var today = new Date();
  time = today.getHours() + ":" + today.getMinutes();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  days = today.toLocaleDateString("en-US", options);

  Item.find({}, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { cDay: days, newListItem: results, time: time });
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  if (customListName != "favicon.ico") {
    List.findOne({ name: customListName }, (err, foundList) => {
      if (!err) {
        if (!foundList) {
          // create a new list
          const list = new List({
            name: customListName,
            items: defaultItems,
          });

          list.save();
          res.redirect("/" + customListName);
        } else {
          res.render("list", {
            cDay: days,
            newListItem: foundList.items,
            time: time,
            listTitle: foundList.name,
          });
        }
      }
    });
  }
});
app.post("/", (req, res) => {
  var itemname = req.body.task;
  var list = req.body.listname;

  if (itemname != "") {
    const item = new Item({
      name: itemname,
    });

    if (list === "today") {
      item.save();
      res.redirect("/");
    } else {
      List.findOne({ name: list }, (err, foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + list);
      });
    }
  }
});

app.post("/delete", (req, res) => {
  const id = req.body.checkbox;
  const listname = req.body.listname;

  if (listname === "today") {
    console.log("delete");
    Item.deleteOne({ _id: id }, (err) => {
      if (err) console.log(err);
      else console.log("sucess");
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listname },
      { $pull: { items: { _id: id } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listname);
        }
      }
    );
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("the server is running at port 3000");
});
