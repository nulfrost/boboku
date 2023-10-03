import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { ItemObject, MonsterObject } from "flyff.js";
export default {
  data: new SlashCommandBuilder()
    .setName("drops")
    .setDescription("Find out which monsters drop an item")
    .addStringOption((option) =>
      option.setName("item").setDescription("Item name").setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const itemName = interaction.options.get("item");
    try {
      const itemFile = Bun.file("./data/items.json");
      const itemContents: ItemObject[] = await itemFile.json();
      const item = itemContents.find((item) =>
        item.name.en
          .toLowerCase()
          .includes(itemName.value.toString().toLowerCase())
      );

      const monsterFile = Bun.file("./data/monsters.json");
      const monsterContents: MonsterObject[] = await monsterFile.json();
      let monstersThatDropItem = [];
      let monsterDropList;

      for (const monster of monsterContents) {
        monsterDropList = monster.drops.filter((i) => i.item === item.id);
        if (monsterDropList.length > 0) {
          monstersThatDropItem.push(monster.name.en);
        }
      }

      if (monstersThatDropItem.length === 0) {
        await interaction.reply(`\`${item.name.en}\` is not a droppable item!`);
        return;
      }

      let embed = new EmbedBuilder()
        .setTitle(item.name.en)
        .setThumbnail(`https://api.flyff.com/image/item/${item.icon}`)
        .setURL(`https://flyffipedia.com/items/details/${item.id}`)
        .setTimestamp(new Date())
        .setFooter({ text: `Item ID: ${item.id}` })
        .addFields([
          {
            name: `Monsters that drop ${item.name.en}`,
            value: `${monstersThatDropItem.map(
              (monster) => `${monster}\n`
            )}`.replace(/,/g, ""),
            inline: true,
          },
        ]);

      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply(
        `There was an error finding: \`${itemName.value}\``
      );
    }
  },
};
