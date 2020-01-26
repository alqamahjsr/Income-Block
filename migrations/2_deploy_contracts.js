var UBI = artifacts.require("./UBI.sol");
/* //used for deployment to rinkeby
module.exports = function(deployer, accounts) {
  let owner = accounts[0]
  deployer.deploy(UBI);
};
*/
module.exports = async function(deployer, _network, accounts) {
  await deployer.deploy(UBI);
  const ubi = await UBI.deployed();
  await ubi.deposit({ value: web3.utils.toBN(5000000000000000000), from: accounts[0], gasLimit: 100000});
};
