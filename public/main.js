//logging:
var log = console.log.bind(console);

var jlog = function(x) {
  console.log(JSON.stringify(x, null, 3));
};
var jerror = function(x) {
  console.error(JSON.stringify(x, null, 3));
};

var jfalcor = function(res){
  var token = res.data;

  //create model:
  var model = new falcor.Model({
    source: new falcor.HttpDataSource('/model.json', {
      headers: {
        'Authorization': token
      },
      crossDomain: true
    })
  });

  //users:
  var limit = 10;
  model.treatErrorsAsValues().get(
      ["users", "length"],
      ["users", "relationships", "length"],
      ["users", {from: 0, to: limit}, ["id", "username"]],
      ["users", "relationships", {from: 0, to: limit}, "user", ["id", "username"]],
      ["users", "relationships", {from: 0, to: limit}, "site", ["name"]],
      ["users", "relationships", {from: 0, to: limit}, "role", ["id", "name"]],
      ["usersById", ["4cb51cf3-2036-464f-9aa5-e325e24c30bd"], ["firstName", "lastName"]]
    )
    .then(jlog, jerror);

    // model.treatErrorsAsValues().get(
    //     ["users", "relationships", {from: 0, to: limit}, "site", ["id", "name"]],
    //     ["users", "relationships", {from: 0, to: limit}, "user", ["id", "username"]],
    //     ["users", "relationships", {from: 0, to: limit}, "role", ["id", "name"]]
    //   )
    //   .then(jlog, jerror);

  //sites:
  model.get(
      ["sites", "length"],
      ["sites", {from: 0, to: limit}, ["id", "name"]],
      ["sitesById", ["4f868013-acf3-4c7e-9884-6c69504018b0"], ["id", "name", "externalId"]]
    )
    .then(jlog, jerror);

  //roles:
  model.get(
      ["roles", "length"],
      ["roles", [{from: 0, to: 0}], ["id"]],
      ["rolesById", ["c67ec43c-7b9e-4497-85f9-7e1c85736e98"], ["name"]]
    )
    .then(jlog, jerror);

  //lessons:
  model.get(
      ["lessonsById", ["a7c6a0fa-2cfc-4de6-a6f6-e128d3463cf8"], ["id", "displayId", "name"]],
      ["lessonsById", ["a7c6a0fa-2cfc-4de6-a6f6-e128d3463cf8"], "objective", "length"],
      ["lessonsById", ["a7c6a0fa-2cfc-4de6-a6f6-e128d3463cf8"], "objective", {from: 0, to: 1}, ["name", "vendor"]]
    )
    .then(jlog, jerror);

  //objectives:
  model.get(
      ["objectives", "length"],
      ["objectives", [{from: 0, to: limit}], ["id"]],
      ["objectivesById", ["d4252e3b-e3ad-4ec1-8d73-fa1a99e62b81"], ["name", "vendor"]]
    )
    .then(jlog, jerror);

  //assessments:
  model.get(
      ["assessments", "length"],
      ["assessments", [{from: 0, to: limit}], ["id"]],
      ["assessmentsById", ["52337565-fa20-4121-9e3a-84893f86fbcf"], ["name", "vendor"]],
      ["assessmentsById", ["52337565-fa20-4121-9e3a-84893f86fbcf"], "objective", "length"],
      // ["assessmentsById", ["52337565-fa20-4121-9e3a-84893f86fbcf"], "objective", {from: 0, to: 0}, ["name", "vendor"]]
      ["questions", "length"],
      ["questions", [{from: 0, to: limit}], ["id"]],
      ["questionsById", ["5e40b266-fc42-4ac6-b4fd-749cc022b92d"], ["name", "vendor"]],
      ["questionsById", ["5e40b266-fc42-4ac6-b4fd-749cc022b92d"], "objective", "length"]
      // ["questionsById", ["5e40b266-fc42-4ac6-b4fd-749cc022b92d"], "objective", {from: 0, to: 0}, ["name", "vendor"]]
    )
    .then(jlog, jerror);

  model.get(
      ["courses", "length"],
      ["courses", [{from: 0, to: limit}], ["id"]],
      ["coursesById", ["d889ccf6-beb5-4fdc-8835-31d96c4824e5"], ["name", "vendor"]],
      ["coursesById", ["d889ccf6-beb5-4fdc-8835-31d96c4824e5"], "items", "length"],
      ["coursesById", ["d889ccf6-beb5-4fdc-8835-31d96c4824e5"], "items", {from: 0, to: 1}, ["name", "type"]],
      ["coursesById", ["d889ccf6-beb5-4fdc-8835-31d96c4824e5"], "objectives", "length"]
      // ["coursesById", ["d889ccf6-beb5-4fdc-8835-31d96c4824e5"], "objective", {from: 0, to: 0}, ["name", "vendor"]]
    )
    .then(jlog, jerror);
};

//get token:
axios.get("/token").then(jfalcor);





// model.get('genrelist[0..5].titles[0..5].name').then(function (data) {
//     console.log(data);
// });

// model.get('genrelist[0].name').then(jlog, jerror);

// model.get('ual.Site["id", "rowKey", "actor"]').then(jlog, jerror);

// model.get('usersById["68106422-914e-44a7-9d3c-e49a8f2b16b5", "a66df6c1-c9cd-4ca9-ab7a-e85fee9ea462"]["id", "firstName", "lastName"]').then(jlog, jerror);
//
// model.get(
//     'users.length',
//     'users[0..2]["firstName", "lastName", "id"]',
//     'roles.length',
//     'roles[0]["id", "name"]',
//     'sites.length',
//     'sites[0..2]["name", "externalId"]')
//   .then(jlog, jerror);


// model.get(
//     ["usersById", users, "admin"])
//   .then(function(resp) {
//     console.log(JSON.stringify(resp, null, 3));
//
//     var have = Object.keys(resp.json.usersById).map(function(key) {
//         return resp.json.usersById[key].admin;
//       }),
//       sites = have.reduce(function(a, b) {
//         return a.concat(b);
//       });
//
//     return model.get(
//       ["usersById", users, ["firstName", "lastName"]],
//       ["sitesById", sites, ["name", "externalId"]]
//     );
//   })
//   .then(jlog, jerror);

// model.get(
//     ["usersById", users, ["firstName", "lastName", "username"]],
//     ["usersById", users, "sites", ["name", "externalId"]],
//     ["usersById", users, "role", ["name"]])
//   .then(jlog, jerror);

// var users = ["68106422-914e-44a7-9d3c-e49a8f2b16b5"];
// var sites = ["3151684b-45c7-444b-a3e9-0e927166671a"];
// model.get(
//     ["sitesById", sites, "usersById", users, "roles"])
//   .then(jlog, jerror);

// model
//   .get('users.length')
//   .then(function(resp){
//     // var limit = resp.json.users.length -1;
//     var limit = 1;
//     console.log(resp.json.users.length);
//     return model.get(
//         ["users", {from: 0, to: limit}, ["firstName", "lastName", "username"]],
//         ["users", {from: 0, to: limit}, "sites", ["name", "externalId"]],
//         ["users", {from: 0, to: limit}, "role", ["name"]]);
//   })
//   .then(jlog, jerror);

// model
//   .get('users.length')
//   .then(function(resp){
//     // var limit = resp.json.users.length -1;
//     var limit = 1;
//     console.log(resp.json.users.length);
//     return model.get(
//         ["users", {from: 0, to: limit}, ["firstName", "lastName", "username"]],
//         ["users", {from: 0, to: limit}, "userSites", ["name", "externalId"]],
//         ["users", {from: 0, to: limit}, "userSites", "roles", ["name"]]);
//   })
//   .then(jlog, jerror);

// model.get(
//     ["usersById", users, "sites", "length"], ["usersById", users, "sites", [0, 1],
//       ["name", "externalId"]
//     ]
//     // ["usersById", users, "userSites", "roles", ["name"] ]
//   )
//   .then(jlog, jerror);
//
// var users = ["25775660-48f4-4bbf-8eff-5fcb68455f03", "0e6c01f6-0ff3-4083-9961-d2d8dbead0f9"];
// // var sites = ["3151684b-45c7-444b-a3e9-0e927166671a", "7ee71aa1-2044-4a85-baa7-9ab70a7cc0ef"];
//
//
// function fillArrayWithNumbers(n) {
//   var arr = Array.apply(null, Array(n));
//   return arr.map(function(x, i) {
//     return i
//   });
// };

// var batchModel = model.batch(20);
// var foo = {};
//
// model.get(
//     ["usersById", users, "sites", "length"]
//   )
//   .then(function(res) {
//
//     Object.keys(res.json.usersById).forEach(function(key) {
//       var length = fillArrayWithNumbers(res.json.usersById[key].sites.length);
//       var pathset = ["usersById", key, "sites", length, ["name", "externalId"]];
//
//       batchModel.get(pathset).then(function(x) {
//         foo = $.extend(foo, x.json.usersById);
//
//         jlog(foo);
//       }, jerror);
//     });
//   });
// var batchModel = model.batch(20);
// var foo = {};
// var limit = 40;
// model
//   .get('users.length')
//   .then(function(resp){
//     // var limit = resp.json.users.length -1;
//
//     return model.get(
//         ["users", "length"],
//         ["users", {from: 0, to: limit}, ["id"]],
//         ["users", {from: 0, to: limit}, "sites", "length"]
//       );
//   })
//   .then(function(resp) {
//       // jlog(resp);
//
//       // var limit = resp.json.users.length -1;
//       Object.keys(resp.json.users).forEach(function(key) {
//         var length = fillArrayWithNumbers(resp.json.users[key].sites.length);
//         var id = resp.json.users[key].id;
//
//         batchModel.get(
//           ["users", {from: 0, to: limit}, ["firstName", "lastName", "username"]],
//           ["users", {from: 0, to: limit}, "sites", length, ["name", "externalId"]],
//           ["users", {from: 0, to: limit}, "role", ["name"]]
//         ).then(function(x) {
//           foo = $.extend(foo, x.json.users);
//
//           jlog(foo);
//         }, jerror);
//       });
//   }, jerror);

//
// model.get(
//     // ["users", {from: 0, to: 5}, [ "firstName", "lastName", "username"]],
//     ["users", {from: 0, to: 1}, "userSites", ["name", "externalId"]])
//     // ["users", {from: 0, to: 5}, "role", ["name"]])
//   .then(jlog, jerror);

// model.get('roles.length', 'roles[0]["id", "name"]').then(jlog, jerror);

// model.get('sitesById["5b55c990-f7f8-4227-8a29-4105a01e6c0f", "8579495b-5d81-4df5-9e49-795adf31ebc9"]["name", "externalId"]').then(jlog, jerror);

// model.get('sites.length', 'sites[0..2]["name", "externalId"]', 'users[0..2]["firstName", "lastName", "id"]').then(jlog, jerror);
