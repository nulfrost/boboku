import { EquipSetObject, FlyffClient } from "flyff.js";
import chunk from "lodash.chunk";

const client = new FlyffClient();

async function main() {
  const equipSetIds = await client.equip.getAllIds();
  const chunkedIds = chunk(equipSetIds, 1000);
  const equipSets: EquipSetObject[] = [];
  for (let i = 0; i < chunkedIds.length; i++) {
    const awaitedItems = await client.equip.getByListOfIds(chunkedIds[i]);
    equipSets.push(...awaitedItems);
  }

  await Bun.write("./data/equipset.json", JSON.stringify(equipSets));
}

main();
