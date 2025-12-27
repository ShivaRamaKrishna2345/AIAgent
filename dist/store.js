import fs from "fs";
export function loadJSON(path) {
    if (!fs.existsSync(path))
        return [];
    return JSON.parse(fs.readFileSync(path, "utf-8"));
}
export function saveJSON(path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
