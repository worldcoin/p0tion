# OPRF Service Trusted Setup Artifacts (Repro Summary)

This document records how the OPRF Service R1CS/WASM artifacts were reproduced and verified for Phase2 setup. It is intended to allow any coordinator to recompile the circuits, match checksums, and verify that downstream zkeys are derived from these exact R1CS files.

## Source and Compiler

- Repository: /home/ssm-user/oprf-service/circom
- Commit (main): 401b19bf8f8182cd1d80fd800d597baea05899cb
- Circom version: circom compiler 2.2.3

## Build Commands (O2)

These are the exact compile commands (aligned with the justfile) used to reproduce the artifacts:

```bash
# query
circom --r1cs ../OPRFQueryProof.circom -l ../../ --O2 --output ../
circom --wasm ../OPRFQueryProof.circom -l ../../ --O2 --output ../

# nullifier
circom --r1cs ../OPRFNullifierProof.circom -l ../../ --O2 --output ../
circom --wasm ../OPRFNullifierProof.circom -l ../../ --O2 --output ../

# keygen (repeat for 13/25/37)
circom --r1cs ../OPRFKeyGenProof13.circom -l ../../ --O2 --output ../
circom --wasm ../OPRFKeyGenProof13.circom -l ../../ --O2 --output ../
circom --r1cs ../OPRFKeyGenProof25.circom -l ../../ --O2 --output ../
circom --wasm ../OPRFKeyGenProof25.circom -l ../../ --O2 --output ../
circom --r1cs ../OPRFKeyGenProof37.circom -l ../../ --O2 --output ../
circom --wasm ../OPRFKeyGenProof37.circom -l ../../ --O2 --output ../
```

## Final Artifact Locations

Artifacts are staged in the Phase2 CLI circuits directory:

- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFQueryProof.r1cs
- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFNullifierProof.r1cs
- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof13.r1cs
- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof25.r1cs
- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof37.r1cs
- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFQueryProof.wasm
- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFNullifierProof.wasm
- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof13.wasm
- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof25.wasm
- /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof37.wasm

## SHA-256 Checksums

```
04431dc408ff158d072ff0932c9bf7dfe7a669a7164228f4093e1f170e4ba521  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFQueryProof.r1cs
6e590ca8afb21f81460b7208f0cd830fad0da7b99f6368cc41dc8cb838e58bec  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFNullifierProof.r1cs
6ed2ada50791bfd2a3eba15f727a5228e1efdc7545d07664b4671b02518813b8  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof13.r1cs
445876d7505d1aea9d8fdd2defd41e392e70deadafea28302a983b5920d66e33  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof25.r1cs
397b041e8fb32ad619f02e1f7d0eca5a59df96b1d6684f6232874466949fea8e  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof37.r1cs
54f81c321bad8fc509f598844e33bb57ec802610182a0a608378827d016fa9d2  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFQueryProof.wasm
7b2abbd1ffc4075ca0380bd6890fb71a88431317f30f09f78f6ee90ef3fc7831  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFNullifierProof.wasm
56f68e23ee9ddb129985d59bc8f41666cced26402a87bd74d2971a15dcbb9d29  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof13.wasm
eca5d2e58be888ec253a981d47eea0fa487b5c7e79632cceb14d9760d53f8b27  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof25.wasm
538235fec2c6e4d32f689b6f71c832ecec9645e46969148f89e215be797eb2f0  /home/ssm-user/p0tion/packages/phase2cli/circuits/oprf/OPRFKeyGenProof37.wasm
```

## Explainer: How to Reproduce and Verify

1) Checkout the exact commit in /home/ssm-user/oprf-service/circom.
2) Ensure circom 2.2.3 is installed and on PATH.
3) Run the build commands above (O2, with include path -l ../../).
4) Compare the SHA-256 hashes of the produced R1CS/WASM files to the values above.
5) Use the matching R1CS as inputs to zkey setup. Any zkey produced from a different R1CS will not match the expected hashes.

This provides a deterministic anchor from source code and compiler version to the circuit artifacts used in the Phase2 ceremony.
