import {
  Dimension,
  EntityComponentTypes,
  ItemComponentUseEvent,
  ItemStack,
  ItemTypes,
  Player,
  system,
} from "@minecraft/server";
import { LootBagBanItemIds, LootbagData } from "../data/lootbag";

type LootBagType = "basic" | "ultimate";
interface blockParam {
  type: LootBagType;
}

class lootbag {
  constructor(
    private item: ItemStack,
    private data: blockParam,
  ) {}

  public onUse(event: ItemComponentUseEvent): void {
    this.removeItem(1, event.source as Player);
    this.dropLoot(event.source as Player);
  }

  private removeItem(amount = 1, player: Player): void {
      let inv = player.getComponent(EntityComponentTypes.Inventory)?.container;
      if (!inv) return;
      let slot = inv.getSlot(player.selectedSlotIndex);
      if (!slot.hasItem()) return;

      if (slot.amount === 1) {
          slot.setItem(undefined);
      } else {
          --slot.amount;
          slot.setItem(slot.getItem());
      }
  }

  private dropLoot(player: Player): ItemStack[] | undefined {
    try {
      const loot: ItemStack[] = this.getLootItem(this.data.type);
      const { x, y, z } = player.getHeadLocation();
      const vPos = player.getViewDirection();
      const distance = 3;
      for (let item of loot) {
        player.dimension.spawnItem(item, {
          x: x + vPos.x * distance,
          y: y + vPos.y * distance,
          z: z + vPos.z * distance,
        });
      }
      return loot;
    } catch (e) {}
  }

  private getLootItem(type: LootBagType): ItemStack[] {
    let lootItemIds: string[];
    if (type === "ultimate") {
      lootItemIds = ItemTypes.getAll().map((e) => e.id);
    } else {
      lootItemIds = LootbagData[type];
    }
    let rItemTypeNum = Math.floor(Math.random() * 3) + 1;
    let items: ItemStack[] = [];

    while (rItemTypeNum > items.length) {
      let randomNum = Math.floor(Math.random() * lootItemIds.length);
      let itemId = lootItemIds[randomNum]!;
      if (!ItemTypes.get(itemId) || LootBagBanItemIds.includes(itemId))
        continue;

      let itemAmount: number =
        type === "ultimate"
          ? Math.floor(Math.random() * 5) + 1
          : Math.floor(Math.random() * 3) + 1;
      items.push(new ItemStack(itemId, itemAmount));
    }
    return items;
  }
}

system.beforeEvents.startup.subscribe(({itemComponentRegistry}) => {
     itemComponentRegistry.registerCustomComponent("um:lootbag", {
  onUse: (e, p) => {
    const { itemStack: item } = e;

    if (!item) return;

    let itemClass = new lootbag(item, p.params as blockParam);
    itemClass.onUse(e);
  },
});
});

