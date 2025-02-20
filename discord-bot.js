const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const levels = [
    "1 Diaphragmatic Support",
    "2 Open Throat",
    "3 Vocal Tract Shaping",
    "4 Build Head Voice",
    "5 Passaggio & Mixed Voice",
    "6 Glottal Compression",
    "7 Contiguous Phrase Singing",
    "8 Hyper Glottal Compression",
    "9 Master Sensei"
];

const commands = levels.map((level, index) => 
    new SlashCommandBuilder()
        .setName(`passlevel${index + 1}`)
        .setDescription(`Assigns the "${level}" role to a user.`)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to pass the level')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .toJSON()
);

// Add a remove level command
const removeCommand = new SlashCommandBuilder()
    .setName('removelevel')
    .setDescription('Removes a specified level role from a user.')
    .addIntegerOption(option =>
        option.setName('level')
            .setDescription('The level to remove (1-9)')
            .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to remove the level from')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON();

commands.push(removeCommand);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
