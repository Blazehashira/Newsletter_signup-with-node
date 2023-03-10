//Install node(npm init) to be able to install npm modules such express and request
const express = require("express"); //this is how to require modules installed
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public")); //a special function of express that allows the storage of static files by specifiyng a static folder. With this the static files in the folder can be referred to using a relatiive URL.
app.use(express.urlencoded({ extended: true })); //this allows us to get information from the body of the app.

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html"); //res.sendFile is used to specify the response to send the file that is at the location of the directory name of the current file
}); //This block sends the html file 'signup.html' as the home file when the home route('/') is called using the 'get' method.

app.post("/", function (req, res) {
  const firstName = req.body.fname; //these are used to pull up the values in the field with the associated 'name' in the html file.
  const lastName = req.body.lname;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us13.api.mailchimp.com/3.0/lists/6786a7663c"; //this is going to come from the main endpoint

  const options = {
    //this object is created to create some options
    method: "POST", //this is where the method is specified
    auth: "apikey:4f3417e8036bba5d1509cfa64b657fce-us13", //auth allows for basic authentication
  };

  // the request is saved in a constant so that the constant would be used to send things to the server by calling the constant name.write()
  const request = https.request(url, options, function (response) {
    //this block uses an if statement to send a file depending on the statusCode gotten after running a server.
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  }); //to post data to an external resources using this https module, passing in a url,option(method is a type of option that allows me to specify the type of request I want to make e.g 'post' request) and function.

  request.write(jsonData); //here the const request is called with the write() method is used to send the jsonData to the server.
  request.end(); //this is used to specify that we are done with the request
});

app.post("/failure.html", function (req, res) {
  res.redirect("/");
});

//Here is how to setup the server to listen on desired port i.e 3000
app.listen(process.env.PORT || 3000, function () {
  console.log("Server 3000 running");
});

//Mailchimp Apikey
//4f3417e8036bba5d1509cfa64b657fce-us13 /us13 is the server prefix for the url.

//list ID - List Id is used to specify which to subscribe to
//6786a7663c
