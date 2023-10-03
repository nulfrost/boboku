import { FlyffClient, SkillObject } from "flyff.js";
import chunk from "lodash.chunk";

const client = new FlyffClient();

async function main() {
  const skillIds = await client.skill.getAllIds();
  const chunkedIds = chunk(skillIds, 1000);
  const skills: SkillObject[] = [];
  for (let i = 0; i < chunkedIds.length; i++) {
    const awaitedSkills = await client.skill.getByListOfIds(chunkedIds[i]);
    skills.push(...awaitedSkills);
  }

  await Bun.write("./data/skills.json", JSON.stringify(skills));
}

main();
