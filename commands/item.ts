import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { ItemObject } from "flyff.js";
import { buildGearEmbed, buildJewelryEmbed } from "../utils/index";
export default {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Get details about an item in FlyFF Universe")
    .addStringOption((option) =>
      option.setName("item").setDescription("Item name").setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const itemName = interaction.options.get("item");
    const file = Bun.file("./data/items.json");
    const contents: ItemObject[] = await file.json();
    const item = contents.find((item) =>
      item.name.en
        .toLowerCase()
        .includes(itemName.value.toString().toLowerCase())
    );

    console.log(item);

    let embed = new EmbedBuilder()
      .setTitle(item.name.en)
      .setAuthor({ name: `Category: ${item.category}` })
      .setThumbnail(`https://api.flyff.com/image/item/${item.icon}`)
      .setURL(`https://flyffipedia.com/items/details/${item.id}`)
      .setTimestamp(new Date())
      .setFooter({ text: `Item ID: ${item.id}` })
      .setFields({
        name: "Subcategory",
        value: item.subcategory,
        inline: true,
      });

    switch (item.category) {
      case "armor":
      case "weapon":
      case "fashion":
        embed.setFields(buildGearEmbed(item));
        break;
      case "jewelry":
        embed.setFields(buildJewelryEmbed(item));
        break;
      default:
        break;
    }

    await interaction.reply({ embeds: [embed] });
  },
};
