import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";

const commands: any = [];

const DISCORD_TOKEN =
  process.env.NODE_ENV === "production"
    ? process.env.DISCORD_TOKEN_PROD
    : process.env.DISCORD_TOKEN_DEV;
const DISCORD_CLIENT =
  process.env.NODE_ENV === "production"
    ? process.env.DISCORD_CLIENT_ID_PROD
    : process.env.DISCORD_CLIENT_ID_DEV;

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command.default && "execute" in command.default) {
    commands.push(command.default.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const rest = new REST().setToken(DISCORD_TOKEN);

export async function reloadCommands() {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(Routes.applicationCommands(DISCORD_CLIENT), {
      body: commands,
    });

    console.log(
      // @ts-ignore
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}

reloadCommands();
