require('dotenv').config();
const Discord = require('discord.js');
const chalk = require('chalk');
const fs = require('node:fs');
const commands = [];

const commandFiles = fs.readdirSync(`./commands/interactions/`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/interactions/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new Discord.REST({ version: '10' }).setToken(process.env.Token);

(async () => {

    try {

        console.log(chalk.bold.yellowBright(`Started refreshing ${commands.length} application (/) commands.`));

        const data = await rest.put(
            Discord.Routes.applicationCommands(process.env.ClientID),
            { body: commands },
        );

        console.log(chalk.bold.greenBright(`Successfully reloaded ${data.length} application (/) commands.`));
        console.log(chalk.bold.redBright(`Note: if you didn't see slash commands in your server maybe your bot don't have "applicatiton.commands" scope try to invite it using this link\nhttps://discord.com/api/oauth2/authorize?client_id=${process.env.ClientID}&permissions=0&scope=bot%20applications.commands`))

    } catch (error) {
        console.error(chalk.bold.redBright(error));
    }

})();