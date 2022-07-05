const { getNamedAccounts, ethers } = require("hardhat")
const main = async () => {
    const { deployer } = await getNamedAccounts()
    const fundme = await ethers.getContract("FundMe", deployer)
    const txResponse = await fundme.fund({
        value: ethers.utils.parseEther("0.1"),
    })
    await txResponse.wait(1)
    console.log("Funded")
}

main()
