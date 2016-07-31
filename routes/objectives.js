var axios = require("axios");

var Model = require("falcor").Model,
  $ref = Model.ref,
  $atom = Model.atom,
  $error = Model.error;

module.exports = [{
  route: 'objectives.length',
  get: function(pathSet) {
    return this.getObjectives()
      .then(function(resp) {
        return {
          path: pathSet,
          value: $atom(resp.data.length)
        };
      });
  }
}, {
  route: "objectives[{ranges:ids}]",
  get: function(pathSet) {
    return this.getObjectives()
      .then(function(resp) {
        var results = [];

        pathSet.ids.forEach(function(range) {
          resp.data.slice(range.from, range.to + 1).forEach(function(site, idx) {
            results.push({
              path: [pathSet[0], range.from + idx],
              value: $ref(["objectivesById", site.id])
            });
          });
        });

        return results;
      });
  }
}, {
  route: "objectivesById[{keys:guids}][{keys:fields}]",
  get: function(pathSet) {
    var getObjectiveById = this.getObjectiveById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getObjectiveById(id)
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
}];
