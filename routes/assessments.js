var axios = require("axios");

var Model = require("falcor").Model,
  $ref = Model.ref,
  $atom = Model.atom,
  $error = Model.error;

module.exports = [{
  route: 'assessments.length',
  get: function(pathSet) {
    return this.getAssessments()
      .then(function(resp) {
        return {
          path: pathSet,
          value: $atom(resp.data.length)
        };
      });
  }
}, {
  route: "assessments[{ranges:ids}]",
  get: function(pathSet) {
    return this.getAssessments()
      .then(function(resp) {
        var results = [];

        pathSet.ids.forEach(function(range) {
          resp.data.slice(range.from, range.to + 1).forEach(function(ass, idx) {
            results.push({
              path: [pathSet[0], range.from + idx],
              value: $ref(["assessmentsById", ass.id])
            });
          });
        });

        return results;
      });
  }
}, {
  route: "assessmentsById[{keys:guids}][{keys:fields}]",
  get: function(pathSet) {
    var getAssessmentById = this.getAssessmentById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getAssessmentById(id)
            .then(function(resp) {
              var results = [];

              var map = resp.data;
              pathSet.fields.forEach(function(field) {
                var path = [pathSet[0], id, field];

                if (!map[field]) {
                  return results.push({
                    path: path,
                    value: $error("Unknown field")
                  });
                }

                results.push({
                  path: path,
                  value: map[field]
                });
              });

              return results;
            })
            .catch(function(resp) {
              var results = [];

              pathSet.fields.forEach(function(field) {
                var path = [pathSet[0], id, field];

                //We only have the id in error state
                if (field == "id") {
                  results.push({
                    path: path,
                    value: $atom(id)
                  });
                } else {
                  results.push({
                    path: path,
                    value: $error(resp.statusText)
                  });
                }
              });

              return results;
            });
        })
      )
      .then(function(results) {
        return [].concat.apply([], results);
      });
  }
}, {
  route: "assessmentsById[{keys:guids}]['objective'].length",
  get: function(pathSet) {
    var getAssessmentById = this.getAssessmentById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getAssessmentById(id)
            .then(function(resp) {
              var path = [pathSet[0], id, pathSet[2], pathSet[3]];

              return {
                path: path,
                value: $atom(resp.data['objectives'].length)
              };
            });
        })
      )
      .then(function(results) {
        return [].concat.apply([], results);
      });
  }
}, {
  route: "assessmentsById[{keys:guids}]['objective'][{ranges:ids}]",
  get: function(pathSet) {
    var getAssessmentById = this.getAssessmentById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getAssessmentById(id)
            .then(function(resp) {
              var results = [];

              //TODO: sad path with objectives
              pathSet.ids.forEach(function(range) {
                resp.data['objectives'].slice(range.from, range.to + 1).forEach(function(obj, idx) {
                  results.push({
                    path: [pathSet[0], id, pathSet[2], range.from + idx],
                    value: $ref(["objectivesById", obj.id])
                  });
                });
              });

              return results;
            });
        })
      )
      .then(function(results) {
        return [].concat.apply([], results);
      });
  }
}, {
  route: 'questions.length',
  get: function(pathSet) {
    return this.getAssessmentItems()
      .then(function(resp) {
        return {
          path: pathSet,
          value: $atom(resp.data.length)
        };
      });
  }
}, {
  route: "questions[{ranges:ids}]",
  get: function(pathSet) {
    return this.getAssessmentItems()
      .then(function(resp) {
        var results = [];

        pathSet.ids.forEach(function(range) {
          resp.data.slice(range.from, range.to + 1).forEach(function(item, idx) {
            results.push({
              path: [pathSet[0], range.from + idx],
              value: $ref(["questionsById", item.id])
            });
          });
        });

        return results;
      });
  }
}, {
  route: "questionsById[{keys:guids}][{keys:fields}]",
  get: function(pathSet) {
    var getAssessmentItemById = this.getAssessmentItemById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getAssessmentItemById(id)
            .then(function(resp) {
              var results = [];

              var map = resp.data;
              pathSet.fields.forEach(function(field) {
                var path = [pathSet[0], id, field];

                if (!map[field]) {
                  return results.push({
                    path: path,
                    value: $error("Unknown field")
                  });
                }

                results.push({
                  path: path,
                  value: map[field]
                });
              });

              return results;
            })
            .catch(function(resp) {
              var results = [];

              pathSet.fields.forEach(function(field) {
                var path = [pathSet[0], id, field];

                //We only have the id in error state
                if (field == "id") {
                  results.push({
                    path: path,
                    value: $atom(id)
                  });
                } else {
                  results.push({
                    path: path,
                    value: $error(resp.statusText)
                  });
                }
              });

              return results;
            });
        })
      )
      .then(function(results) {
        return [].concat.apply([], results);
      });
  }
}, {
  route: "questionsById[{keys:guids}]['objective'].length",
  get: function(pathSet) {
    var getAssessmentItemById = this.getAssessmentItemById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getAssessmentItemById(id)
            .then(function(resp) {
              var path = [pathSet[0], id, pathSet[2], pathSet[3]];

              return {
                path: path,
                value: $atom(resp.data['objectiveIds'].length)
              };
            });
        })
      )
      .then(function(results) {
        return [].concat.apply([], results);
      });
  }
}, {
  route: "questionsById[{keys:guids}]['objective'][{ranges:ids}]",
  get: function(pathSet) {
    var getAssessmentItemById = this.getAssessmentItemById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getAssessmentItemById(id)
            .then(function(resp) {
              var results = [];

              //TODO: sad path with objectives
              pathSet.ids.forEach(function(range) {
                resp.data['objectiveIds'].slice(range.from, range.to + 1).forEach(function(obj, idx) {
                  results.push({
                    path: [pathSet[0], id, pathSet[2], range.from + idx],
                    value: $ref(["objectivesById", obj.id])
                  });
                });
              });

              return results;
            });
        })
      )
      .then(function(results) {
        return [].concat.apply([], results);
      });
  }
}];
