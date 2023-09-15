export const stringToBigInt = (input: string) => {
  const hex = Buffer.from(input, 'utf8').toString('hex');
  return BigInt(`0x${hex}`);
} 