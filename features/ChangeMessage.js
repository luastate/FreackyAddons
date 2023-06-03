import settings from "../settings";
import { data, getMVP } from "../utils/variables";

const MVP = {
    "<3": "❤",
    ":star:": "✮",
    ":yes:": "✔",
    ":no:": "✖",
    ":java:": "☕",
    ":arrow:": "➜",
    ":shrug:": "¯\_(ツ)_/¯",
    ":tableflip:": "(╯°□°）╯︵ ┻━┻",
    "o/": "( ﾟ◡ﾟ)/",
    ":123:": "123",
    ":totem:": "◎_◎",
    ":typing:": "✎...",
    ":maths:": "√(π+x)=L",
    ":snail:": "@'-'",
    ":thinking:": "(0.o?)",
    ":gimme:": "༼つ ◕_◕ ༽つ",
    ":wizard:": "('-')⊃━☆ﾟ.*･｡ﾟ",
    ":pvp:": "⚔",
    ":peace:": "✌",
    ":oof:": "OOF",
    ":puffer:": "<('O')>",
}
const GIFT = {
    ":snow:": "☃",
    ":dog:": "(ᵔᴥᵔ)",
    ":sloth:": "( ⬩ ⊝ ⬩ )",
    ":dab:": "<o/",
    ":cat:": "= ＾● ⋏ ●＾ =",
    ":yey:": "ヽ (◕◡◕) ﾉ",
    "h/": "ヽ(^◇^*)/",
    ":dj:": "ヽ(⌐■_■)ノ♬",
    ":cute:": "(✿ᴖ‿ᴖ)"
};

register("messageSent", (message, event) => {
    if (!settings.enableEmotes) return;

    let contains = false;

    // MVP++ Emotes
    if (!getMVP) {
        Object.keys(MVP).forEach((key) => {
            if (message.includes(key)) {
                message = message.replace(key, MVP[key]);
                contains = true;
            }
        });
    }
    // Rank Gifting Emotes
    Object.keys(GIFT).forEach((key) => {
        if (message.includes(key)) {
            message = message.replace(key, GIFT[key]);
            contains = true;
        }
    });
    // Custom Emotes
    Object.keys(data.emotelist).forEach((key) => {
        if (message.includes(key)) {
            message = message.replace(key, data.emotelist[key]);
            contains = true;
        }
    });

    if (contains) {
        ChatLib.say(message);
        cancel(event);
    }
});