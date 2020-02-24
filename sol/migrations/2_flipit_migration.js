const FlipIt = artifacts.require("FlipIt");
const FlipIt_V1 = artifacts.require("FlipIt_V1");

module.exports = async function(deployer, network, accounts){
  //Deploy Contracts
  deployer.deploy(FlipIt_V1).then(function() {
    return deployer.deploy(FlipIt, FlipIt_V1.address);
  });
};
