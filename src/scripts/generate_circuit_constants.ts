import { generateHashesFromFile } from "./generate_deterministic_hashes";
import { generateRandomHashes } from "./generate_random_hashes";
import * as path from 'path';
import { writeFile } from 'fs';

async function generateCircuitConstants() {
    console.log("Constant Generation")
    const deterministicHashes = await generateHashesFromFile("username_at_org.txt");
    
    let organizedHashes = [];
    let currentOrg = "";
    let orgHashCount = 0;
    
    for (const { input, hash } of deterministicHashes) {
        const [_, org] = input.split("@");
        
        if (org !== currentOrg) {
            if (currentOrg !== "") {
          organizedHashes.push(...await generateRandomHashes((50 - orgHashCount)));
            }
          currentOrg = org;
          orgHashCount = 0;
        }
        
        organizedHashes.push(hash);
        orgHashCount++;
      }

    if (orgHashCount < 50) {
        organizedHashes.push(...await generateRandomHashes(50 - orgHashCount));
    }

    const randomHashesNeeded = 1000 - organizedHashes.length;
    const randomHashes = await generateRandomHashes(randomHashesNeeded);
    const allHashes = organizedHashes.concat(randomHashes);

    const dirName = __dirname;
    const filePath = path.join(dirName, '..', 'public', "hash_outputs.txt");

    const allHashesstr = allHashes.map(bigInt => bigInt.toString() + 'n').join(',\n');

    const data = `[
        ${allHashesstr}
        ]`;

    await writeFile(filePath, '[' + allHashes.join(',') + ']', 'utf-8', (err) => {
        if(err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Hashes written to file successfully.');
        }
        });
}

generateCircuitConstants();