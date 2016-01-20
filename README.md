# slackpop

Slack popularity analyzer using webtask.io

## What is this?

This project is divided in two parts: webhook and reader.

* The webhook receives messages information from a Slack Outgoing WebHook and saves the users mentioned in the message in a MongoDB database. In the database are saved the channel where the message was posted, the message text and the mentioned user.
* The reader retunrs as a JSON the users popularity from the MongoDB database. The popularity can be filtered by channel or by message age in days.

## Tools

* Node.js installed: https://nodejs.org/
* Webtask cli installed: https://webtask.io/docs/101
* Monga database created: https://mongolab.com/
* Slack team created: https://slack.com/

## Setup

1. Create the webhook in webtask:

	```wt create slackpop_hook.js --secret MONGO_URL=[YOUR-MONGODB-URL]```

1. Create an Outgoing WebHooks in Slack from a particular channel, setting the slackpop_hook URL in the URL field

1. Create the reader in webtask:

	```wt create slackpop_reader.js --secret MONGO_URL=[YOUR-MONGODB-URL] --secret SLACK_TOKEN=[YOUR-SLACK-READ-TOKEN]```
    
1. Start analyzing of your Slack popularity

## Reading popularity

1. All mentions:

	``` https://webtask.it.auth0.com/api/run/<yours>/slackpop_reader ```
	
1. Mentions in an specific channel:

	``` https://webtask.it.auth0.com/api/run/<yours>/slackpop_reader?channel=[CHANNEL-NAME] ```
	
1. Mentions for the last N-days:

	``` https://webtask.it.auth0.com/api/run/<yours>/slackpop_reader?lastdays=[N-DAYS] ```
	
1. Mentions for the last N-days in an specific channel:

	``` https://webtask.it.auth0.com/api/run/<yours>/slackpop_reader?channel=[CHANNEL-NAME]&lastdays=1=[N-DAYS] ```
