import fs from "fs";

let level = "all";
let output = "console";


function configure(settings) {
    if (settings.level) {
        level = settings.level;
    }

    if (settings.output) {
        output = settings.output;
    }
}


function shouldLog(messageLevel) {

    if (level === "error") {
        return messageLevel === "error";
    }

    if (level === "warn") {
        return messageLevel === "warn" ||
               messageLevel === "error";
    }

    return true;
}


function write(messageLevel, message) {

    if (!shouldLog(messageLevel)) {
        return;
    }

    const logMessage =
        `[${messageLevel.toUpperCase()}] ${message}`;

    if (output === "console") {
        console.log(logMessage);
    }

    if (output === "file") {
        fs.appendFileSync("app.log", logMessage + "\n");
    }
}


function info(message) {
    write("info", message);
}


function warn(message) {
    write("warn", message);
}


function error(message) {
    write("error", message);
}


export {
    info,
    warn,
    error,
    configure
};

