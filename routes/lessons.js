var axios = require("axios");

var Model = require("falcor").Model,
  $ref = Model.ref,
  $atom = Model.atom,
  $error = Model.error;

module.exports = [{
  route: "lessonsById[{keys:guids}][{keys:fields}]",
  get: function(pathSet) {
    var getLessonById = this.getLessonById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getLessonById(id)
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
  route: "lessonsById[{keys:guids}]['objective'].length",
  get: function(pathSet) {
    var getLessonById = this.getLessonById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getLessonById(id)
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
  route: "lessonsById[{keys:guids}]['objective'][{ranges:ids}]",
  get: function(pathSet) {
    var getLessonById = this.getLessonById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getLessonById(id)
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
}];
