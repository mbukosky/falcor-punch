var axios = require("axios");

var Model = require("falcor").Model,
  $ref = Model.ref,
  $atom = Model.atom,
  $error = Model.error;

module.exports = [{
  route: 'roles.length',
  get: function(pathSet) {
      return this.getRoles()
        .then(function(resp) {
          return {
            path: pathSet,
            value: $atom(resp.data.length)
          };
        });
    }
}, {
  route: "roles[{ranges:ids}]",
  get: function(pathSet) {
    return this.getRoles()
      .then(function(resp) {
        var results = [];

        pathSet.ids.forEach(function(range) {
          resp.data.slice(range.from, range.to + 1).forEach(function(role, idx) {
            results.push({
              path: [pathSet[0], range.from + idx],
              value: $ref(["rolesById", role.id])
            });
          });
        });

        return results;
      });
  }
}, {
  route: "rolesById[{keys:guids}][{keys:fields}]",
  get: function(pathSet) {
    var getRoleById = this.getRoleById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getRoleById(id)
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
            });
        })
      )
      .then(function(results) {
        return [].concat.apply([], results);
      });
  }
}];
