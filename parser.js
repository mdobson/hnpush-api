var parse = require("xml2js").parseString;

var xml = '<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><status feed="https://news.ycombinator.com/rss" xmlns="http://superfeedr.com/xmpp-pubsub-ext"><http code="200">Fetched (ping) 200 900 and parsed 1/30 entries</http><next_fetch>2013-10-12T20:45:19Z</next_fetch><entries_count_since_last_maintenance>81</entries_count_since_last_maintenance><period>900</period><last_fetch>2013-10-12T20:30:19Z</last_fetch><last_parse>2013-10-12T20:30:19Z</last_parse><last_maintenance_at>2013-10-11T20:28:25Z</last_maintenance_at></status><link title="Hacker News" rel="alternate" href="https://news.ycombinator.com/" type="text/html"/><title>Hacker News</title><updated></updated><id>https-news-ycombinator-com-</id><entry xmlns="http://www.w3.org/2005/Atom" xmlns:geo="http://www.georss.org/georss" xmlns:as="http://activitystrea.ms/spec/1.0/" xmlns:sf="http://superfeedr.com/xmpp-pubsub-ext"><id>http-www-livescience-com-9973-long-lived-salamanders-offer-clues-aging-html</id><published></published><updated></updated><title>Long-lived Salamanders Offer Clues to Aging</title><summary type="html">&lt;a href="https://news.ycombinator.com/item?id=6540034"&gt;Comments&lt;/a&gt;</summary><link title="Long-lived Salamanders Offer Clues to Aging" rel="alternate" href="http://www.livescience.com/9973-long-lived-salamanders-offer-clues-aging.html" type="text/html"/><link title="Long-lived Salamanders Offer Clues to Aging" rel="replies" href="https://news.ycombinator.com/item?id=6540034" type="text/html"/></entry></feed>';


module.exports = function parser(xmlStruct, cb) {
  parse(xml, function(err, result) {
    if(err) {
      console.log(err);
      cb(err);
    } else {
      console.log(result.feed.entry[0].link[0].$.title);
      console.log(result.feed.entry[0].link[0].$.href);
      var title = result.feed.entry[0].link[0].$.title;
      var link = result.feed.entry[0].link[0].$.href;
      cb(null, title, link);
    }
  });
}
