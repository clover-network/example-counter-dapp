const CounterContract = artifacts.require("Counter");

module.exports = async function(deployer, network) {
  await deployer.deploy(CounterContract)
}