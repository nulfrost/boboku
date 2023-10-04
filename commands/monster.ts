import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { MonsterObject } from "flyff.js";
export default {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("monster")
    .setDescription("Get details about a monster in FlyFF Universe")
    .addStringOption((option) =>
      option.setName("monster").setDescription("Monster name").setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const monsterName = interaction.options.get("monster");
    try {
      const monsterFile = Bun.file("./data/monsters.json");
      const monsterContents: MonsterObject[] = await monsterFile.json();
      const monster = monsterContents.find((monster) =>
        monster.name.en
          .toLowerCase()
          .includes(monsterName.value.toString().toLowerCase())
      );

      let embed = new EmbedBuilder()
        .setTitle(monster.name.en)
        .setThumbnail(`https://api.flyff.com/image/monster/${monster.icon}`)
        .setURL(`https://flyffipedia.com/monster/details/${monster.id}`)
        .setTimestamp(new Date())
        .setFooter({ text: `Monster ID: ${monster.id}` })
        .setFields([
          {
            name: "Rank",
            value: monster.rank,
            inline: true,
          },
          {
            name: "Level",
            value: String(monster.level),
            inline: true,
          },
          {
            name: "Element",
            value: monster.element,
            inline: true,
          },
          {
            name: "Monster HP",
            value: new Intl.NumberFormat("en-US").format(monster.hp),
            inline: true,
          },
          {
            name: "Min. Attack",
            value: String(monster.minAttack),
            inline: true,
          },
          {
            name: "Max. Attack",
            value: String(monster.maxAttack),
            inline: true,
          },
          {
            name: "Defense",
            value: String(monster.defense),
            inline: true,
          },
          {
            name: "Magic Defense",
            value: String(monster.magicDefense),
            inline: true,
          },
          {
            name: "STR",
            value: String(monster.str),
            inline: true,
          },
          {
            name: "STA",
            value: String(monster.sta),
            inline: true,
          },
          {
            name: "DEX",
            value: String(monster.dex),
            inline: true,
          },
          {
            name: "INT",
            value: String(monster.int),
            inline: true,
          },
          {
            name: "Resists",
            value: `
                Fire: ${monster.resistFire}%
                Earth: ${monster.resistEarth}%
                Water: ${monster.resistWater}%
                Electricity: ${monster.resistElectricity}%
                Wind: ${monster.resistWind}%
            `,
            inline: true,
          },
        ]);

      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply(
        `There was an error finding: \`${monsterName.value}\``
      );
    }
  },
};
