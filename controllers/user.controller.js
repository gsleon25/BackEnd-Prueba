'use strict'

var User = require('../models/user.model');
var Schedule = require('../models/schedule.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../services/jwt");
var fs = require('fs');
var path = require('path');



// --------------------------------------------------------------------

 function saveUser(req,res){
    var userModel = new User();
    var params =  req.body;

    if(params.name && params.username && params.email && params.password){
        User.findOne({username: params.username, email: params.email}, (err, userGuardado) =>{
            if(err){
                return res.status(500).send({mensaje: "Error del servidor"});
            }else if(userGuardado){
                return res.send({mensaje: "Usuario o correo ya utilizado"});
            }else{
                userModel.name = params.name
                userModel.username = params.username;
                userModel.email = params.email;
                userModel.password = params.password
                userModel.role = 'ROLE_USER';
                //userModel.shedules = req.user.sub;

                bcrypt.hash(params.password,null, null, (err, passwordHash) =>{
                    if(err){
                        return res.status(500).send({mensaje: "Error al encriptar contraseña"});
                    }else if(passwordHash){
                        userModel.password = passwordHash;
                        userModel.save((err, userGuardado) =>{
                            if(err){
                                return res.status(500).send({mensaje: "Error del servidor"});
                            }else if(userGuardado){
                                return res.send({mensaje:"Usuario Creado", userModel: userGuardado});
                            }else{
                                return res.status(404).send({mensaje: "Usuario no guardado"});
                            }   
                        })
                    }else{
                        return res.status(418).send({mensaje: "Error inesperado"});
                    }
                });
            }
        })
    }else{
        return res.send({mensaje: "Ingrese todos los datos"});
    }
}

// --------------------------------------------------------------------

function login(req, res) {
    var params = req.body;

    if(params.username && params.password){
        User.findOne({ username: params.username }, (err, userEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

            if (userEncontrado) {
                bcrypt.compare(params.password, userEncontrado.password, (err, passVerificada) => {
                    if (passVerificada) {
                        if (params.getToken = 'true') {
                            return res.status(200).send({
                                mensaje: "Usuario logeado",
                                userEncontrado,
                                token: jwt.createToken(userEncontrado),
                            })
                        } else {
                            userEncontrado.password = undefined;
                            return res.status(200).send({ userEncontrado });
                        }
                    } else {
                        return res.status(500).send({ mensaje: 'El usuario no se a podido identificar' });
                    }
                })
            } else {
                return res.status(500).send({ mensaje: 'Error al buscar el usuario' });
            }
        });
    }else {
        return res.status(400).send({message: "Error, ingrese todos los datos"});
    }
}


// --------------------------------------------------------------------



function getUsers(req, res){
    User.find().exec((err, users) => {
        if(err){
            return res.status(500).send({mensaje: "Error al buscar los usuarios"})
        }else if(users){
            console.log(users)
            return res.send({mensaje: "Usuarios encontrados", users})
        }else{
            return res.status(204).send({mensaje: "No se encontraron usuarios"})
        }
    })
}


// --------------------------------------------------------------------

function getUserID(req, res) {
    var UserId = req.params.userId;
 
    User.findById(UserId, (err, userEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!userEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({mensaje:"El Usuario ha sido encontrado exitosamente" ,userEncontrado });
    })
}



// --------------------------------------------------------------------



function updateUser(req, res){
    var idUser = req.params.id;
    var update = req.body; 

    if(idUser != req.user.sub){
        res.status(403).send({message:"No tienes permisos para esta ruta"});
    }else{
        User.findOne({username:update.username},(err,userRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor ",err});
            }else if(userRepeat){
                res.status(403).send({message:"No puede actualizar su nombre de usuario porque ya esta en uso"});
            }else{
                User.findByIdAndUpdate(idUser, update, {new:true},(err,updateUser) =>{
                    if(err){
                        res.status(500).send({message:"Error en el servidor ", err});
                    }else if(updateUser){
                        res.send({Usuario_Actualizado: updateUser});
                    }else{
                        res.status(404).send({message:"El usuario que quiere actualizar no existe"});
                    }
                });
            }
        });
    }
}

// --------------------------------------------------------------------



function deleteUser(req, res){
    var idUser = req.params.id;

    if(req.user.sub != idUser){
        res.status(403).send({message:"No tienes permisos para esta ruta"});        
    }else{
        User.findByIdAndRemove(idUser,(err,deleted)=>{
            if(err){
                res.status(500).send({message:"Error en el servidor ", err});
            }else if(deleted){
                res.send({message:"Usuario eliminado exitosamente"});
            }else{
                res.status(404).send({message:"El usuario que quiere eliminar no existe"});
            }
        });
    }
    
} 
/*
function DeleteUser(req,res){
    var idUser = req.params.id;

    if(req.user.sub != idUser){
        User.findByIdAndRemove(idUser,(err,userdelete)=>{
            if(err){
                res.status(500).send({mensaje:"Error general del servidor", err});
            }else if(userdelete){
                Schedule.deleteMany({user :idUser}, (err,deleteSchedule)=>{
                    if(err){
                        res.status(500).send({mensaje:"Error general en el sistema ", err});
                    }else if(deleteSchedule){
                        res.send({mensaje:"Se ha eliminado al usuario exitosamente"});
                    }else{
                        res.status(400).send({mensaje:"No se logro eliminar los horarios asignados al usuario"});
                    }
                })
            }else{
                res.status(400).send({mensaje:"No se logro eliminar al usuario"});
            }
        });
    }else{
        res.send({mensaje:"No tienes permisos para esta ruta"});
    }
}
*/

function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.send({message: 'No posees permisos necesarios para realizar esta acción'})
    }else{
        if(!params.password){
            return res.status(401).send({message: 'Por favor ingresa la contraseña para poder eliminar tu cuenta'});
        }else{
            User.findById(userId, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                        if(err){
                            return res.send({message: 'Error general al verificar contraseña'})
                        }else if(checkPassword){
                            User.findByIdAndRemove(userId, (err, userFind)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al verificar contraseña'})
                                }else if(userFind){
                                    Schedule.deleteMany({user: userId}, (err, deleteSchedules)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al actualizar'});
                                        }else if(deleteSchedules){
                                            return res.send({message: 'Usuario eliminado', userRemoved:userFind})
                                        }else{
                                            return res.status(500).send({message: 'no se encontro'});
                                        }
                                    })  
                                }else{
                                    return res.send({message: 'Usuario no encontrado o ya eliminado'})
                                }
                            })
                        }else{
                            return res.status(403).send({message: 'Contraseña incorrecta'})
                        }
                    })
                }else{
                    return res.send({message: 'Usuario inexistente o ya eliminado'})
                }
            })
        }
    }
}

module.exports = {
    saveUser,
    login,
    getUsers,
    getUserID,
    updateUser,
    removeUser
}
        