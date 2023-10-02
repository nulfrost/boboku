import { FlyffClient, ItemObject } from "flyff.js";
import chunk from "lodash.chunk";

const client = new FlyffClient();

async function main() {
  const itemIds = await client.item.getAllIds();
  const chunkedIds = chunk(itemIds, 1000);
  const items: ItemObject[] = [];
  for (let i = 0; i < chunkedIds.length; i++) {
    const awaitedItems = await client.item.getByListOfIds(chunkedIds[i]);
    items.push(...awaitedItems);
  }

  await Bun.write("./data/items.json", JSON.stringify(items));
}

main();
