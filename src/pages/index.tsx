import React, { useState, useEffect } from 'react';
import '../styles/promptbutton.css';
import { stringToBigInt } from '../utils/witnessConstructor'; 
import { useRouter } from 'next/router';


interface Proof {
    curve: string;
    protocol: string;
    pi_a: [string, string, string];
    pi_b: [
      [string, string],
      [string, string],
      [string, string]
    ];
    pi_c: [string, string, string];
  }
  
  interface CalculateProofOutput {
    proofToSubmit: Proof | null;
    publicSignals: [string] | null;
    error?: string;
  }

function Home() {
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    const [errorText, setErrorText] = useState('');
    const [stepText, setStepText] = useState("Enter your GitHub username followed by '@' and your GitHub organization name");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const handleRouteChange = (url: string) => {
        router.prefetch(url);
      };
      
      router.events.on('routeChangeStart', handleRouteChange);
    
      return () => {
        router.events.off('routeChangeStart', handleRouteChange);
      };
    }, []);

    const calculateProof = async (secret: BigInt): Promise<CalculateProofOutput> => {
        try {
          const { proof, publicSignals } = await (window as any).snarkjs.groth16.fullProve(
            { secret: secret}, 
            "/InclusionCheck.wasm",
            "/InclusionCheck_final.zkey"
          );

          const proofToSubmit: Proof = {
            curve: proof.curve,
            protocol: proof.protocol,
            pi_a: [
              proof.pi_a[0],
              proof.pi_a[1],
              proof.pi_a[2]
            ],
            pi_b: [
              [proof.pi_b[0][0], proof.pi_b[0][1]],
              [proof.pi_b[1][0], proof.pi_b[1][1]],
              [proof.pi_b[2][0], proof.pi_b[2][1]]
            ],
            pi_c: [
              proof.pi_c[0],
              proof.pi_c[1],
              proof.pi_c[2]
            ]
          };

        return {proofToSubmit, publicSignals};
        } catch (error) {
            console.log("Proof generation error: ", error)
            return { proofToSubmit: null, publicSignals: null, error: 'Calculation error' };

        }
    }

    const verifyProof = async (proofOutput: CalculateProofOutput) => {
        try {
          const res = await fetch('/api/verifyProof', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ proof: proofOutput.proofToSubmit, publicSignals: proofOutput.publicSignals } ),
          });


          const data = await res.json();

          return data
        } catch (error) {
          console.error('Error verifying proof:', error);
        }
      };      
  
    const handleSubmit = async () => {
      if (!inputValue.includes('@') || !inputValue.split('@')[0] || !inputValue.split('@')[1]) {
        setErrorText('Please enter a valid GitHub username and organization, separated by "@"');
        return;
      }
      setErrorText("");
      setIsLoading(true);
      setStepText("Generating a Proof...")

      let circuit_input = stringToBigInt(inputValue);

      const proofOutput = await calculateProof(circuit_input);

      if (proofOutput.error) {
        setIsLoading(false);
        setStepText("Enter your GitHub username followed by '@' and your GitHub organization name");
        setErrorText('The input does not satisfy the circuit constraints. Please try a different combination.')
        return;
    
      }

      setStepText("Verifying your Proof...")
      let data = await verifyProof(proofOutput)

      if (data.isValid) {
        sessionStorage.setItem('secretContent', data.secretContent);
        router.push({
          pathname: '/secret',
          query: { from: 'home' },
        });
      } else {
        setStepText("Enter your GitHub username followed by '@' and your GitHub organization name")
        setErrorText('Sorry, the proof was invalid. Try a different combination.')
      }
    };
  
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
        setIsLoading(false);
        setStepText("Enter your GitHub username followed by '@' and your GitHub organization name")
        setErrorText(''); 
      }
    };
  
    return (
      <div className="container">
        <div className="error-text">{errorText}</div>
        <div className="webflow-style-input">
          <input 
              className="" 
              type="text" 
              placeholder="transmission11@paradigm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toLowerCase())}
              onKeyDown={handleKeyPress}
              />
              <button type="submit" onClick={handleSubmit}>
              <i className={`fa ${isLoading ? 'fa-spinner fa-spin' : 'fa-arrow-right'}`}></i>
              </button>
          </div>
          <div className="helper-text">
              {stepText}
          </div>
      </div>
    );
  }

export default Home;
 
