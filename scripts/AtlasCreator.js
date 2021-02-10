const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require("path");

const searchJson = (dir) => {
    const jsonPaths = [];

    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            jsonPaths.push(...searchJson(fullPath));
        } else if (path.extname(fullPath) === ".json") {
            jsonPaths.push(fullPath);
        }
    });

    return jsonPaths;
}

const parseAtlas = async (paths) => {
    const result = {};

    for (const path of paths) {
        const data = await fsPromises.readFile(path);
        const json = JSON.parse(data);

        Object.keys(json.frames).forEach((key) => {
            const values = key.split("\/");
            let prevResult = result;

            for (let i = 0; i < values.length - 1; i++) {
                const value = values[i];

                if (prevResult[value] === undefined) {
                    prevResult[value] = {};
                }

                prevResult = prevResult[value];
            }

            prevResult[values[values.length - 1]] = key;
        });
    }

    return Promise.resolve(result);
}

const writeResult = (result) => {
    let fileContent = "/* eslint-disable comma-dangle */\n";

    Object.keys(result).forEach(key => {
        fileContent += `export const Atlas = ${JSON.stringify(result[key], null, "\t")} as const;\n`;
    });

    fs.writeFileSync(path.resolve(__dirname, "../src/AtlasesMap.ts"), fileContent);
}

const jsonFilePaths = searchJson(path.resolve(__dirname, "../assets/dist"));
parseAtlas(jsonFilePaths).then(writeResult);
