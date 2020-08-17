//jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;

const csvtojsonV2 = require('csvtojson/v2');
const formidable = require('formidable');

const app = express();
let array;

app.use(express.static('public'));
app.use(
	bodyParser.urlencoded({
		extended : true
	})
);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/signup.html');
});

app.post('/api/upload', function (req, res){
  var form = new formidable.IncomingForm();

  form.parse(req);

  form.on('fileBegin', function (name, file){
      file.path = __dirname + '/uploads/' + file.name;
      csvtojsonV2().fromFile(file.path).then((jsonObj) => {
      array = jsonObj;

      });
  });

  form.on('file', function (name, file){
      console.log('Uploaded ' + file.name);
  });

  
});



app.post('/sendData', function(req, res){
  key = req.body.key;
  secret = req.body.secret;

  array.forEach(element => {
    
    axios({
    method: 'post',
     url: "https://my.demio.com/api/v1/event/register",
      headers: {
        'Content-Type': 'application/json',
       "Api-Key" : key ,
      "Api-Secret" : secret
     },
     data: element
    
     }) .then(res => console.log(res))
     .catch(err => console.log(err));
        });
        res.sendFile(__dirname + '/signup.html');
});





app.listen(process.env.PORT || 3000, function (req, res){
	console.log('The server is running on port 3000');
});
