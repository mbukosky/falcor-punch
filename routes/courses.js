var axios = require("axios");

var Model = require("falcor").Model,
  $ref = Model.ref,
  $atom = Model.atom,
  $error = Model.error;

module.exports = [{
  route: 'courses.length',
  get: function(pathSet) {
    return this.getCourses()
      .then(function(resp) {
        return {
          path: pathSet,
          value: $atom(resp.data.length)
        };
      });
  }
}, {
  route: "courses[{ranges:ids}]",
  get: function(pathSet) {
    return this.getCourses()
      .then(function(resp) {
        var results = [];

        pathSet.ids.forEach(function(range) {
          resp.data.slice(range.from, range.to + 1).forEach(function(course, idx) {
            results.push({
              path: [pathSet[0], range.from + idx],
              value: $ref(["coursesById", course.id])
            });
          });
        });

        return results;
      });
  }
}, {
  route: "coursesById[{keys:guids}][{keys:fields}]",
  get: function(pathSet) {
    var getCourseById = this.getCourseById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getCourseById(id)
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
  route: "coursesById[{keys:guids}]['items'].length",
  get: function(pathSet) {
    var getCourseItemsById = this.getCourseItemsById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getCourseItemsById(id)
            .then(function(resp) {
              var path = [pathSet[0], id, pathSet[2], pathSet[3]];

              return {
                path: path,
                value: $atom(resp.data.length)
              };
            });
        })
      )
      .then(function(results) {
        return [].concat.apply([], results);
      });
  }
}, {
  route: "coursesById[{keys:guids}]['items'][{ranges:ids}][{keys:fields}]",
  get: function(pathSet) {
    var getCourseItemsById = this.getCourseItemsById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getCourseItemsById(id)
            .then(function(resp) {
              var results = [];

              pathSet.ids.forEach(function(range) {
                resp.data.slice(range.from, range.to + 1).forEach(function(item, idx) {
                  var map = item;
                  pathSet.fields.forEach(function(field) {
                    var path = [pathSet[0], id, pathSet[2], pathSet[3], field];

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
  route: "coursesById[{keys:guids}]['objectives'].length",
  get: function(pathSet) {
    var getCourseObjectives = this.getCourseObjectives; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getCourseObjectives(id)
            .then(function(resp) {
              var path = [pathSet[0], id, pathSet[2], pathSet[3]];

              return {
                path: path,
                value: $atom(resp.data.length)
              };
            });
        })
      )
      .then(function(results) {
        return [].concat.apply([], results);
      });
  }
}, {
  route: "coursesById[{keys:guids}]['objectives'][{ranges:ids}]",
  get: function(pathSet) {
    var getCourseObjectives = this.getCourseObjectives; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getCourseObjectives(id)
            .then(function(resp) {
              var results = [];

              //TODO: sad path with objectives
              pathSet.ids.forEach(function(range) {
                resp.data.slice(range.from, range.to + 1).forEach(function(obj, idx) {
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
