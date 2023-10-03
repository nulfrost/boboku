import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { SkillObject } from "flyff.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skill")
    .setDescription("Get info about a skill in FlyFF Universe")
    .addStringOption((option) =>
      option.setName("skill").setDescription("Skill name").setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const skillName = interaction.options.get("skill");
    try {
      const file = Bun.file("./data/skills.json");
      const contents: SkillObject[] = await file.json();
      const skill = contents.find((skill) =>
        skill?.name?.en
          .toLowerCase()
          .includes(skillName.value.toString().toLowerCase())
      );

      const hasRequirements = skill?.requirements?.length > 0;
      const isMonsterSkill = skill.target === "currentplayer";

      let embed = new EmbedBuilder()
        .setTitle(skill.name.en)
        .setThumbnail(`https://api.flyff.com/image/skill/old/${skill.icon}`)
        .setURL(`https://flyffipedia.com/skills/details/${skill.id}`)
        .setTimestamp(new Date())
        .setFooter({ text: `Item ID: ${skill.id}` })
        .setDescription(skill.description.en)
        .addFields([
          {
            name: "Level",
            value: String(skill.level),
            inline: true,
          },
          {
            name: "Debuff",
            value: String(skill.debuff),
            inline: true,
          },
          {
            name: "Target",
            value: skill.target,
            inline: true,
          },
          {
            name: "Combo",
            value: skill.combo,
            inline: true,
          },
          {
            name: "Magic",
            value: String(skill.magic),
            inline: true,
          },
        ]);

      if (!isMonsterSkill) {
        embed.addFields([
          {
            name: "Skill Points Per Lvl",
            value: String(skill.skillPoints),
            inline: true,
          },
          {
            name: "Attributes at max Lvl",
            value: `
                     **Min. Attack:** ${skill.levels.at(-1).minAttack}\n
                     **Max. Attack:** ${skill.levels.at(-1).maxAttack}\n
                     **Cooldown:** ${
                       skill.levels.at(-1).cooldown
                         ? skill.levels.at(-1).cooldown + " seconds"
                         : "No cooldown."
                     }\n
                    `,
          },
        ]);
      }

      if (hasRequirements) {
        const requiredSkills = skill.requirements.map((skill) => {
          const skillName = contents.find((s) => s.id === skill.skill);
          return {
            name: skillName.name.en,
            level: skill.level,
          };
        });
        embed.addFields({
          name: "Required Skills",
          value: `${requiredSkills.map(
            (s) => `${s.name} - Lvl: ${s.level}\n`
          )}`.replace(/,/g, ""),
        });
      }
      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply(
        `There was an error finding: \`${skillName.value}\``
      );
    }
  },
};
