const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')

app.use(cors());
app.use(express.json());


const mongoUrl = "mongodb+srv://andrew:andrew123@myconnection.riwdrdo.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoUrl, {
    useNewUrlParser: true
}).then(()=> {console.log('Connected to database');})
.catch(e=>console.log(e));

//create a register API


require("./userDetails")

const User = mongoose.model("UserInfo");

app.post("/register", async(req,res)=> {
    const {fname,lname,email,password} = req.body

    const encryptedPassword = await bcrypt.hash(password,10)
    try{

        const oldUser = await User.findOne({email});
        if(oldUser){
            return res.send({error:"User exists"});
        }


        await User.create({
            fname,
            lname,
            email,
            password:encryptedPassword,
        });
        res.send({status:"ok"})
    }
    catch(error){
        res.send("error");
    }
})


app.listen(5000, () => {
    console.log('Server started')
});


