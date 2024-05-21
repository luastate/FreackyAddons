import party from "../../utils/party";
import settings from "../../utils/Settings";
import { GREEN, LOGO } from "../../utils/Constants";
import { registerWhen } from "../../utils/RegisterTils";
import { delay } from "../../utils/ThreadTils";


/**
 * Handles redirection of party commands by intercepting and modifying chat messages.
 */
const partyCommands = new Set(["accept", "join", "kick", "promote", "demote"]);
let cd = false;
registerWhen(register("messageSent", (message, event) => {
    const args = message.split(' ');
    if (cd || party.getIn() || args.length < 3 || (args[0] !== "/p" && args[0] !== "/party") || partyCommands.has(args[1].toLowerCase())) return;
    cd = true;
    delay(() => cd = false, 1000);

    ChatLib.chat(`${LOGO + GREEN}Cancelling ghost party...`)
    cancel(event);
    ChatLib.command(`p ${args[1]}`);
    delay(() =>  ChatLib.command(`p ${args.splice(2).join(' ')}`), 500);
}), () => settings.antiGhostParty);
