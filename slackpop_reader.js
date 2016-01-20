var MongoClient = require('mongodb@2.0.48').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var request = require('request@2.56.0')

function userName(users, userid) {
	var user = users.members.filter(function(member) {
		return member.id == userid;
	});
	
	if(user.length) {
		return user[0].name;
	} else {
		return userid;
	}
}

function objIdFromDate(date) {
	return new ObjectID(Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000");
}

module.exports = function (ctx, done) {	
	var filter = {};
	if(ctx.data.channel){
		filter.channel = ctx.data.channel;
	}
	if(ctx.data.lastdays)
	{
		var someDate = new Date();
		someDate.setDate(someDate.getDate() - ctx.data.lastdays);
		
		oid = objIdFromDate(someDate);
		
		filter._id = { "$gt": oid };
	}
	
	var getUsers = function(cb){
		request('https://slack.com/api/users.list?token=' + ctx.data.SLACK_TOKEN, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var info = JSON.parse(body);
				
				if(info.ok) {
					cb(info);
				} else {
					return done(info.error);
				}
			}
		});
	},
	getMentions = function(cb) {
		MongoClient.connect(ctx.data.MONGO_URL, function (err, db) {
			if(!err) {			
				db.collection('mentions').aggregate([
						{ $match: filter },
						{ $group: { _id: "$user", total: { $sum: 1 } } },
						{ $sort: { total: -1 } }
				]).toArray(function(err, stats) {
					cb(stats);
				});
			}
			else {
				return done(err);
			}
		});
	};
	
	getUsers(function(users) {
		getMentions(function(mentions)
		{			
			var slackpop = [];
			
			mentions.forEach(function(mention) {
				var user = userName(users, mention._id);
				slackpop.push({ "user": user, "mentions": mention.total });
			});
			
			done(null, slackpop);
		});
	});
};