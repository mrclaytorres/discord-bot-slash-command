const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,         // Required for slash commands
        GatewayIntentBits.GuildMembers    // Required for managing roles
    ]
});

client.commands = new Collection();

// Load all commands from the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('[ERROR] Command failed:', error);
        await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
});

// Log in to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);