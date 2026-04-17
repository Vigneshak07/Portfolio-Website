const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoBD Connection
mongoose.connect("mongodb+srv://Vignesh_Bd:<db_password>@cluster0.vdalara.mongodb.net/?appName=Cluster0", {
 
    useNewUrlParser:true,
    useUnifiedToplogy:true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema 
const MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
});

const Message = mongoose.model("Message", MessageSchema);

// API to store data
app.post("/send", async (req,res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(200).send("Message Saved Successfully");
    } catch (error) {
        res.status(500).send("Error Saving message");
    }
});

//start server 
app.listen (5000, () => {
    console.log("Server Running on port 5000");
});