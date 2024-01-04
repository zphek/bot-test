const { Client, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
const { token } = require('./config.json');
let ticketCreated = false;
let groupSID = [];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async message => {
    if (message.content === '!tk') {
        const embed = new EmbedBuilder()
            .setTitle("Es un titulo")
            .setDescription("Ejemplo")
            .setColor("#3498db");

        const createButton = new ButtonBuilder()
            .setLabel("Create Ticket")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("ticket-button");

        const createBtnRow = new ActionRowBuilder().addComponents(createButton);

        message.reply({ content: "¿Desea agregar un ticket?", components: [createBtnRow], embeds: [embed] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const createButton = new ButtonBuilder()
        .setLabel("Create Ticket")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("ticket-button");

    const deleteButton = new ButtonBuilder()
        .setLabel("Delete Ticket")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("delete-ticket");

    const deleteBtnRow = new ActionRowBuilder().addComponents(deleteButton);

    if (interaction.customId === 'ticket-button' && !ticketCreated) {
        
        const disabledButton = new ButtonBuilder()
            .setLabel("Create Ticket")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("ticket-button")
            .setDisabled(true);
        
        const disabledBtnRow = new ActionRowBuilder().addComponents(disabledButton);

        const name = `grupo-${interaction.user.username}`;

        const guild = interaction.guild;
        const adminRole = guild.roles.cache.get('1191785433802231921');
        
        const historialChannel = await guild.channels.create({
            name,
            type: ChannelType.GuildText,
            permissionOverwrites:[
                {                    
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: adminRole.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        });

        ticketCreated = true;

        interaction.reply({ content: "¿Desea eliminar el ticket?", components: [deleteBtnRow]});
        groupSID.push(historialChannel.id);
    }

    if (interaction.customId === 'delete-ticket') {
        const channelToDelete = interaction.guild.channels.cache.get(groupSID[groupSID.length - 1]);
        groupSID.pop();
        
        if (channelToDelete) {
            channelToDelete.delete();
            ticketCreated = false;
            interaction.reply({ content: "Ticket eliminado correctamente.", ephemeral: true });
        } else {
            interaction.reply({ content: "No se pudo encontrar el ticket para eliminar.", ephemeral: true });
        }
    }
});

client.login(token);
