import location from "../../utils/location";
import settings from "../../utils/Settings";
import { Overlay } from "../../utils/Overlay";
import { registerWhen } from "../../utils/RegisterTils";
import { data } from "../../utils/Data";


/**
 * Crate overlay variables.
 */
const crateExample = "§8[§a|||||||||||||§f|||||||§8] §b69%§r";
const crateOverlay = new Overlay("crateEdit", data.CEL, "moveCrate", crateExample, ["Kuudra"]);

/**
 * Cancel crate title render and replay with overlay render.
 */
registerWhen(register("renderTitle", (title, _, event) => {
    if (!title.startsWith("§8[") || !title.endsWith("%§r")) return;

    crateOverlay.setMessage(title);
    cancel(event);
}), () => settings.crateEdit && location.getWorld() === "Kuudra");

/**
 * Reset on crate pickup/cancel
 */
register("chat", () => {
    Client.scheduleTask(20, () => crateOverlay.setMessage(""));
}).setCriteria("You retrieved some of Elle's supplies from the Lava!");
register("chat", () => {
    Client.scheduleTask(20, () => crateOverlay.setMessage(""));
}).setCriteria("You moved and the Chest slipped out of your hands!");
