var http = require('http');
var request = require('request')
var handlebars  = require('handlebars');

var View = `
<html>
  <head>
    <title>Slack pop</title>
  </head>
  <body>
	<h1>Popularity in Slack</h1>
    {{#if mentions.length}}
      <ul>
        {{#each mentions}}
          <li>{{user}}: {{mentions}}</li>
        {{/each}}
      </ul>
    {{else}}
      <h3>No mentions :(</h1>
    {{/if}}
  </body>
</html>
`;

http.createServer(function (req, res) {
	var getPop = function(cb){
		var slackpop_view_url = process.argv[2];
		request(slackpop_view_url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var info = JSON.parse(body);
				
				cb(info);
			}
		});
	};
		
	const template = handlebars.compile(View);
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	getPop(function(pop) {
		const view_ctx = { mentions: pop };
		res.write(template(view_ctx));
		res.end();
	});

}).listen(8888, '127.0.0.1');

console.log('Server running at http://127.0.0.1:8888');