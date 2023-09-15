import { NextApiRequest, NextApiResponse } from 'next';
import { groth16 } from 'snarkjs'; 
import fs from 'fs';
import path from 'path';

let vKey: any; 

const getVerificationKey = async () => {
  if (!vKey) {
    const filePath = path.resolve('./public/', 'verification_key.json'); 
    const data = fs.readFileSync(filePath);
    vKey = JSON.parse(data.toString());

  }
  return vKey;
};

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

  try {
    getVerificationKey()
  }  catch (error) {
    console.error('Error loading the file: ', error);
  }
  
  try {
    const { proof, publicSignals } = req.body;

    if (!proof || !publicSignals) {
      return res.status(400).send('Proof and public signals are required');
    }

    const isValid = await groth16.verify(vKey, publicSignals, proof);


    const groupSetNumber = publicSignals[0];

    if (groupSetNumber < 0 || groupSetNumber > 20) {
      return res.status(400).send('Invalid group set number');
    }

    const secretContentPath = path.resolve('./secrets/html/', `${groupSetNumber}.html`);
    const secretContent = fs.readFileSync(secretContentPath, 'utf-8');

    res.status(200).json({ isValid, secretContent });
  } catch (error) {
    console.error('Error verifying proof:', error);
    res.status(500).send('Internal Server Error');
  }
};
