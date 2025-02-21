// commands/removelevel.js
const { SlashCommandBuilder } = require('discord.js');
const levels = require('../levels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removelevel')
        .setDescription('Removes a level role from a user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to remove the role from')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('level')
                .setDescription('The level to remove')
                .setRequired(true)
                .addChoices(...levels.map(level => ({ name: level, value: level })))),
    async execute(interaction) {

      //Role check
      const member = interaction.member;
      const allowedRoles = ['Owner', 'Staff'];

      // Check if the member has at least one of the allowed roles
      const hasAllowedRole = member.roles.cache.some(role => allowedRoles.includes(role.name));
      if (!hasAllowedRole) {
          return await interaction.reply({
            content: '❌ You do not have permission to use this command.',
            epemeral: true
          });
      }
        try {
            await interaction.deferReply({ ephemeral: true });

            const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
            const level = interaction.options.getString('level');
            const role = interaction.guild.roles.cache.find(role => role.name === level);

            if (!role) {
                console.error('[ERROR] Role not found:', level);
                return await interaction.editReply('Role not found.');
            }

            await member.roles.remove(role);
            await interaction.editReply(`Role "${level}" removed successfully!`);
        } catch (error) {
            console.error('[ERROR] Failed to remove role:', error);
            await interaction.editReply('An error occurred while processing the command.');
        }
    }
};