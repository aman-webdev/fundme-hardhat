const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
describe("Fund Me", async () => {
    let fundme
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer

        await deployments.fixture(["all"])

        fundme = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("contructor", async () => {
        it("sets the aggregator address correctly", async () => {
            const response = await fundme.pricefeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async () => {
        it("fails if you dont send enougn ethers", async () => {
            await expect(fundme.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })

        it("updates the amount funded ds", async () => {
            await fundme.fund({ value: sendValue })
            const response = await fundme.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })

        it("adds funder to array of funders", async () => {
            await fundme.fund({ value: sendValue })
            const response = await fundme.funders(0)
            assert.equal(response, deployer)
        })
    })

    describe("widthdraw", async () => {
        beforeEach(async () => {
            await fundme.fund({ value: sendValue })
        })

        it("withdraw eth from a single founder", async () => {
            // fundme contract comes with provider, we could use ethers.provider.getBalance too
            const startingFundmeBalance = await fundme.provider.getBalance(
                fundme.address
            )
            const startingDeployerBalance = await fundme.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundme.withdraw()
            const { gasUsed, effectiveGasPrice } =
                await transactionResponse.wait(1)
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundmeBalance = await fundme.provider.getBalance(
                fundme.address
            )
            const endingDeployerBalance = await fundme.provider.getBalance(
                deployer
            )

            assert.equal(endingFundmeBalance, 0)
            assert.equal(
                startingFundmeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
    })
})
