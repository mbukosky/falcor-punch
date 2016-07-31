'use strict';

var zipdir = require('zip-dir');

zipdir('./', {
  saveTo: './deploy.zip',
  filter: (path, stat) =>
    !/(?:\.zip)|(?:\.git)|(?:gulpfile\.js)|(?:zip\.js)|(?:main\.js)$/.test(path)
}, function(err, buffer) {
  if (err) {
    console.error(err);
  } else {
    console.log("Zip created!");
  }
});
