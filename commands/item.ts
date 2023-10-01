import { SlashCommandBuilder, Message } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("See details about an item in FlyFF Universe"),
  async execute(interaction: Message) {
    await interaction.reply("Pong!");
  },
};
