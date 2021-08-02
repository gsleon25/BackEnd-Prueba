'use strict'

// IMPORTACIONES
var express = require('express');
var userController = require('../controllers/user.controller');


// IMPORTACION MIDDLEWARES PARA RUTAS
var md_autorizacion = require('../middlewares/authenticated');

//RUTAS
var app = express.Router();
app.post('/saveUser', userController.saveUser);
app.post('/login', userController.login);
app.get('/getUsers', md_autorizacion.ensureAuth, userController.getUsers);
app.get('/getUserID/:userId', md_autorizacion.ensureAuth, userController.getUserID);
//app.delete('/deleteUser/:id', md_autorizacion.ensureAuth, userController.deleteUser);
app.put('/updateUser/:id', md_autorizacion.ensureAuth, userController.updateUser);
//app.delete('/DeleteUser/:id', md_autorizacion.ensureAuth, userController.DeleteUser);
app.delete('/removeUser/:id', md_autorizacion.ensureAuth, userController.removeUser);



module.exports = app;