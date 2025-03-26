import location from "../../utils/Location";
import { registerWhen } from "../../utils/RegisterTils";

registerWhen(
    register("tick", () => {
        ChatLib.chat("In Dreadfarm.");
    }),
    () => location.getWorld() === "The Rift" && location.getZone() == "Dreadfarm"
);