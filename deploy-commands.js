// deploy-commands.js
const fs = require('fs');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('[INFO] Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('[INFO] Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('[ERROR] Failed to deploy commands:', error);
    }
})();