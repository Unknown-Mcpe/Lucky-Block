import { BlockComponentBlockBreakEvent, BlockTypes, EntityTypes, GameMode, ItemStack, ItemTypes, Player, system, type Block } from "@minecraft/server";
import BlockIDs from "../data/BlockIDs"

type SpawnType = "Entity" | "Item" | "BLock";

class luckyblock {
  
  protected block: Block;
  constructor(block: Block) {
    this.block = block;
  }

  public onBreak(e: BlockComponentBlockBreakEvent): void {
      const { block, dimension, entitySource } = e;

    //   if (!entitySource || (entitySource as Player).getGameMode() === GameMode.Creative) return;

      this.spawn()
    }
    
    private spawn(): void {

        // console.log(this.getRandomNum(10));
        
        
        let spawnCetagaris: {
            type: SpawnType
            data: (() => string | undefined)
        }[] = [
                {
                    data: this.getEntityID,
                type: "Entity"
            },
                {
                    data: this.getBlockID,
                type: "BLock"
            },
                {
                    data: this.getItemID,
                type: "Item"
            }
        ];

        let spawnCatag:
          | {
              type: SpawnType;
              data: () => string | undefined;
            }
          | undefined = spawnCetagaris[Math.floor(Math.random() * 3)];

        if (!spawnCatag) return;

        let spawnTypeID = spawnCatag.data();
        let spawnType = spawnCatag.type;

        if (!spawnTypeID || this.bloclIds(spawnTypeID)) return;

        if (spawnType === "BLock") {
            this.block.setType(spawnTypeID);
        } else if (spawnType === "Entity") {
            this.block.dimension.spawnEntity(spawnTypeID, this.block.location);
        } else if (spawnType === "Item") {
            this.block.dimension.spawnItem(new ItemStack(spawnTypeID), this.block.location);
        }
        
        
    }

    private bloclIds(spawnTypeID: string): boolean {
        if (
          BlockIDs.includes(spawnTypeID) ||
          spawnTypeID.startsWith("minecraft:element") ||
          spawnTypeID.startsWith("minecraft:light_block") ||
          spawnTypeID.includes("minecraft:hard_stained_glass_pane") ||
          spawnTypeID.includes("minecraft:hard_stained_glass")
        )
          return true;
        return false;
    }

    private getEntityID(): string | undefined {
        let allEntityIDs = EntityTypes.getAll();
        let num = getRandomNum(allEntityIDs.length)
        return allEntityIDs[num]?.id;
    } 

    private getItemID(): string | undefined {
        let allItemIDs = ItemTypes.getAll();
        let num = getRandomNum(allItemIDs.length);
        return allItemIDs[num]?.id;
    }

    private getBlockID(): string | undefined {
        let allBlockIDs = BlockTypes.getAll();
        let num = getRandomNum(allBlockIDs.length);
        return allBlockIDs[num]?.id;
    }

}

function getRandomNum(max: number): number {
  return Math.floor(Math.random() * max);
}

system.beforeEvents.startup.subscribe(function({blockComponentRegistry}) {
    blockComponentRegistry.registerCustomComponent("lucky_block:lucky_block", {

        onBreak: (e) => {
            new luckyblock(e.block).onBreak(e);
        }
    });
}) 
 