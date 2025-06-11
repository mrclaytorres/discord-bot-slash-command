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
            let icon = '';
            switch (role) {
                case '9 Master Sensei':
                    icon = `${ICON_BASE_URI}/9-a.png`
                    break;
                case '8 Hyper Glottal Compression':
                    icon = `${ICON_BASE_URI}/8.png`
                    break;
                case '7 Contiguous Phrase Singing':
                    icon = `${ICON_BASE_URI}/7.png`
                    break;
                case '6 Glottal Compression':
                    icon = `${ICON_BASE_URI}/6.png`
                    break;
                case '5 Passaggio & Mixed Voice':
                    icon = `${ICON_BASE_URI}/5.png`
                    break;
                case '4 Build Head Voice':
                    icon = `${ICON_BASE_URI}/4.png`
                    break;
                case '3 Vocal Tract Shaping':
                    icon = `${ICON_BASE_URI}/3.png`
                    break;
                case '2 Open Throat':
                    icon = `${ICON_BASE_URI}/2.png`
                    break;
                default:
                    icon = `${ICON_BASE_URI}/1.png`
                    break;
            }

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