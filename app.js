const express = require("express");
const bodyParser = require("body-parser");
const request = require("request"); 
const https = require("https");


const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //that's how we get local files on the server such as pictures and css

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req,res){ // / means home route in html the form must have a method=post and action="/" otherwies it doesn't work
    const firstName = (req.body.fName);
    const lastName = (req.body.lName);
    const email = (req.body.email);
    const data = {
        members:[ //curly braces always after object
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }

        ]
    }
   
    const JsonData = JSON.stringify(data);
    const url = "https://us11.api.mailchimp.com/3.0/lists/77763034d3";
    const options = {
        method: "POST",
        auth: "*"
    }
    
    const request = https.request(url, options, function(response){

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
        var status = response.statusCode;
        if(status === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    })
    console.log("is this working?");
    request.write(JsonData);
    request.end();
   

})
app.post("/failure", function(req,res){
res.redirect("/");
})
app.listen(process.env.PORT || 3000, function(){ //changing port to this allows it to work on heroku server and not local like 3000
    console.log("server is up and running");

})

