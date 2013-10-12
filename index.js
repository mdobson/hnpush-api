var argo = require("argo"),
    router = require("argo-url-router"),
    url = require('url');

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
              console.log(body.toString());
            }
            env.response.statusCode = 204;
            next(env);
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

