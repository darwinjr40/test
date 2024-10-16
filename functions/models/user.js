// To parse this data:
//
//   const Convert = require("./file");
//
//   const welcome = Convert.toWelcome(json);

// Converts JSON strings to/from your types
function toWelcome(json) {
    return JSON.parse(json);
}

function welcomeToJson(value) {
    return JSON.stringify(value);
}

module.exports = {
    "welcomeToJson": welcomeToJson,
    "toWelcome": toWelcome,
};
