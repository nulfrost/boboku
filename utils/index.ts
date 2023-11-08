import { ItemObject } from "flyff.js";

export function buildGearEmbed(item: ItemObject) {
  const isArmor = Boolean(item.minDefense);
  const isWeapon = Boolean(item.minAttack);
  const isFashion = item?.category === "fashion";

  return [
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
          {
            name: "Sex",
            value: item.sex ? item.sex : "Gender does not apply to this item",
            inline: true,
          },
        ]
      : []),
    ...(isFashion
      ? [
          {
            name: "Sex",
            value: item.sex,
            inline: true,
          },
        ]
      : []),
  ];
}

export function buildJewelryEmbed(item: ItemObject) {
  const hasUpgradeLevels =
    item.upgradeLevels &&
    item.upgradeLevels.length > 0 &&
    item.upgradeLevels.length <= 6;

  return [
    {
      name: "Level",
      value: String(item.level),
      inline: true,
    },
    {
      name: "Subcategory",
      value: String(item.subcategory),
      inline: true,
    },
    {
      name: "Rarity",
      value: item.rarity,
      inline: true,
    },
    ...(hasUpgradeLevels
      ? item.upgradeLevels.map((upgradeLevel) => ({
          name: `Upgrade Level ${upgradeLevel.upgradeLevel}`,
          value: `
        **Required Level**: ${upgradeLevel.requiredLevel}
        **Abilities**: ${upgradeLevel.abilities.map(
          (ability) => `**${ability.parameter}**: ${!ability.rate ? "+" : ""}${
            ability.add
          }${!ability.rate ? "" : "%"}
    `
        )}`.replace(/,/g, ""),
        }))
      : []),
  ];
}

export function buildBuffEmbed(item: ItemObject) {
  return [
    {
      name: "Subcategory",
      value: String(item.subcategory),
      inline: true,
    },
    {
      name: "Premium",
      value: String(item.premium),
      inline: true,
    },
  ];
}
