import { hasherHandler } from "../utils/hasherHandler";
import * as fs from 'fs';
import * as path from 'path';


export async function generateRandomHashes(n: number = 10): Promise<string[]> {
  console.log("RANDOM HASH GENERATION");
  console.log("----------------------");
  
  const dirName = __dirname;
  
  const hashPromises = Array.from({ length: n }, (_, i) => {
    const randomBigInt = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    return hasherHandler.computeHash(randomBigInt);
  });

  const hashes = await Promise.all(hashPromises);

  console.log(hashes);
  return hashes;
}