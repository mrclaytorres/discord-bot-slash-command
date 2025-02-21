const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('passlevel1')
        .setDescription('Assigns the Level 1 role to a user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to assign the role to')
                .setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
            const role = interaction.guild.roles.cache.find(role => role.name === '1 Diaphragmatic Support');

            if (!role) {
                console.error('[ERROR] Role not found.');
                return await interaction.editReply('Role not found.');
            }

            await member.roles.add(role);
            await interaction.editReply('Role added successfully!');
        } catch (error) {
            console.error('[ERROR] Failed to add role:', error);
            await interaction.editReply('An error occurred while processing the command.');
        }
    }
};