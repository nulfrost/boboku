import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { ItemObject } from "flyff.js";
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
    const contents = await file.json();
    const item: ItemObject = contents.find((item) =>
      item.name.en
        .toLowerCase()
        .includes(itemName.value.toString().toLowerCase())
    );

    const isArmor = Boolean(item.minDefense);
    const isWeapon = Boolean(item.minAttack);
    const timeStamp = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date());

    const embed = new EmbedBuilder()
      .setTitle(item.name.en)
      .setThumbnail(`https://api.flyff.com/image/item/${item.icon}`)
      .setFields([
        {
          name: "Level",
          value: String(item.level),
          inline: true,
        },
        {
          name: "Subcategory",
          value: item.subcategory,
          inline: true,
        },
        {
          name: "Rarity",
          value: item.rarity,
          inline: true,
        },
        {
          name: "Premium",
          value: String(item.premium),
          inline: true,
        },

        ...(isWeapon
          ? [
              {
                name: "Min. Attack",
                value: String(item.minAttack),
                inline: true,
              },
              {
                name: "Max. Attack",
                value: String(item.maxAttack),
                inline: true,
              },
            ]
          : []),
        ...(isArmor
          ? [
              {
                name: "Min. Defense",
                value: String(item.minDefense),
                inline: true,
              },
              {
                name: "Max. Defense",
                value: String(item.maxDefense),
                inline: true,
              },
            ]
          : []),
      ])
      .setURL(`https://flyffipedia.com/items/details/${item.id}`)
      .setTimestamp(new Date());

    await interaction.reply({ embeds: [embed] });
  },
};
