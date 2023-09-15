import * as circomlibjs from 'circomlibjs';

class HasherHandler {
  private poseidon: any;

  constructor() {
    this.init();
  }

  private async init() {
    this.poseidon = await circomlibjs.buildPoseidon();
  }

  public async computeHash(input: BigInt): Promise<string> {
    while(!this.poseidon) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return this.poseidon.F.toString(this.poseidon([input]));
  }

  public async computeHashMultiple(input: BigInt[]): Promise<string> {
    while(!this.poseidon) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return this.poseidon.F.toString(this.poseidon(input));
  }


}

export const hasherHandler = new HasherHandler();
