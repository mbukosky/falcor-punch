"use strict";

var config = require('../config');
var util = require("util");
var axios = require("axios");
var Base = require("falcor-router").createClass(
  Array.prototype.concat.apply([], [
    require('./users'),
    require('./sites'),
    require('./roles'),
    require('./lessons'),
    require('./objectives'),
    require('./assessments'),
    require('./courses')
  ])
);

function RootRouter(token) {
  Base.call(this);

  this.token = token;

  if (!this.token) {
    throw new Error("No token specified");
  }

  //User Service:
  this.getUsers = function() {
    return axios.get(config.BASE_URI + "/v1/Users", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getUserById = function(id) {
    return axios.get(config.BASE_URI + "/v1/Users/" + id, {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getRelationships = function() {
    return axios.get(config.BASE_URI + "/v1/UsersRolesSites", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };

  //Site Service:
  this.getSites = function() {
    return axios.get(config.BASE_URI + "/v1/Sites", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getSiteById = function(id) {
    return axios.get(config.BASE_URI + "/v1/Sites/" + id, {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };

  //Role Service:
  this.getRoles = function() {
    return axios.get(config.BASE_URI + "/v1/Roles", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getRoleById = function(id) {
    return axios.get(config.BASE_URI + "/v1/Roles/" + id, {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };

  //Lesson Service:
  this.getLessonById = function(id) {
    return axios.get(config.BASE_URI + "/v1/Lessons/" + id, {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };

  //Objective Service:
  this.getObjectives = function() {
    return axios.get(config.BASE_URI + "/v1/Objectives", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getObjectiveById = function(id) {
    return axios.get(config.BASE_URI + "/v1/Objectives/" + id, {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };

  //Assessments Service:
  this.getAssessments = function() {
    return axios.get(config.BASE_URI + "/v1/Assessments", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getAssessmentById = function(id) {
    return axios.get(config.BASE_URI + "/v1/Assessments/" + id, {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getAssessmentItems = function() {
    return axios.get(config.BASE_URI + "/v1/AssessmentItems", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getAssessmentItemById = function(id) {
    return axios.get(config.BASE_URI + "/v1/AssessmentItems/" + id, {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };

  //Courses Service:
  this.getCourses = function() {
    return axios.get(config.BASE_URI + "/v1/Courses", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getCourseById = function(id) {
    return axios.get(config.BASE_URI + "/v1/Courses/" + id, {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getCourseItemsById = function(id) {
    return axios.get(config.BASE_URI + "/v1/Courses/" + id + "/Items", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
  this.getCourseObjectives = function(id) {
    return axios.get(config.BASE_URI + "/v1/Courses/" + id + "/Objectives", {
      transformRequest: axios.defaults.transformRequest.concat(function(data, headers) {
        headers['Authorization'] = token;
      })
    });
  };
}

util.inherits(RootRouter, Base);

module.exports = RootRouter;
