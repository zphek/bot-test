const { Client, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType } = require('discord.js');
const client = new Client({ intents: [3276799] });

let ticketCount = 0;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async message => {
  if (message.content === '!tk') {
    const button = new ButtonBuilder()
      .setLabel("Add ticket")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("ticket-button");

    const btn = new ActionRowBuilder().addComponents(button);

    message.reply({content: "¿Desea agregar un ticket?", components: [btn]});
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'ticket-button') {
    ticketCount++;
    interaction.reply(`Se ha agregado un ticket! ${ticketCount}`);

    let name = `historial-tickets-${new Date().getDate().toLocaleString()}`;
    let historialChannel = interaction.guild.channels.cache.find(channel => channel.name === name);

    if (!historialChannel) {
      const guild = interaction.guild;
      historialChannel = await guild.channels.create({
        name,
        type: ChannelType.GuildText
      });
    }
    historialChannel.send(`Nuevo ticket creado por ${interaction.user.tag}. Ticket: ${ticketCount}`);
  }
});

const TOKEN = '';
client.login(TOKEN);
