const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log(args)
    console.log("in verify func")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: [args],
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = verify
