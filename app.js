const { Client, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
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

        const name = `grupo-${interaction.user.username}`;
            
        let historialChannel = await interaction.guild.channels.cache.find(channel => channel.name === name);
            
        if (!historialChannel) {
            const guild = interaction.guild;
            const adminRole = guild.roles.cache.get('1191785433802231921')
                
            //console.log(guild.roles.cache.map(role => `${role.name}: ${role.id}`).join('\n'));
                
            //if (!adminRole) throw new Error('El rol "admin" no se encontró.');
        
            //console.log(adminRole);

            historialChannel = await guild.channels.create({
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
            }
            
            interaction.message.edit({
                content: `Se ha agregado un ticket!`,
                components: [],
            });
    }
});

client.login(token);