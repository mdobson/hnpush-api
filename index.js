var argo = require("argo"),
    router = require("argo-url-router"),
    url = require('url'),
    parser = require('./parser'),
    ug = require("usergrid");

var client = new ug.client({
  orgName:"mdobson",
  appName:"pushtome-dev"
});

/*
*  Function to send push notification to a specified path. Call directly.
*
*  @method sendPushToDevice
*  @public
*  @param {object} options
*  @param {function} callback
*  @return {callback} callback(err, data)
*/

ug.client.prototype.sendPushToDevice = function(options, callback) {
  if (options) {
    var notifierName = options.notifier;
    var notifierLookupOptions = {
      "type":"notifier",
      "name":options.notifier
    }
    var self = this;
    this.getEntity(notifierLookupOptions, function(error, result){
      if (error) {
        callback(error, result);
      } else {
        var pushEntity = {
          "type":options.path
        }
        if (result.get("provider") === "google") {
              pushEntity["payloads"] = {};
              pushEntity["payloads"][notifierName] = options.message;
        } else if (result.get("provider") === "apple") {
                   pushEntity["payloads"] = {}
                   pushEntity["payloads"][notifierName] = {
              "aps": {
                  "alert":options.message,
                  "sound":options.sound
              }
           }
        }
       var entityOptions = {
         client:self,
         data:pushEntity
       };
        var notification = new Usergrid.Entity(entityOptions);
        notification.save(callback);
      }
    });
  } else {
    callback(true);
  }
}



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
              parser(body, function(err, id, title, link) {
                var entity = {
                  type: "stories",
                  name: id,
                  title: title,
                  link: link
                };

                client.createEntity(entity, function(err, res){
                  if (err) {
                    env.response.statusCode = 500;
                    env.response.body = { "error": res };
                    next(env);
                  } else {
                    env.response.statusCode = 200;
                    next(env);
                    // var options = {
                    //   notifier:"YOUR NOTIFIER",
                    //   path:devicePath,
                    //   message:title,
                    //   sound:"chime"
                    // };
                    // client.sendPushToDevice(options, function(error, data){
                    //   if(error) {
                    //     env.response.statusCode = 500;
                    //     env.response.body = { "error": data };
                    //   } else {
                    //     env.response.statusCode = 204;
                    //     next(env);
                    //   }
                    // });
                  }
                });
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

