import { SlashCommandBuilder, Message } from "discord.js";

export default {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  async execute(interaction: Message) {
    await interaction.reply("Pong!");
  },
};
