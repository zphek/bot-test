const { Client, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
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
  
    const everyone = interaction.guild.roles.cache.find((rol) => rol.name == "@every")
    if (interaction.customId === 'ticket-button') {
      ticketCount++;
      interaction.reply(`Se ha agregado un ticket! ${ticketCount}`);
    }
  });
  

const TOKEN = 'MTAzMzA1MTAxNTExMDQ4MDAyNA.GHUih6.aJBUPjK3v63IgKvZOgJ_l_kN9zgIAmK-n4Q9go';
client.login(TOKEN);