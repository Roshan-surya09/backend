const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const Chat = require("./models/Chat");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

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

//show route
app.get("/chats/:id", asyncWrap(async(req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if(!Chat){
       next(new ExpressError(405, "Chat not found"));
    }
    res.render("edit.ejs", { chat });
}));


//Edit 
app.get("/chats/:id/edit",asyncWrap(async (req, res, next) => {
   
        let { id } = req.params;
        let chat = await Chat.findById(id);
        if(!Chat){
           next(new ExpressError(405, "Chat not found"));
        }
        res.render("edit.ejs", { chat });
}));

//Delete chat 
app.delete("/chats/:id", asyncWrap(async (req, res) => {
        let { id } = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect("/chats");
}));

function asyncWrap(fn){
    return function(req, res, next){
        fn(req, res, next).catch((err) => next(err));
    };
};

//Put requirest

app.put("/chats/:id", asyncWrap(async (req, res) => {
   
        let { id } = req.params;
        let { message : newMessage } = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(
            id, 
            {message : newMessage}, 
            { runValidators: true}, 
            { new : true});
            console.log(updatedChat);
            res.redirect("/chats"); 
}));

//Index.rout

app.get("/chats",asyncWrap(async (req, res) => {
        let chats = await Chat.find();
     console.log(chats);
     res.render("index.ejs", { chats });
}));

app.get("/", (req, res) => {
    res.send("root is working");
});

const handleValidationErr = (err) => {
    console.log("This was a validation err. Please follow rules");
    return err;
};

app.use((err, req, res, next) => {
    console.log(err.name);
    if(err.name === "validationErr"){
        err = handleValidationErr(err);
    }
    next(err);
});

//Error Handler 
app.use((err, req, res, next) => {
    let { status= 500, message = "some error occured"} = err;
    res.status(status).send(message);
})

app.listen(8080, () => {
    console.log(`listening on port 8080`);
});