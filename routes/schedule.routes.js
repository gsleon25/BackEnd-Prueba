'use strict'

// IMPORTACIONES
var express = require('express');
var scheduleController = require('../controllers/schedule.controller');


// IMPORTACION MIDDLEWARES PARA RUTAS
var md_autorizacion = require('../middlewares/authenticated');

//RUTAS
var app = express.Router();
app.post('/saveSchedule', md_autorizacion.ensureAuth, scheduleController.saveSchedule);
app.get('/getSchedules', md_autorizacion.ensureAuth, scheduleController.getSchedules);
app.get('/getScheduleID/:scheduleId', md_autorizacion.ensureAuth, scheduleController.getScheduleID);
app.put('/updateSchedule/:id', md_autorizacion.ensureAuth, scheduleController.updateSchedule);
app.delete('/deleteSchedule/:id', md_autorizacion.ensureAuth, scheduleController.deleteSchedule);

module.exports = app;