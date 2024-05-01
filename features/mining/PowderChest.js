import location from "../../utils/location";
import settings from "../../utils/settings";
import { BOLD, CHEST_CLASS, DARK_AQUA, WHITE } from "../../utils/constants";
import { Overlay } from "../../utils/overlay";
import { registerWhen } from "../../utils/register";
import { data } from "../../utils/data";


/**
 * Variables used to track and detect nearby chests.
 */
let nearbyChests = [];
export function getPowderChests() { return nearbyChests };
const powderExample = `${DARK_AQUA + BOLD}Nearby Chests: ${WHITE}dentge.`;
const powderOverlay = new Overlay("powderChest", data.HL, "moveChest", powderExample, ["Crystal Hollows"]);

/**
 * Detects nearby chests to create waypoints and update overlay.
 */
registerWhen(register("tick", () => {
    nearbyChests = World.getAllTileEntitiesOfType(CHEST_CLASS)
        .filter(chest => Player.asPlayerMP().distanceTo(chest.getBlockPos()) <= settings.powderChest);
    powderOverlay.setMessage(`${DARK_AQUA + BOLD}Nearby Chests: ${WHITE + nearbyChests.length}`);
}), () => location.getWorld() === "Crystal Hollows" && settings.powderChest !== 0);

/**
 * Removes chest waypoints on world leave.
 */
registerWhen(register("worldUnload", () => {
    nearbyChests = [];
}), () => location.getWorld() === "Crystal Hollows" && settings.powderChest !== 0);

/**
 * Remove powder chest spam.
 */
registerWhen(register("chat", (gain, event) => {
    if (settings.powderHider === 3) cancel(event);
    else if (settings.powderHider === 1 && !gain.includes("Powder")) cancel(event);
    else if (settings.powderHider === 2 && gain.includes("Powder")) cancel(event);
}).setCriteria("You received ${gain}"), () => settings.powderHider !== 0)
