// commands/passlevel.js
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const levels = require('../levels');
require('dotenv').config();

const ICON_BASE_URI = process.env.ICON_BASE_URI;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('passlevel')
        .setDescription('Assigns a level role to a user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to assign the role to')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('level')
                .setDescription('The level to assign')
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

            await member.roles.add(role);
            await interaction.editReply(`Role "${level}" added successfully!`);

            // Send Announcement
            const announcementChannelName = 'announcements'; // Set the announcement channel name here
            const announcementChannel = interaction.guild.channels.cache.find(
                channel => channel.name === announcementChannelName && channel.type === ChannelType.GuildText
            );

            // belt icon picker
            const beltEmojis = {
                '9 Master Sensei': '<:belt9:1382188154123190343>',
                '8 Hyper Glottal Compression': '<:belt8:1382188116646957198>',
                '7 Contiguous Phrase Singing': '<:belt7:1382188069532471420>',
                '6 Glottal Compression': '<:belt6:1382188032051908719>',
                '5 Passaggio & Mixed Voice': '<:belt5:1382187991304503336>',
                '4 Build Head Voice': '<:belt4:1382187944059736094>',
                '3 Vocal Tract Shaping': '<:belt3:1382187905166086295>',
                '2 Open Throat': '<:belt2:1382187862950412411>',
                '1 Diaphragmatic Support': '<:belt1:1382187715986198618>'
            };

            let icon = beltEmojis[role.name];

            if (announcementChannel) {
                announcementChannel.send(`🎉 Congratulations ${member}! You have passed ${icon} **${role}**!`);
            } else {
                console.error(`[ERROR] Announcement channel "${announcementChannelName}" not found.`);
            }

        } catch (error) {
            console.error('[ERROR] Failed to add role:', error);
            await interaction.editReply('❌ An error occurred while processing the command.');
        }
    }
};