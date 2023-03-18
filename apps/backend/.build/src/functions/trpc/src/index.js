"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./utils/helpers");
exports.handler = async (event) => {
    try {
        (0, helpers_1.printText)("Hello from TRPC lambda function!");
    }
    catch (err) {
        console.log("ERROR", err);
    }
};
//# sourceMappingURL=index.js.map