var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var addresses = require('./routes/tasks');

var port = 3000;
var app = express();

const cors = require('cors')

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

// View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);

// Static folder that we put all the Angular stuff
app.use(express.static(path.join(__dirname)+'src'));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
app.use('/',index);
app.use('/api',addresses);

app.listen(port, function(){
  console.log('Server started on port'+port);
});

