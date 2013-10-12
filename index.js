var argo = require("argo"),
    router = require("argo-url-router"),
    url = require('url'),
    parser = require('./parser');

argo()
  .use(router)
  .map('/subscribe', function(server) {
    server
      .post('/new', function(handle) {
        handle('request', function(env, next) {
          env.request.getBody(function(err, body) {
            if(err) {
              console.log("Error:"+err);
            } else {
              var body = body.toString();
              console.log(body);
              parser(body, function(err, title, link) {
                env.response.statusCode = 204;
                next(env);
              });
            }
          });
        });
      })
      .get('/new', function(handle) {
        handle('request', function(env, next) {
          var parsed = url.parse(env.request.url, true);
          console.log(parsed);
          env.response.body = parsed.query['hub.challenge'];
          env.response.statusCode = 200;
          next(env);
        });
      })
    })
    .listen(process.env.PORT || 3000);
    
