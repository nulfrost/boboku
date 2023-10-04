import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { ItemObject } from "flyff.js";
import {
  buildBuffEmbed,
  buildGearEmbed,
  buildJewelryEmbed,
} from "../utils/index";
export default {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Get details about an item in FlyFF Universe")
    .addStringOption((option) =>
      option.setName("item").setDescription("Item name").setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const itemName = interaction.options.get("item");
    try {
      const file = Bun.file("./data/items.json");
      const contents: ItemObject[] = await file.json();
      const item = contents.find((item) =>
        item.name.en
          .toLowerCase()
          .includes(itemName.value.toString().toLowerCase())
      );

      let embed = new EmbedBuilder()
        .setTitle(item.name.en)
        .setAuthor({ name: `Category: ${item.category}` })
        .setThumbnail(`https://api.flyff.com/image/item/${item.icon}`)
        .setURL(`https://flyffipedia.com/items/details/${item.id}`)
        .setTimestamp(new Date())
        .setFooter({ text: `Item ID: ${item.id}` })
        .addFields([
          {
            name: "Level",
            value: String(item.level),
            inline: true,
          },
        ]);

      const hasAbilities = item?.abilities?.length > 0;

      if (item.description.en !== "null") {
        embed.setDescription(item.description.en);
      }

      if (item?.subcategory) {
        embed.addFields({
          name: "Subcategory",
          value: item.subcategory,
          inline: true,
        });
      }

      switch (item.category) {
        case "armor":
        case "weapon":
        case "fashion":
          embed.addFields(buildGearEmbed(item));
          break;
        case "jewelry":
          embed.addFields(buildJewelryEmbed(item));
          break;
        case "buff":
          embed.addFields(buildBuffEmbed(item));
        default:
          break;
      }

      if (hasAbilities) {
        embed.addFields({
          name: "Bonuses",
          value: `${item.abilities.map(
            (ability) =>
              `${ability.parameter.replace(",", "")}: ${
                !ability.rate ? "+" : ""
              }${ability.add}${ability.rate ? "%" : ""}\n`
          )}`.replace(/,/g, ""),
        });
      }

      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply(
        `There was an error finding: \`${itemName.value}\``
      );
    }
  },
};
