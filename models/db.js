const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DBCONNECTION, { useNewUrlParser:true }, (error)=>{
    if(!error) console.log('DB Connected successfully!');
    else console.log('Failed to connect DB');
});

require('./employee.model');