// Import required modules and constants
import request from "../../../requestV2";
import settings from "../../settings";
import { LOGO, RED } from "../../utils/constants";
import { getPlayerUUID } from "../../utils/player";
import { delay } from "../../utils/thread";
import { data } from "../../utils/variables";


// Variable to store the player's bestiary data, initially set to undefined.
let bestiaryApi = undefined;

/**
 * Makes a PULL request to get bestiary data from the player's info using the Hypixel API.
 */
export function updateBestiary() {
    // Make an API request to Hypixel API to get the player's bestiary data from their profile.
    // dbf3c137-8778-4cce-8ad1-1b0193a5d3eb
    request({
        url: `https://api.hypixel.net/skyblock/profile?key=${settings.apiKey}&profile=${data.profileId}`,
        json: true
    }).then((response) => {
        // Update the 'bestiary' variable with the bestiary data from the API response.
        bestiaryApi = response.profile.members[getPlayerUUID()].bestiary.kills;
    }).catch((error) => {
        // If there is an error, display the error message in the Minecraft chat.
        ChatLib.chat(`${LOGO} ${RED}${error}`);
    });
}
updateBestiary();

const killBrackets = [
    [20, 40, 60, 100, 200, 400, 800, 1400, 2000, 3000, 6000, 12000, 20000, 30000, 40000, 50000, 60000, 72000, 86000, 100000, 200000, 400000, 600000, 800000, 1000000],
    [5, 10, 15, 25, 50, 100, 200, 350, 500, 750, 1500, 3000, 5000, 7500, 10000, 12500, 15000, 18000, 21500, 25000, 50000, 100000, 150000, 200000, 250000],
    [4, 8, 12, 16, 20, 40, 80, 140, 200, 300, 600, 1200, 2000, 3000, 4000, 5000, 6000, 7200, 8600, 10000, 20000, 40000, 60000, 80000, 100000],
    [2, 4, 6, 10, 15, 20, 25, 35, 50, 75, 150, 300, 500, 750, 1000, 1350, 1650, 2000, 2500, 3000, 5000, 10000, 15000, 20000, 25000],
    [1, 2, 3, 5, 7, 10, 20, 25, 30, 60, 120, 200, 300, 400, 500, 600, 720, 860, 1000, 2000, 4000, 6000, 8000, 10000],
    [1, 2, 3, 5, 7, 9, 14, 17, 21, 25, 50, 80, 125, 175, 250, 325, 425, 525, 625, 750, 1500, 3000, 4500, 6000, 7500],
    [1, 2, 3, 5, 7, 9, 11, 14, 17, 20, 30, 40, 55, 75, 100, 150, 200, 275, 375, 500, 1000, 1500, 2000, 2500, 3000]
];

class Mob {
    constructor(names, levels, bracket, maxLevel) {
        this.names = names;
        this.levels = levels;
        this.bracket = killBrackets[bracket - 1];
        this.maxLevel = maxLevel - 1;
        this.level = 0;
        this.kills = 0;
        this.next = 0;
    }

    updateKills() {
        this.names.forEach(name => {
            this.levels.forEach(level => {
                let kills = bestiaryApi[`${name}_${level}`] || 0;
                this.kills += kills;
            });
        });

        for (let i = this.bracket.length - 1; i >= 0; i--) {
            if (this.kills > this.bracket[i]) {
                this.level = i;
                break;
            }
        }
        this.next = Math.max(this.bracket[Math.min(this.level + 1, this.maxLevel - 1)] - this.kills, 0);

        return this.next == 0;
    }
}

/**
 * Variable used to store and display player bestiary values using API.
 * "Mob Name": [[entities], [levels], bracket, max level, player kills]
 */
const bestiary = {
    // Your Island
    "Creeper": new Mob(["creeper"], [1], 1, 5),
    "Enderman": new Mob(["enderman"], [1, 15], 1, 5),
    "Skeleton": new Mob(["skeleton"], [1, 15], 1, 5),
    "Slime": new Mob(["slime"], [1], 1, 5),
    "Spider": new Mob(["spider"], [1, 15], 1, 5),
    "Witch": new Mob(["witch"], [1, 15], 1, 5),
    "Zombie": new Mob(["zombie"], [1, 15], 1, 5),
    // Hub
    "Crypt Ghoul": new Mob(["unburried_zombie"], [30], 1, 15),
    "Golden Ghoul": new Mob(["unburried_zombie"], [60], 3, 15),
    "Graveyard Zombie": new Mob(["graveyard_zombie"], [1], 1, 5),
    "Old Wolf": new Mob(["old_wolf"], [50], 3, 15),
    "Wolf": new Mob(["ruin_wolf"], [15], 1, 15),
    "Zombie Villager": new Mob(["zombie_villager"], [1], 4, 15),
    // The Farming Islands
    "Chicken": new Mob(["farming_chicken"], [1], 1, 5),
    "Cow": new Mob(["farming_cow"], [1], 1, 5),
    "Mushroom Cow": new Mob(["mushroom_cow"], [1], 1, 5),
    "Pig": new Mob(["farming_pig"], [1], 1, 5),
    "Rabbit": new Mob(["farming_rabbit"], [1], 1, 5),
    "Sheep": new Mob(["farming_sheep"], [1], 1, 5),
    // Spider's Den
    "Arachne": new Mob(["arachne"], [300, 500], 7, 20),
    "Arachne's Brood": new Mob(["arachne_brood"], [100, 200], 4, 15),
    "Arachne's Keeper": new Mob(["arachne_keeper"], [100], 5, 15),
    "Brood Mother": new Mob(["brood_mother_spider"], [12], 5, 15),
    "Dasher Spider": new Mob(["dasher_spider"], [4, 42, 45, 50], 2, 15),
    "Gravel Skeleton": new Mob(["respawning_skeleton"], [2], 3, 15),
    "Rain Slime": new Mob(["random_slime"], [8], 4, 15),
    "Silverfish": new Mob(["jockey_shot_silverfish", "splitter_spider_silverfish"], [2, 3, 42, 45, 50], 1, 15),
    "Spider Jockey": new Mob(["spider_jockey"], [3, 42], 2, 15),
    "Splitter Spider": new Mob(["splitter_spider"], [4, 42, 45, 50], 2, 15),
    "Voracious Spider": new Mob(["voracious_spider"], [10, 42, 45, 50], 1, 15),
    "Weaver Spider": new Mob(["weaver_spider"], [3, 42, 45, 50], 2, 15),
    // The End
    "Dragon": new Mob(["unstable_dragon", "strong_dragon", "superior_dragon", "wise_dragon", "young_dragon", "old_dragon", "protector_dragon"], [100], 5, 20),
    "Enderman": new Mob(["enderman"], [42, 45, 50], 4, 25),
    "Endermite": new Mob(["endermite", "nest_endermite"], [37, 40, 50], 5, 25),
    "Endstone Protector": new Mob(["corrupted_protector"], [100], 7, 20),
    "Obsidian Defender": new Mob(["obsidian_wither"], [55], 4, 25),
    "Voidling Extremist": new Mob(["voidling_extremist"], [100], 3, 15),
    "Voidling Fanatic": new Mob(["voidling_fanatic"], [85], 4, 25),
    "Watcher": new Mob(["watcher"], [55], 4, 25),
    "Zealot": new Mob(["zealot_enderman", "zealot_bruiser"], [55, 100], 3, 25),
    // Crimson Isle
    "Ashfang": new Mob(["ashfang"], [200], 5, 20),
    "Barbarian Duke X": new Mob(["barbarian_duke_x"], [200], 5, 20),
    "Bladesoul": new Mob(["bladesoul"], [200], 5, 20),
    "Blaze": new Mob(["blaze", "bezal", "mutated_blaze"], [25, 70, 80, 70], 4, 20),
    "Flaming Spider": new Mob(["flaming_spider"], [80], 3, 20),
    "Flare": new Mob(["flare"], [90], 1, 20),
    "Ghast": new Mob(["ghast", "dive_ghast"], [85, 90], 4, 20),
    "Mage Outlaw": new Mob(["mage_outlaw"], [200], 5, 20),
    "Magma Boss": new Mob(["magma_boss"], [500], 5, 20),
    "Magma Cube": new Mob(["magma_cube", "pack_magma_cube"], [75, 90], 3, 20),
    "Matcho": new Mob(["matcho"], [100], 5, 15),
    "Millenia-Aged Blaze": new Mob(["old_blaze"], [110], 3, 15),
    "Mushroom Bull": new Mob(["charging_mushroom_cow"], [80], 3, 20),
    "Pigman": new Mob(["magma_cube_rider", "kada_knight"], [90], 3, 20),
    "Smoldering Blaze": new Mob(["smoldering_blaze"], [95], 2, 20),
    "Tentacle": new Mob(["tentacle", "hellwisp"], [1, 100], 5, 20),
    "Vanquisher": new Mob(["vanquisher"], [100], 5, 20),
    "Wither Skeleton": new Mob(["wither_skeleton"], [70], 3, 20),
    "Wither Spectre": new Mob(["wither_spectre"], [70], 3, 20),
    // Deep Cavern
    "Emerald Slime": new Mob(["emerald_slime"], [5, 10, 15], 1, 10),
    "Lapis Zombie": new Mob(["lapis_zombie"], [7], 1, 10),
    "Miner Skeleton": new Mob(["diamond_skeleton"], [15, 20], 1, 10),
    "Miner Zombie": new Mob(["diamond_zombie"], [15, 20], 1, 10),
    "Redstone Pigman": new Mob(["redstone_pigman"], [10], 1, 10),
    "Creeper": new Mob(["invisible_creeper"], [3], 3, 10),
    // Dwarven Mines
    "Ghost": new Mob(["caverns_ghost"], [250], 2, 25),
    "Goblin": new Mob(["goblin_weakling_melee", "goblin_weakling_bow", "goblin_creepertamer", "goblin_battler", "goblin_knife_thrower", "goblin_flamethrower", "goblin_murderlover"], [25, 40, 50, 70, 100, 200], 2, 20),
    "Goblin Raider": new Mob(["goblin_weakling_melee", "goblin_weakling_bow", "goblin_creepertamer", "goblin_creeper", "goblin_battler", "goblin_murderlover", "goblin_golem"], [5, 20, 60, 90, 150], 4, 15),
    "Golden Goblin": new Mob(["goblin"], [50], 5, 15),
    "Ice Walker": new Mob(["ice_walker"], [45], 2, 15),
    "Powder Ghast": new Mob(["powder_ghast"], [1], 1, 5),
    "Star Sentry": new Mob(["crystal_sentry"], [50], 4, 15),
    "Treasure Hoarder": new Mob(["treasure_hoarder"], [70], 3, 15),
    // Crystal Hollows
    "Automaton": new Mob(["automaton"], [100, 150], 2, 15),
    "Bal": new Mob(["bal_boss"], [100], 6, 15),
    "Butterfly": new Mob(["butterfly"], [100], 4, 15),
    "Grunt": new Mob(["team_treasurite_grunt", "team_treasurite_viper", "team_treasurite_wendy", "team_treasurite_sebastian", "team_treasurite_corleone"], [50, 100, 200], 3, 15),
    "Key Guardian": new Mob(["key_guardian"], [100], 6, 15),
    "Sludge": new Mob(["sludge"], [5, 10, 100], 3, 15),
    "Thyst": new Mob(["thyst"], [20], 3, 15),
    "Worm": new Mob(["worm", "scatha"], [5, 10], 5, 15),
    "Yog": new Mob(["yog"], [100], 3, 15),
    // The Park
    "Howling Spirit": new Mob(["howling_spirit"], [35], 2, 15),
    "Pack Spirit": new Mob(["pack_spirit"], [35], 2, 15),
    "Soul of the Alpha": new Mob(["soul_of_the_alpha"], [55], 4, 15),
    // Spooky Festival
    "Crazy Witch": new Mob(["batty_witch"], [60], 2, 10),
    "Headless Horseman": new Mob(["horseman_horse"], [100], 7, 20),
    "Phantom Spirit": new Mob(["phantom_spirit"], [35], 2, 10),
    "Scary Jerry": new Mob(["scary_jerry"], [30], 2, 10),
    "Trick or Treater": new Mob(["trick_or_treater"], [30], 2, 10),
    "Wither Gourd": new Mob(["wither_gourd"], [40], 2, 10),
    "Wraith": new Mob(["wraith"], [50], 2, 10),
    // The Catacombs
    "Angry Archeologist": new Mob(["diamond_guy", "master_diamond_guy"], [80, 90, 100, 110, 120, 130, 140, 150, 160, 170], 5, 25),
    "Bat": new Mob(["dungeon_secret_bat"], [1], 4, 15),
    "Cellar Spider": new Mob(["cellar_spider", "master_cellar_spider"], [45, 65, 75, 85, 95, 105, 115, 125], 4, 15),
    "Crypt Dreadlord": new Mob(["crypt_dreadlord", "master_cryptdreadlord"], [47, 67, 77, 87, 97, 107, 117, 127], 4, 25),
    "Crypt Lurker": new Mob(["crypt_lurker", "master_crypt_lurker"], [41, 61, 71, 81, 91, 101, 111, 121], 4, 25),
    "Crypt Souleater": new Mob(["crypt_souleater", "master_crypt_souleater"], [45, 65, 75, 85, 95, 105, 115, 125], 4, 25),
    "Fels": new Mob(["tentaclees", "master_tentaclees"], [90, 100, 110], 4, 25),
    "Golem": new Mob(["sadan_golem", "master_sadan_golem"], [1], 4, 15),
    "King Midas": new Mob(["king_midas", "master_king_midas"], [130, 140, 150, 160, 170], 5, 10),
    "Lonely Spider": new Mob(["lonely_spider", "master_lonely_spider"], [35, 55, 65, 75, 85, 95, 105, 115], 4, 25),
    "Lost Adventurer": new Mob(["lost_adventurer", "master_lost_adventurer"], [80, 85, 90, 100, 110, 120, 130, 140, 150, 160], 5, 25),
    "Mimic": new Mob(["mimic", "master_mimic"], [115, 125], 4, 15),
    "Scared Skeleton": new Mob(["scared_skeleton", "master_scared_skeleton"], [42, 60, 62, 70, 72], 3, 15),
    "Shadow Assassin": new Mob(["shadow_assassin", "master_shadow_assassin"], [120, 130, 140, 150, 160, 170, 171], 5, 25),
    "Skeleton Grunt": new Mob(["skeleton_grunt", "master_skeleton_grunt"], [40, 60, 70, 80], 3, 15),
    "Skeleton Lord": new Mob(["skeleton_lord", "master_skeleton_lord"], [150], 5, 20),
    "Skeleton Master": new Mob(["skeleton_master", "master_skeleton_master"], [78, 88, 98, 108, 118, 128], 4, 25),
    "Skeleton Soldier": new Mob(["skeleton_soldier", "master_skeleton_soldier"], [66, 76, 86, 96, 106, 116, 126], 1, 15),
    "Skeletor": new Mob(["skeletor", "skeletor_prime", "master_skeletor", "master_skeletor_prime"], [80, 90, 100, 110], 5, 25),
    "Sniper": new Mob(["sniper_skeleton", "master_sniper_skeleton"], [43, 63, 73, 83, 93, 103, 113, 123], 3, 15),
    "Super Archer": new Mob(["super_archer", "master_super_archer"], [90, 100, 110, 120], 5, 25),
    "Super Tank Zombie": new Mob(["super_tank_zombie", "master_super_tank_zombie"], [90, 100, 110, 120], 4, 25),
    "Tank Zombie": new Mob(["crypt_tank_zombie", "master_crypt_tank_zombie"], [40, 60, 70, 80, 90], 3, 15),
    "Terracotta": new Mob(["sadan_statue", "master_sadan_statue"], [1], 1, 15),
    "Undead": new Mob(["watcher_summon_undead", "master_watcher_summon_undead"], [1, 2, 3, 4, 5, 6, 7, 8], 2, 15),
    "Undead Skeleton": new Mob(["dungeon_respawning_skeleton", "master_dungeon_respawning_skeleton"], [40, 60, 61, 70, 71, 80, 81, 90, 91, 100, 101, 110, 111, 120], 4, 25),
    "Wither Guard": new Mob(["wither_guard", "master_wither_guard"], [100], 5, 25),
    "Wither Husk": new Mob(["master_wither_husk"], [100], 5, 25),
    "Wither Miner": new Mob(["wither_miner", "master_wither_miner"], [100], 4, 25),
    "Withermancer": new Mob(["crypt_witherskeleton", "master_crypt_witherskeleton"], [90, 100, 110, 120], 4, 25),
    "Zombie Commander": new Mob(["zombie_commander", "master_zombie_commander"], [110, 120], 4, 20),
    "Zombie Grunt": new Mob(["zombie_grunt", "master_zombie_grunt"], [40, 60, 70], 3, 15),
    "Zombie Knight": new Mob(["zombie_knight", "master_zombie_knight"], [86, 96, 106, 116, 126], 4, 25),
    "Zombie Lord": new Mob(["zombie_lord", "master_zombie_lord"], [150], 5, 20),
    "Zombie Soldier": new Mob(["zombie_soldier", "master_zombie_soldier"], [83, 93, 103, 113, 123], 1, 15),
    // Fishing
    "Squid": new Mob(["pond_squid"], [1], 2, 15),
    "Night Squid": new Mob(["night_squid"], [6], 4, 15),
    "Sea Walker": new Mob(["sea_walker"], [4], 3, 15),
    "Sea Guardian": new Mob(["sea_guardian"], [10], 3, 15),
    "Sea Witch": new Mob(["sea_witch"], [15], 3, 15),
    "Sea Archer": new Mob(["sea_archer"], [15], 3, 15),
    "Rider of the Deep": new Mob(["zombie_deep"], [20], 3, 15),
    "Catfish": new Mob(["catfish"], [23], 4, 15),
    "Carrot King": new Mob(["carrot_king"], [25], 5, 15),
    "Sea Leech": new Mob(["sea_leech"], [30], 4, 15),
    "Guardian Defender": new Mob(["guardian_defender"], [45], 4, 15),
    "Deep Sea Protector": new Mob(["deep_sea_protector"], [60], 4, 15),
    "Water Hydra": new Mob(["water_hydra"], [100], 5, 15),
    "The Sea Emperor": new Mob(["skeleton_emperor"], [150], 7, 15),
    "Oasis Rabbit": new Mob(["oasis_rabbit"], [10], 4, 10),
    "Oasis Sheep": new Mob(["oasis_sheep"], [10], 4, 10),
    "Water Worm": new Mob(["water_worm"], [20], 4, 15),
    "Poisoned Water Worm": new Mob(["poisoned_water_worm"], [25], 4, 15),
    "Zombie Miner": new Mob(["zombie_miner"], [150], 6, 15),
    "Scarecrow": new Mob(["scarecrow"], [9], 3, 15),
    "Nightmare": new Mob(["nightmare"], [24], 4, 15),
    "Werewolf": new Mob(["werewolf"], [50], 4, 15),
    "Phantom Fisherman": new Mob(["phantom_fisherman"], [160], 6, 15),
    "Grim Reaper": new Mob(["grim_reaper"], [190], 7, 15),
    "Frozen Steve": new Mob(["frozen_steve"], [7], 3, 15),
    "Frosty The Snowman": new Mob(["frosty_the_snowman"], [13], 3, 15),
    "Grinch": new Mob(["grinch"], [21], 6, 15),
    "Yeti": new Mob(["yeti"], [175], 6, 15),
    "Nutcracker": new Mob(["nutcracker"], [50], 5, 15),
    "Reindrake": new Mob(["reindrake"], [100], 7, 15),
    "Nurse Shark": new Mob(["nurse_shark"], [6], 3, 15),
    "Blue Shark": new Mob(["blue_shark"], [20], 4, 15),
    "Tiger Shark": new Mob(["tiger_shark"], [50], 4, 15),
    "Great White Shark": new Mob(["great_white_shark"], [180], 5, 15),
    "Plhlegblast": new Mob(["pond_squid"], [300], 7, 5),
    "Magma Slug": new Mob(["magma_slug"], [200], 2, 15),
    "Moogma": new Mob(["moogma"], [210], 3, 15),
    "Lava Leech": new Mob(["lava_leech"], [220], 3, 15),
    "Pyroclastic Worm": new Mob(["pyroclastic_worm"], [240], 3, 15),
    "Lava Flame": new Mob(["lava_flame"], [230], 4, 15),
    "Fire Eel": new Mob(["fire_eel"], [240], 4, 15),
    "Taurus": new Mob(["pig_rider"], [250], 4, 15),
    "Thunder": new Mob(["thunder"], [400], 5, 15),
    "Lord Jawbus": new Mob(["lord_jawbus"], [600], 6, 15),
    "Flaming Worm": new Mob(["flaming_worm"], [50], 3, 15),
    "Lava Blaze": new Mob(["lava_blaze"], [100], 4, 15),
    "Lava Pigman": new Mob(["lava_pigman"], [100], 4, 15),
    "Agarimoo": new Mob(["agarimoo"], [35], 3, 15),
    // Mythological Creatures
    "Gaia Construct": new Mob(["gaia_construct"], [140, 260], 4, 20),
    "Minos Champion": new Mob(["minos_champion"], [175, 310], 5, 20),
    "Minos Hunter": new Mob(["minos_hunter"], [15, 60, 125], 5, 20),
    "Minos Inquisitor": new Mob(["minos_inquisitor"], [750], 7, 20),
    "Minotaur": new Mob(["minotaur"], [45, 120, 210], 4, 20),
    "Siamese Lynx": new Mob(["siamese_lynx"], [25, 85, 155], 4, 20),
    // Jerry
    "Blue Jerry": new Mob(["mayor_jerry_blue"], [2], 5, 10),
    "Golden Jerry": new Mob(["mayor_jerry_golden"], [5], 7, 10),
    "Green Jerry": new Mob(["mayor_jerry_green"], [1], 4, 10),
    "Purple Jerry": new Mob(["mayor_jerry_purple"], [3], 3, 10),
    // Kuudra
    "Blazing Golem": new Mob(["blazing_golem"], [100, 200, 300, 400, 500], 3, 10),
    "Blight": new Mob(["blight"], [100, 200, 300, 400, 500], 3, 20),
    "Dropship": new Mob(["dropship"], [100, 200, 300, 400, 500], 3, 10),
    "Explosive Imp": new Mob(["explosive_imp"], [100, 200, 300, 400, 500], 3, 20),
    "Inferno Magma Cube": new Mob(["inferno_magma_cube"], [100, 200, 300, 400, 500], 3, 20),
    "Kuudra Berserker": new Mob(["kuudra_berserker"], [100, 200, 300, 400, 500], 3, 20),
    "Kuudra Follower": new Mob(["kuudra_follower"], [100, 200, 300, 400, 500], 2, 20),
    "Kuudra Knocker": new Mob(["kuudra_knocker"], [100, 200, 300, 400, 500], 3, 20),
    "Kuudra Landmine": new Mob(["kuudra_landmine"], [100, 200, 300, 400, 500], 3, 20),
    "Kuudra Slasher": new Mob(["kuudra_slasher"], [100, 200, 300, 400, 500], 5, 10),
    "Magma Follower": new Mob(["magma_follower"], [100, 200, 300, 400, 500], 5, 10),
    "Wandering Blaze": new Mob(["wandering_blaze"], [100, 200, 300, 400, 500], 4, 20),
    "Wither Sentry": new Mob(["wither_sentry"], [100, 200, 300, 400, 500], 4, 10),
}
let completed = 0;
delay(() => {
    Object.keys(bestiary).forEach(key => {
        if (bestiary[key].updateKills())
            completed++;
    });
}, 1000);
