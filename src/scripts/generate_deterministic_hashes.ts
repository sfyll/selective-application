import { hasherHandler } from "../utils/hasherHandler";
import { stringToBigInt } from "../utils/witnessConstructor";
import { readFileSync } from 'fs';
import * as path from 'path';

export async function generateHashesFromFile(filePathExtension: string) : Promise<{ input: string, hash: string }[]> {
    console.log("DETERMINISTIC HASH GENERATION")
    console.log("----------------------")
    console.log("----------------------")
    console.log("----------------------")
    console.log("----------------------")

    try {
      const dirName = __dirname;
      const filePath = path.join(dirName, '..', 'secrets', filePathExtension);
      const data = readFileSync(filePath, 'utf8');
      const lines = data.split('\n');
      
      const hashes = [];
      for (const line of lines) {
        if (line) {
          console.log(`line=${line}`);
          const lineBigInt = stringToBigInt(line)
          console.log(`lineBigInt=${lineBigInt}`);
          const hash = await hasherHandler.computeHash(lineBigInt);
          console.log(`hash=${hash}`);
          hashes.push({ input: line, hash: await hasherHandler.computeHash(lineBigInt) });
        }
      }
  
      console.log('Hashes:', hashes);

      return hashes;

    } catch (error) {
      console.error('Error generating hashes:', error);
      throw new Error("Failed to generate deterministic hashes");
    }
  }