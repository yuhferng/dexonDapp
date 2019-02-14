var MakeWeWork = artifacts.require('./MakeWeWork.sol');
var StringUtils = artifacts.require('./StringUtils.sol');

module.exports = function(deployer) {
    deployer.deploy(StringUtils);
    deployer.link(StringUtils,MakeWeWork);
    deployer.deploy(MakeWeWork);
}