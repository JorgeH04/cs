if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  } 

const path = require('path');
const cors = require('cors');
const express = require('express');

const app = express();

//bbdd
const { mongoose } = require('./database');




//settings
app.set('port', process.env.PORT || 4000);



//middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));




//routes '/api/post', 
app.use('/', require('./routes/index'));


   
// server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});

