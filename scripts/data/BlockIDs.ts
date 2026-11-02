import { system } from "@minecraft/server";



const BlockIDs: string[] = [
  "minecraft:bedrock",
  "minecraft:barrier",
  "minecraft:structure_block",
  "minecraft:structure_void",
  "minecraft:jigsaw",
  "minecraft:hard_stained_glass",
  "minecraft:unknown",
  "minecraft:hard_stained_glass_pane",
  "minecraft:allow",
  "minecraft:deny",
  "minecraft:border_block",
  "minecraft:command_block",
  "minecraft:chain_command_block",
  "minecraft:repeating_command_block",
  "minecraft:light_block",
  "minecraft:invisible_bedrock",
  "minecraft:moving_block",
  "minecraft:piston_arm_collision",
  "minecraft:info_update",
  "minecraft:info_update2",
  "minecraft:update_block",
  "minecraft:update_game_block",
  "minecraft:reserved3",
  "minecraft:reserved6",
  "minecraft:netherreactor",
  "minecraft:glowingobsidian",
  "minecraft:ender_dragon",
  "minecraft:wither",
  "minecraft:npc",
  "minecraft:agent",
  "minecraft:ender_crystal",
  "minecraft:item",
  "minecraft:falling_block",
  "minecraft:command_block_minecart",
  "minecraft:dragon_fireball",
  "minecraft:wither_skull",
  "minecraft:debug_stick",
  "minecraft:knowledge_book",
  "minecraft:camera",
  "minecraft:portfolio",
  "minecraft:board",
  "minecraft:poster",
  "minecraft:slate",
  "minecraft:lab_table",
  "minecraft:compound_creator",
  "minecraft:element_constructor",
  "minecraft:material_reducer",
  "minecraft:chemistry_table",
  "minecraft:underwater_torch",
  "minecraft:underwater_tnt",
];

export default BlockIDs;


system.afterEvents.scriptEventReceive.subscribe(({id, message }) => {
  
  if (id !== "lucky_block:block_IDs") return;

  let data = JSON.parse(message) as string[] | string;

  if (!data || data.length === 0) return;

  if (Array.isArray(data)) BlockIDs.push(...data);
  else BlockIDs.push(data);

  console.log(`Lucky Block Addon Blocked ${Array.isArray(data) ? data.length : 1} IDs`);
  
})