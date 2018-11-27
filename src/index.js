var urlrequest = require('request');
var url = require('url');
var mbgl = require('@mapbox/mapbox-gl-native');
var sharp = require('sharp');
var http = require("http");

http.createServer(function (allreq, allrep) {

  const urlObj = url.parse(allreq.url, true);
  var key = 'pk.eyJ1Ijoibml1emhlbmRvbmciLCJhIjoiY2poYTJpbGN2MDl5cjM2czA3cWl1em9rZiJ9.6Hn9S5Qe0b7cg4dkFtKRLw';
  var u = 'http://172.10.10.222:8080/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=cetc:back&STYLE=&TILEMATRIX=EPSG:4326:'+urlObj.query.z+'&TILEMATRIXSET=EPSG:4326&FORMAT=application/x-protobuf;type=mapbox-vector&TILECOL='+urlObj.query.x+'&TILEROW='+urlObj.query.y;
  var r = 'http://c.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/'+urlObj.query.z+'/'+urlObj.query.x+'/'+urlObj.query.y+'.vector.pbf?access_token=' + key;
  var l = 'http://172.10.10.223:7000/geoserver-dispatch.pbf';

  var options = {
    request: function(req, callback) {
      http.get(r,{ 
        headers: {
          'Content-Type': 'application/x-protobuf',
          'Content-Disposition': 'inline; filename=vector.pbf'
        }
      }, function (res) {
        let bdata = [];
        res.on('data', (chunk) => { bdata.push(Buffer.from(chunk,'ascii')) });
        res.on('end', () => {
          try {
            const parsedData = Buffer.concat(bdata);
            console.log(parsedData);
            callback(true, { data: parsedData });
          } catch (e) {
            console.error(e.message);
          }
        });
        // console.log('url:'+r);
        // console.log(response);
        // if (!error && response.statusCode == 200) {
        //   callback(error, { data: vectorData });
        // }else{
        //   callback(error, { data:new Buffer.from('') });
        // }
      })
    },
    ratio: 1
  };

  var map = new mbgl.Map(options);
  
  map.load(require('./style.json'));
  
  map.render({zoom: 0}, function(err, buffer) {
    if (err) throw err;

    map.release();

    var image = sharp(buffer, {
      raw: {
        width: 512,
        height: 512,
        channels: 4
      }
    });

    allrep.writeHead(200, {'Content-Type': 'image/png'});
    allrep.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    image.png().toBuffer().then(data => {
      allrep.end(data);
    })
  });
}).listen(3000);

// Console will print the message
console.log('Server running at http://127.0.0.1:3000/');