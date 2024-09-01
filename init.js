const mongoose = require("mongoose");
const Chat = require("./models/Chat");

main().then(res => {console.log("Mongoose server working")}).catch(err => {console.log(err)});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats = [
    {
      from : "Vaibhav",
      to : "Abhay",
      message : "What's going on bro.",
      created_at : new Date(), //UTC
    },
    {
        from : "Roshan",
        to : "Abhay",
        message : "when you come bsp bro..",
        created_at : new Date(), //UTC
      },
      {
        from : "Alex",
        to : "vaibhav",
        message : "can you watching dead-Pooll bro.",
        created_at : new Date(), //UTC
      },
      {
        from : "vishu",
        to : "Abhay",
        message : "what's up mama",
        created_at : new Date(), //UTC
      },
      {
        from : "Kanhaiya",
        to : "Kailash",
        message : "Bussiness make reachest man.",
        created_at : new Date(), //UTC
      },
];

Chat.insertMany(allChats);