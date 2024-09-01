const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const Chat = require("./models/Chat");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended : true }));
app.use(methodOverride("_method"));


main().then(res => {console.log("Mongoose server working")}).catch(err => {console.log(err)});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//New user

app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

//Insert DB
app.post("/chats", (req, res) => {
    let { from , message, to } = req.body;
    let newChat = new Chat({
        from : from,
        message : message,
        to : to,
        created_at : new Date(),
    });

    newChat.save()
    .then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });

    res.redirect("/chats");
});

//Edit 
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
});

//Delete chat 
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
});

//Put requirest

app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { message : newMessage } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
        id, 
        {message : newMessage}, 
        { runValidators: true}, 
        { new : true});
        console.log(updatedChat);
        res.redirect("/chats");
});

//Index.rout

app.get("/chats", async (req, res) => {
     let chats = await Chat.find();
     console.log(chats);
     res.render("index.ejs", { chats });
});

app.get("/", (req, res) => {
    res.send("root is working");
});

app.listen(8080, () => {
    console.log(`listening on port 8080`);
});