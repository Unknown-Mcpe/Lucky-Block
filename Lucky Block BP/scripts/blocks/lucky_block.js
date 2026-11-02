import { BlockComponentBlockBreakEvent, BlockTypes, EntityTypes, GameMode, ItemStack, ItemTypes, Player, system } from "@minecraft/server";
import BlockIDs from "../data/BlockIDs";
class luckyblock {
    constructor(block) {
        this.block = block;
    }
    onBreak(e) {
        const { block, dimension, entitySource } = e;
        //   if (!entitySource || (entitySource as Player).getGameMode() === GameMode.Creative) return;
        this.spawn();
    }
    spawn() {
        // console.log(this.getRandomNum(10));
        let spawnCetagaris = [
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
        let spawnCatag = spawnCetagaris[Math.floor(Math.random() * 3)];
        if (!spawnCatag)
            return;
        let spawnTypeID = spawnCatag.data();
        let spawnType = spawnCatag.type;
        if (!spawnTypeID || this.bloclIds(spawnTypeID))
            return;
        if (spawnType === "BLock") {
            this.block.setType(spawnTypeID);
        }
        else if (spawnType === "Entity") {
            this.block.dimension.spawnEntity(spawnTypeID, this.block.location);
        }
        else if (spawnType === "Item") {
            this.block.dimension.spawnItem(new ItemStack(spawnTypeID), this.block.location);
        }
    }
    bloclIds(spawnTypeID) {
        if (BlockIDs.includes(spawnTypeID) ||
            spawnTypeID.startsWith("minecraft:element") ||
            spawnTypeID.startsWith("minecraft:light_block") ||
            spawnTypeID.includes("minecraft:hard_stained_glass_pane") ||
            spawnTypeID.includes("minecraft:hard_stained_glass"))
            return true;
        return false;
    }
    getEntityID() {
        var _a;
        let allEntityIDs = EntityTypes.getAll();
        let num = getRandomNum(allEntityIDs.length);
        return (_a = allEntityIDs[num]) === null || _a === void 0 ? void 0 : _a.id;
    }
    getItemID() {
        var _a;
        let allItemIDs = ItemTypes.getAll();
        let num = getRandomNum(allItemIDs.length);
        return (_a = allItemIDs[num]) === null || _a === void 0 ? void 0 : _a.id;
    }
    getBlockID() {
        var _a;
        let allBlockIDs = BlockTypes.getAll();
        let num = getRandomNum(allBlockIDs.length);
        return (_a = allBlockIDs[num]) === null || _a === void 0 ? void 0 : _a.id;
    }
}
function getRandomNum(max) {
    return Math.floor(Math.random() * max);
}
system.beforeEvents.startup.subscribe(function ({ blockComponentRegistry }) {
    blockComponentRegistry.registerCustomComponent("lucky_block:lucky_block", {
        onBreak: (e) => {
            new luckyblock(e.block).onBreak(e);
        }
    });
});
