"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    constructor() { }
    notEmpty(vyraz) {
        if (vyraz !== undefined) {
            return vyraz.length > 0;
        }
        return false;
    }
}
exports.Utils = Utils;
