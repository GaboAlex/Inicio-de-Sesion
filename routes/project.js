'use strict'

var express = require('express');
var ProjectController = require('../controllers/project');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir:'./imagenes'});
var router = express.Router();

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../api/controllers/profile');
var ctrlAuth = require('../api/controllers/authentication');

router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/home',ProjectController.home);
router.post('/create-project',ProjectController.createProject);
router.get('/project/:id',ProjectController.getProjectById);
router.get('/projects',ProjectController.getAllProjects);
router.put('/update-project/:id',ProjectController.updateProjectById);
router.delete('/delete-project/:id',ProjectController.deleteProjectById);
router.post('/upload-image/:id',multipartMiddleware,ProjectController.uploadImageById);
router.get('/get-image/:namefile',ProjectController.getImageByName);

module.exports = router;