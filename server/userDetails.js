//this is our schema file
const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema(
    {
        fname: String,
        lname: String,
        email: {type:String, unique:true },
        password:String,
    },

    {
        collection: "UserInfo",
    }
);

mongoose.model("UserInfo", userDetailsSchema);//Create a model using the defined schema: