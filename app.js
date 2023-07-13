//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", {useNewUrlParser:true});

const itemSchema=new mongoose.Schema({
  name:String
})
const Item=mongoose.model("Item", itemSchema);
const item1=new Item({
  name:"Welcome to our todolist!"
})
const item2=new Item({
  name:"Hit the + button to add a new item."
})
const item3=new Item({
  name:"<-- Hit this to delete an item."
})
const defaultItems=[item1, item2, item3];

app.get("/", function(req, res) {
  Item.find({}).then(foundItems=>{
    if(foundItems.length===0){
      Item.insertMany(defaultItems).then(
        (result)=>{
          console.log("Items added successfully");
        }
      )
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const anotherItem= new Item({
    name:itemName
  })
  anotherItem.save();
  res.redirect("/");
   
});

app.post("/delete", function (req, res) {
  const checked=req.body.checkbox;
  Item.findByIdAndDelete(checked).then(p=>{
    if(p){
      res.redirect("/");
    }
    else{
      console.log("Id not found");
    }
  });
  
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});