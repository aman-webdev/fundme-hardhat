const {
    networkConfig,
    developerChain,
    decimals,
    initialAnswer,
} = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    if (developerChain.includes(network.name)) {
        log("Local network detected deploying mocks")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [decimals, initialAnswer],
        })

        log("Mocks Deployed")
        log("-------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
