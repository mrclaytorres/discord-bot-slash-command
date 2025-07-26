const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Required for slash commands
    GatewayIntentBits.GuildMembers, // Required for managing roles
    GatewayIntentBits.DirectMessages, // REQUIRED for sending DMs
  ],
});

const GUILD_ID = process.env.GUILD_ID;
const ROLE_ID = process.env.ROLE_ID;
const SPECIFIC_INVITE_CODE = process.env.SPECIFIC_INVITE_CODE;

let invites = new Map();

client.commands = new Collection();

// Load all commands from the commands folder
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Cache Invites
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.log("Guild not found!");

  try {
    const inviteList = await guild.invites.fetch();
    invites = new Map(inviteList.map((invite) => [invite.code, invite.uses]));
    console.log("Cached invites.");
  } catch (err) {
    console.error("Error fetching invites:", err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error("[ERROR] Command failed:", error);
    await interaction.reply({
      content: "There was an error executing this command.",
      ephemeral: true,
    });
  }
});

// Add a role to users invited in the performance channel
client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== GUILD_ID) return;

  // --- DM Sending Logic (First Step) ---
  // Check if the member is a bot to avoid DMing other bots
  if (member.user.bot) {
    console.log(`Bot ${member.user.tag} joined. Skipping welcome DM.`);
    return;
  }

  console.log(
    `New member joined: ${member.user.tag} (ID: ${member.user.id}) in guild: ${member.guild.name}`
  );

  try {
    // Create a DM channel with the new member
    const dmChannel = await member.createDM();
    console.log(`DM channel created with ${member.user.tag}.`);

    // The welcome message with the link to your specific new member OAuth2 endpoint
    const welcomeMessage = `Hello ${member.user.username}! Welcome to the KTVA server!

    To get started and unlock full access, please click the link below to connect your account and get your exclusive roles:
    ${NEW_MEMBER_REDIRECT_URI}

    We're excited to have you! If you have any questions, feel free to ask in the server.`;

    await dmChannel.send(welcomeMessage);

    console.log(`Welcome DM sent to ${member.user.tag}.`);
  } catch (error) {
    console.error(
      `Failed to send welcome DM to ${member.user.tag}:`,
      error.response?.data || error.message
    );
    // Common reasons for failure:
    // 1. User has DMs disabled for server members (Privacy Settings).
    // 2. Rate limits from Discord API.
  }
  // --- End DM Sending Logic ---

  // --- Existing Invite Tracking and Role Assignment Logic ---
  try {
    const newInvites = await member.guild.invites.fetch();

    const usedInvite = [...newInvites.values()].find(
      (invite) =>
        invites.has(invite.code) && invites.get(invite.code) < invite.uses
    );

    if (usedInvite && usedInvite.code === SPECIFIC_INVITE_CODE) {
      const role = member.guild.roles.cache.get(ROLE_ID);
      if (role) {
        await member.roles.add(role);
        console.log(
          `Assigned role ${role.name} to ${member.user.tag} (Joined via invite: ${usedInvite.code})`
        );
      }
    }

    // Update the invite cache
    invites = new Map(newInvites.map((invite) => [invite.code, invite.uses]));
  } catch (err) {
    console.error("Error checking invites:", err);
  }
});

// Log in to Discord with your app's token
if (process.env.DISCORD_TOKEN) {
  client
    .login(process.env.DISCORD_TOKEN)
    .catch((error) => console.error("Failed to log in Discord Bot:", error));
} else {
  console.error(
    "DISCORD_TOKEN is not set in your environment variables. Bot cannot log in."
  );
}

// Handle unhandled promise rejections to prevent Node.js process from crashing
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});
