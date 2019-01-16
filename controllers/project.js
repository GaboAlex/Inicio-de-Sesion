'use strict';
var Project = require("../models/project");

var fs = require('fs');
var path_module = require('path');

var controller = {
    home: function(req,res){
        return res.status(200).send({
            message:"HOME del controlador!!!"
        });
    },
    //C = CREATE
    createProject: function(req,res){
        //Creando objeto del modelo project administrado por Mongoose
        var objProject = new Project();
        //creando un arreglo con los parametros recibidos por POSTMAN
        var params = req.body;
        objProject.name = params.name;
        objProject.description = params.description;
        objProject.category = params.category;
        objProject.langs = params.langs;
        objProject.year = params.year;
        objProject.image = "vacio";
        
        objProject.save((err, proyectoGuardado)=>{
            if(err){
                return res.status(500).send({error:"Error al guardar el Proyecto"});
            }
            if(!proyectoGuardado){
                return res.status(404).send({error:"Error al guardar el Proyecto"});
            }
            return res.status(200).send({creado:proyectoGuardado});
        });
    },
    getProjectById: function(req, res){
        var id = req.params.id;
        Project.findById(id,(err,proyectoRecibido)=>{
            if(err){
                return res.status(500).send({error:"Error al traer el proyecto"});
            }
            if(!proyectoRecibido){
                return res.status(404).send({error:"El proyecto no existe"});
            }
            return res.status(200).send({found:proyectoRecibido}); 
        })
    },
    getAllProjects: function(req,res){
        // Project.find({year:2018}).exec((err,proyectos)=>{
        // Project.find().sort('-year').exec((err,proyectos)=>{
        // Project.find().sort('year').exec((err,proyectos)=>{
        Project.find().exec((err,proyectos)=>{
            if(err){
                return res.status(500).send({error:"Error al devolver los proyectos"});
            }
            if(!proyectos){
                return res.status(404).send({error:"Error, no hay registros en la base de Gatos"});
            }
            return res.status(200).send({projects:proyectos});
        });
    },
    updateProjectById: function(req,res){
        var nuevosParametros = req.body;
        var projectId = req.params.id;

        Project.findByIdAndUpdate(projectId,nuevosParametros,{new:true},(err,objProjectUpdated)=>{
            if(err){
                return res.status(500).send({error:"Error al actualizar el proyecto"});
            }
            if(!objProjectUpdated){
                return res.status(404).send({error:"No existe el proyecto para actualizar"});
            }
            return res.status(200).send({actualizado:objProjectUpdated});
        });
    },
    //usar findOne.... Usar métodos !DEPRECATED
    deleteProjectById: function(req,res){
        var projectId = req.params.id;
        //RECIBIR TAMBIEN CONFIMACION DE ELIMINACION
        Project.findByIdAndRemove(projectId,(err,objProjectDeleted)=>{
            if(err){
                return res.status(500).send({error:"Error al eliminar el proyecto"});
            }if(!objProjectDeleted){
                return res.status(404).send({error:"No existe el proyecto para eliminar"});
            }
            return res.status(200).send({eliminado:objProjectDeleted});
        });
    },
    uploadImageById: function(req,res){
        var projectId = req.params.id;
        // => imagenes/123123432343234.PNG
        if(req.files){
            //ruta del archivo
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('.');
            var fileExt = extSplit[1];
            if(fileExt.toLowerCase() == "png" || fileExt.toLowerCase() == "jpg" || fileExt.toLowerCase() == "jpeg"){
                Project.findByIdAndUpdate(projectId,{image:fileName},{new:true},(err,objProjectUpdated)=>{
                    if(err){
                        return res.status(500).send({error:"Error al subir la imagen"});
                    }if(!objProjectUpdated){
                        return res.status(404).send({error:"El proyecto no existe"});
                    }
                    return res.status(200).send({project:objProjectUpdated});
                });
            }else{
                fs.unlink(filePath,(err)=>{
                    return res.status(200).send({message:"La extensión del archivo es inválida"});
                });
                
            }
        }else{
            return res.status(200).send({message:"No has seleccionado ningun archivo"});    
        }
    },
    getImageByName: function(req,res){
        var nombre_de_archivo = req.params.namefile;
        var path = './imagenes/'+nombre_de_archivo;
        fs.exists(path,(exist)=>{
            if(exist){
                return res.sendFile(path_module.resolve(path))
            }else{
                return res.status(200).send({message:"La imagen no existe"})
            }
        });
    }

};

module.exports = controller;