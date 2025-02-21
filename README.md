# discord-bot-slash-command

### Create a Discord Bot:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).  

2. Click New Application and name your bot.  

3. Go to Bot in the sidebar and click Add Bot.  

4. Copy the Token and store it in your .env file:  
```
DISCORD_TOKEN=YOUR_BOT_TOKEN
```

5. Enable the following under "Privileged Gateway Intents":  
	- Server Members Intent
	- Message Content Intent (optional, but useful for other features)

### Invite the Bot to Your Server:

1. Go to OAuth2 > URL Generator in the Discord Developer Portal.
2. Under Scopes, select:
	- bot
	- applications.commands

3. Under Bot Permissions, check:
	- Manage Roles
	- Use Application Commands

4. Copy the generated URL and open it in your browser to invite the bot to your server.

### Install Dependencies:

Make sure you have Node.js installed. Then, in your project folder, run:

```
npm init -y
npm install discord.js dotenv
```

### Add Bot Token and IDs to .env:

- Create a .env file with:

```
DISCORD_TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=YOUR_BOT_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
```

- Replace:  
	- `YOUR_BOT_TOKEN` with your bot's token.
	- `YOUR_BOT_CLIENT_ID` with your bot's application ID.
	- `YOUR_GUILD_ID` with your server's ID.

### Run Locally:

First, register your slash commands:
```
node deploy-commands.js
```

Then, start the bot:
```
node index.js
```