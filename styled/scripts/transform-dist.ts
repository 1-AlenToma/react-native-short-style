import fs from "fs";
import path from "path";
import { transformFileSync } from "@babel/core";
import styleTransformer from "../babel-style-transformer";


const dist = path.resolve(__dirname, "../dist");


function processDir(dir: string) {

    for (const file of fs.readdirSync(dir)) {

        const full = path.join(dir, file);

        if (fs.statSync(full).isDirectory()) {
            processDir(full);
            continue;
        }


        if (!file.endsWith(".js"))
            continue;


        console.log("Transforming", full);


        const result = transformFileSync(
            full,
            {
                plugins: [
                    styleTransformer
                ],

                filename: full,

                configFile: false,
                babelrc: false
            }
        );


        if (result?.code) {
            console.log("go result")
            fs.writeFileSync(
                full,
                result.code
            );
        }
    }
}


processDir(dist);