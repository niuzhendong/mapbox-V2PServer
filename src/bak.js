var options = {
  request: function(req, callback) {
    request(r, function (error, response, body) {
      console.log('url:'+r);
      if (!error && response.statusCode == 200) {
        // console.log('url:'+body);
        callback(error, { data:new Buffer.from(body,'utf8') });
      }else{
        callback(error, { data:new Buffer.from('') });
      }
    })
  },
  ratio: 1
};

var options = {
  request: function(req, callback) {
    request(r).pipe(fs.createWriteStream('vector.png',function (fileerr,data){
      callback(fileerr, { data: data });
    }))
  },
  ratio: 1
};

var options = {
  request: function(req, callback) {
    fs.readFile(path.join(__dirname, '', req.url), function(fileerr, data) {
      // console.log(data);
      callback(fileerr, { data: data });
    });
  },
  ratio: 1
};


var options = {
  request: function(req, callback) {
    urlrequest(r,{ 
      headers: {
        // 'Content-Type': 'application/x-protobuf',
        'responseType': 'arraybuffer'
      }
    }, function (error, response, vectorData) {
      console.log('url:'+r);
      console.log(response,Buffer.isBuffer(vectorData));
      if (!error && response.statusCode == 200) {
        callback(error, { data:new Buffer.from(vectorData) });
      }else{
        callback(error, { data:new Buffer.from('') });
      }
    })
  },
  ratio: 1
};


http.get(r,{}, function (res) {
  let bdata = [];
  res.on('data', (chunk) => { bdata.push(chunk) });
  res.on('end', () => {
    try {
      const parsedData = Buffer.concat(bdata);
      callback(true, { data: parsedData });
    } catch (e) {
      console.error(e.message);
    }
  });
})