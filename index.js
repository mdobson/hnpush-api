var argo = require("argo"),
    router = require("argo-url-router");

argo()
  .use(router)
  .map('/subscribe' function(server) {
    server
      .post('/new', function(handle) {
        handle('request', function(env, next) {
          env.request.getBody(function(err, body) {
            if(err) {
              console.log("Error:"+err);
            } else {
              var obj = JSON.parse(body);
              console.log(JSON.stringify(obj, undefined, 2));
            }
            env.response.statusCode = 204;
            next(env);
          });
        });
      });
    })
    .listen(process.env.PORT || 3000);

