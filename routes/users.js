var axios = require("axios");

var Model = require("falcor").Model,
  $ref = Model.ref,
  $atom = Model.atom,
  $error = Model.error;

module.exports = [{
  route: 'users.length',
  get: function(pathSet) {
    return this.getUsers()
      .then(function(resp) {
        return {
          path: pathSet,
          value: $atom(resp.data.length)
        };
      });
  }
}, {
  route: "users[{ranges:ids}]",
  get: function(pathSet) {
    return this.getUsers()
      .then(function(resp) {
        var results = [];

        pathSet.ids.forEach(function(range) {
          resp.data.slice(range.from, range.to + 1).forEach(function(user, idx) {
            results.push({
              path: [pathSet[0], range.from + idx],
              value: $ref(["usersById", user.id])
            });
          });
        });

        return results;
      });
  }
}, {
  route: "usersById[{keys:guids}][{keys:fields}]",
  get: function(pathSet) {
    var getUserById = this.getUserById; // TODO: This is dumb
    return axios.all(
        pathSet.guids.map(function(id) {
          return getUserById(id)
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
}, {
  route: "users.relationships.length",
  get: function(pathSet) {
    return this.getRelationships()
      .then(function(resp) {
        var path = [pathSet[0], pathSet[1], pathSet[2]];

        return {
          path: path,
          value: $atom(resp.data.length)
        };
      });
  }
}, {
  route: "users.relationships[{ranges:ids}]['role', 'site', 'user']",
  get: function(pathSet) {
    return this.getRelationships()
      .then(function(resp) {
        var results = [];

        pathSet.ids.forEach(function(range) {
          resp.data.slice(range.from, range.to + 1).forEach(function(thing, idx) {

            pathSet[3].forEach(function(type) {
              var path = [pathSet[0], pathSet[1], idx, type];

              if (type == "role") {
                results.push({
                  path: path,
                  value: $ref(["rolesById", thing.roleId])
                });
              } else if (type == "site") {
                results.push({
                  path: path,
                  value: $ref(["sitesById", thing.siteId])
                });
              } else if (type == "user") {
                results.push({
                  path: path,
                  value: $ref(["usersById", thing.userId])
                });
              } else {
                return results.push({
                  path: path,
                  value: $error("Unknown field")
                });
              }
            });

          });
        });

        return results;
      });
  }
}];
