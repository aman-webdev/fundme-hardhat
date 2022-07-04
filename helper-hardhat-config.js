const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    137: {
        name: "polygon",
        ethUsdPriceFeedAddress: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    },
}

const developerChain = ["hardhat", "localhost"]

const decimals = 8
const initialAnswer = 200000000000

module.exports = {
    networkConfig,
    developerChain,
    decimals,
    initialAnswer,
}
