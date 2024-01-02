const { Client, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [3276799] });
const { token } = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async message => {
    if (message.content === '!tk') {
        const embed = new EmbedBuilder()
            .setTitle("Es un titulo")
            .setDescription("Ejemplo")
            .setColor("#3498db");

        const button = new ButtonBuilder()
            .setLabel("Create Ticket")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("ticket-button");

        const btn = new ActionRowBuilder().addComponents(button);

        message.reply({ content: "¿Desea agregar un ticket?", components: [btn], embeds: [embed] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'ticket-button') {
        
        const disabledButton = new ButtonBuilder()
            .setLabel("Create Ticket")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("ticket-button")
            .setDisabled(true);

        const disabledBtnRow = new ActionRowBuilder().addComponents(disabledButton);

        interaction.update({
            content: `Se ha agregado un ticket!`,
            components: [disabledBtnRow],
        });

        const name = `grupo-privado`;
        let historialChannel = await interaction.guild.channels.cache.find(channel => channel.name === name);

        if (!historialChannel) {
            const guild = interaction.guild;
            historialChannel = await guild.channels.create({
                name,
                type: ChannelType.GuildText
            });
        }
    }
});

client.login(token);