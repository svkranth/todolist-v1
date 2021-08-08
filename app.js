const express = require("express");
const https = require("https");
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});

const itemSchema = new mongoose.Schema({
    name : {
        required : true,
        type : String
    }
});

const listitemSchema = new mongoose.Schema({
    name : {
        required : true,
        type : String
    },
    listname : {
        required : true,
        type : String
    }
});

const Item = mongoose.model("Item",itemSchema);
const Listitem = mongoose.model("Listitem",listitemSchema);

const app =express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.post("/",function(req,resp){
    let item = new Item({
        name : req.body.newItem
    });
    item.save();
    resp.redirect("/");
});

app.get("/",function(req,resp){
    let day = date.getDate();
    var todolist = [];
    Item.find(function(err,items){
        if(err){
            console.log(err);
        }else{
            items.forEach(function(viewItem){
                todolist.push(viewItem.name);
            });
            resp.render("list",{viewDay: day, viewList: todolist, viewlistName: "Default"});
        }
    });
});

app.post("/delete",function(req,resp){
    if(req.body.listsource === "Default"){
        Item.deleteOne({name : req.body.checkbox},function(err){
            if(err){
                console.log(err);
            }
            resp.redirect("/");
        });
    }else{
        Listitem.deleteOne({name: req.body.checkbox, listname: req.body.listsource},function(err){
            if(err){
                console.log(err);
            }
            resp.redirect("/"+req.body.listsource);
        });
    }
});

app.post("/:customListname",function(req,resp){
    let taskList = new Listitem({
        name : req.body.newItem,
        listname : req.params.customListname
    });
    taskList.save();
    resp.redirect("/"+req.params.customListname);
});

app.get("/:customListname",function(req,resp){
    let day = date.getDate();
    var todolist = [];
    Listitem.find({listname : req.params.customListname},function(err,items){
        if(err){
            console.log(err);
        }else{
            items.forEach(function(viewItem){
                todolist.push(viewItem.name);
            });
            resp.render("list",{viewDay: day, viewList: todolist, viewlistName: req.params.customListname});
        }
    });
});

app.listen(3000,function(){
    console.log("Server started on Port: 3000");
});