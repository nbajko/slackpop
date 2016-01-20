var MongoClient = require('mongodb').MongoClient;

module.exports = function (ctx, done) 
{
	var channel = ctx.data.channel_name;
	var message = ctx.data.text;
	
	var regex = /<@(.*?)>/g;
	var match;
	
	var metions = [];
	
	do {
		match = regex.exec(message);
		if (match) {
			metions.push({ channel: channel, message: message, user: match[1] });
		}
	} while (match)
	
	if(metions.length)
	{
		MongoClient.connect(ctx.data.MONGO_URL, function (err, db) {
			if(err) return done(err);
			
			var bulk = db.collection('mentions').initializeUnorderedBulkOp();
			metions.map(function (mention) {
				bulk.insert(mention);
			});
			bulk.execute();
		});
		
		done(null, metions);
	}
	
	done(null, metions);
}