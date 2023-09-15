cd "$(dirname "$0")"

mkdir -p build
mkdir -p zkFiles

cd build/

if [ -f ./powersOfTau28_hez_final_12.ptau ]; then
    echo "powersOfTau28_hez_final_12.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_12.ptau'
    curl -O https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
fi

circom ../InclusionCheck.circom --r1cs --wasm --sym

npx snarkjs groth16 setup InclusionCheck.r1cs powersOfTau28_hez_final_12.ptau InclusionCheck_0000.zkey

npx snarkjs zkey contribute InclusionCheck_0000.zkey InclusionCheck_0001.zkey --name="First contribution" -v -e="Random entropy"
npx snarkjs zkey contribute InclusionCheck_0001.zkey InclusionCheck_0002.zkey --name="Second contribution" -v -e="Another random entropy"
npx snarkjs zkey beacon InclusionCheck_0002.zkey InclusionCheck_final.zkey 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon phase2"

npx snarkjs zkey export verificationkey InclusionCheck_final.zkey verification_key.json

cp verification_key.json ../zkFiles/verification_key.json
cp verification_key.json ../../src/public/verification_key.json
cp InclusionCheck_js/InclusionCheck.wasm ../zkFiles/InclusionCheck.wasm
cp InclusionCheck_js/InclusionCheck.wasm ../../src/public/InclusionCheck.wasm
cp InclusionCheck_final.zkey ../zkFiles/InclusionCheck_final.zkey
cp InclusionCheck_final.zkey ../../src/public/InclusionCheck_final.zkey