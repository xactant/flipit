# flipit
Example Solidity Contract and Web3 based UI DAPP. FlipIt is a game that simulates a coin flip. A player can enter a wager in gwei, finney or eth and call the toss. If the player wins the toss the player is paid 2x the amount wagered.

## Contract
The contract uses the updatable pattern, providing a set proxy front end contract which points to a contract which privded functionality. Each share a storage contract.

## UI
He UI is a pure JavaScript dApp which uses Bootstrap and Jquery. Integration to the targt contract is accomplished using Web3.
