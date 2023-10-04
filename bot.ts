import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
import fs from "node:fs";
import path from "node:path";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
(client as Record<string, any>).command = new Collection();
const DISCORD_TOKEN =
  process.env.NODE_ENV === "production"
    ? process.env.DISCORD_TOKEN_PROD
    : process.env.DISCORD_TOKEN_DEV;

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command.default && "execute" in command.default) {
    (client as Record<string, any>)?.command?.set(
      command.default.data.name,
      command.default
    );
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// @ts-ignore
client.cooldowns = new Collection<string, number>();

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // @ts-ignore
  const command = interaction?.client?.command?.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  // @ts-ignore
  if (!client.cooldowns.has(command.data.name)) {
    // @ts-ignore
    client.cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  // @ts-ignore
  const timestamps = client.cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      await interaction.reply({
        content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
        ephemeral: true,
      });
      return;
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, (c) => {
  client.user.setPresence({
    status: "dnd",
    activities: [
      {
        name: `Helping ${client.guilds.cache.size} guilds prepare for Asmodan!`,
      },
    ],
  });
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(DISCORD_TOKEN);
