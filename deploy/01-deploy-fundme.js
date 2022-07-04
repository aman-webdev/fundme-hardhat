const { networkConfig, developerChain } = require("../helper-hardhat-config")
const { network, run } = require("hardhat")
const { verfiy } = require("../utils/verify")
const verify = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress

    if (developerChain.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeedAddress
    }

    // Mock Contract: if the contract doesn't exist, we deploy a minimal version of it for our local testing.

    const fundme = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //price feed address for chainlink ,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log(fundme)
    if (
        !developerChain.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("IN VERIFYYYYYY")
        await verify(fundme.address, ethUsdPriceFeedAddress)
    }
}
module.exports.tags = ["all", "fundme"]
