'use strict'

var Schedule = require('../models/schedule.model');


// --------------------------------------------------------------------


function saveSchedule(req,res) {
    var horarioModel = new Schedule();
    var params = req.body; 
 
    if(params.nameSchedule && params.descriptionSchedule){
        horarioModel.nameSchedule = params.nameSchedule;
        horarioModel.descriptionSchedule = params.descriptionSchedule;
        horarioModel.daysWeek = params.daysWeek;
        horarioModel.userSchedule = req.user.sub;
    
        horarioModel.save((err, horarioGuardado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion del horario' });
            if(!horarioGuardado) return res.status(500).send({ mensaje: 'Error al agregar el Horario' });
 
            return res.status(200).send({ mensaje: "Horario Creado Correctamente",horarioGuardado })
        })
    }else{
        return res.status(500).send({mensaje: "Rellene todos los datos necesarios"})
    }
 }


 // --------------------------------------------------------------------



 function getSchedules(req, res){
    Schedule.find().exec((err, shedules) => {
        if(err){
            return res.status(500).send({mensaje: "Error al buscar los horarios"})
        }else if(shedules){
            console.log(shedules)
            return res.send({mensaje: "Horarios encontrados", shedules})
        }else{
            return res.status(204).send({mensaje: "No se encontraron los Horarios"})
        }
    })
}


// --------------------------------------------------------------------



function getScheduleID(req, res) {
    var ScheduleId = req.params.scheduleId;
 
    Schedule.findById(ScheduleId, (err, HorarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Horario' });
        if (!HorarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Horario.' });
        return res.status(200).send({mensaje:"El Horario ha sido encontrado exitosamente" ,HorarioEncontrado });
    })
}


// --------------------------------------------------------------------


function updateSchedule(req,res){
    var ScheduleId = req.params.id;
    var update = req.body
    
    if(req.user.role == "ROLE_USER"){
        Schedule.findByIdAndUpdate(ScheduleId, update, {new: true}, (err, updateSchedule) =>{
            if(err){
                res.status(500).send({message:"Error general"});
            }else if(updateSchedule){
                res.send({schedule: updateSchedule});
            }else{
                res.status(404).send({err: "No se ha encontrado el horario para actualizar"});
            }
        });
    }else{
        res.status(403).send({message: "No tienen permisos para esta ruta"});
    }
}


// --------------------------------------------------------------------


function deleteSchedule(req, res){
    var idSchedule = req.params.id;

   
        Schedule.findByIdAndRemove(idSchedule,(err,deleted)=>{
            if(err){
                res.status(500).send({message:"Error en el servidor ", err});
            }else if(deleted){
                res.send({message:"Horario eliminado exitosamente"});
            }else{
                res.status(404).send({message:"El horario que quiere eliminar no existe"});
            }
        });
    }
    




 module.exports = {
    saveSchedule,
    getSchedules,
    getScheduleID,
    updateSchedule,
    deleteSchedule
 }
 