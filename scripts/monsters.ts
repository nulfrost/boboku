import { FlyffClient, MonsterObject } from "flyff.js";
import chunk from "lodash.chunk";

const client = new FlyffClient();

async function main() {
  const monsterIds = await client.monster.getAllIds();
  const chunkedIds = chunk(monsterIds, 1000);
  const monsters: MonsterObject[] = [];
  for (let i = 0; i < chunkedIds.length; i++) {
    const awaitedMonsters = await client.monster.getByListOfIds(chunkedIds[i]);
    monsters.push(...awaitedMonsters);
  }

  await Bun.write("./data/monsters.json", JSON.stringify(monsters));
}

main();
