const express = require('express');

var router = express.Router();

const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req,res)=>{
    res.render('employee/addOrEdit', {
        viewTitle: "Insert Employee"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req,res){
    var e = new Employee();
    e.fullName = req.body.fullName;
    e.email = req.body.email;
    e.mobile = req.body.mobile;
    e.city = req.body.city;
    e.save((error, doc)=>{
        if(!error)
            res.redirect('employee/list');
        else {
            if (error.name == 'ValidationError') {
                handleValidationError(error, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else
            console.log('Error during record insertion: ' + error);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (error, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (error.name == 'ValidationError') {
                handleValidationError(error, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + error);
        }
    });
}

router.get('/list', (req,res)=>{
    Employee.find((error,docs)=>{
        if(!error){
            res.render('employee/list',{
                list: docs
            });
        }
        else
            console.log('Error in retrieving employee list :' + error);
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (error, doc) => {
        if (!error) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (error, doc) => {
        if (!error) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;