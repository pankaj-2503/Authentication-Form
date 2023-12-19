const express = require("express");
const app=express();
const mongoose=require("mongoose");
const bodyParser = require("body-parser");

const dotenv=require("dotenv");
dotenv.config();

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
const port=process.env.PORT || 3000;

//database connection
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.v0vlivx.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser:true,
    useUnifiedTopology:true,

});

//schema
const registrationSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const Signup=mongoose.model("SignUp",registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



app.get('/',(req,res)=>{
    res.sendFile(__dirname+ "/pages/index.html");
});


app.post('/signup',async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser=await Signup.findOne({email:email}); // check if user already exist  or not
        if(!existingUser){
            const signupData=new Signup({
                name,
                email,
                password
            });
            await signupData.save();
            res.redirect("/success");

        }
        else{
            console.log("User Already Exist!");
            res.redirect("/error");
        }
            
    }
    catch(err){
        console.log(err);
        res.redirect("/error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname +"/pages/success.html");
})

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/Error.html");
})








app.listen(port,(req,res)=>{
    console.log(`App is listening at port ${port}`);
});