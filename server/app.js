const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const JWT_SECRET="wiufhwqhdqw9dwqd90wwmqdjwqdujqiwhdwqjded832u99010djdsk"

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

    const encryptedPassword = await bcrypt.hash(password,10)// to encrypt the password

    try{

        const oldUser = await User.findOne({email});

        if(oldUser){
            return res.send({error:"User exists"});// so as to make sure the same email is not registered twice
        }

        await User.create({
            fname:fname,
            lname:lname,
            email:email,
            password:encryptedPassword,
        });
        res.send({status:"ok"})
    }

    catch(error){
        res.send("error");
    }
})



// create our login API

app.post("/login-user", async(req,res)=> {
    const { email, password } = req.body //this is what we are getting from the webpage

    const user = await User.findOne({email});

    if(!user){
        return res.send({error:"User Not Found"});// if the user does not exist
    }

    //check and decrypt password
    if(await bcrypt.compare(password, user.password)){// compare password with user passsword

        const token = jwt.sign({email:user.email}, JWT_SECRET)//generate jwt token
    
        
        if(res.status(201)){//status code 201 means request was successful
            return res.json({status:"ok", data: token });
        } else {
            return res.json({error: "error"});
        }
    }   

    res.json({status:"error", error: "Invalid password"})
});


// API for user data


app.post("/user-data", (req,res)=> {
    const{token} = req.body;
    try{

    const user = jwt.verify(token, JWT_SECRET);// verify the user details and store it inside a variable
        console.log(user);

    const userEmail = user.email;
    User.findOne({ email: userEmail })
    .then((data) => {
        res.send({status:'ok', data:data})
    })
    .catch((error)=> {
        res.send({status:"error", data:data})
    })
    
    }
    catch{

    }

})


app.listen(5000, () => {
    console.log('Server started')
});


