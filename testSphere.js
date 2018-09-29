function fibonacciSphere(samples = 1, randomise = true) {
  var rnd = 1;
  var points = [];
  var offset = 2 / samples;
  var increment = Math.PI * (3 - Math.sqrt(5));

  [...Array(samples).keys()].forEach(function(i) {
    if (randomise) {
      rnd = Math.random() * samples / 10000;
    }

    var y = ((i * offset) - 1) + (offset / 2);
    var r = Math.sqrt(1 - Math.pow(y, 2));

    var phi = ((i + rnd) % samples) * increment;

    var x = Math.cos(phi) * r;
    var z = Math.sin(phi) * r;

    points.push([x, y, z])
  });
  return points;
}

function getHull() {
  var qh = require('quickhull3d')
  var samples = 100000;

  var points = fibonacciSphere(samples);

  return {
    points: points,
    faces: qh(points),
    waterPoints: [...Array(samples/10).keys()]
  };
}

var path = require('path');
var express = require('express');
var reload = require('reload')
var app = express();
var port = 3000;

app.get('/data.json', function(req, res) {
  res.send(getHull());
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/static', express.static('static'));

reload(app);
app.listen(port, () => console.log('Ready to send hulls on port ' + port));
