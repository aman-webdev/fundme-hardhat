const { assert } = require("chai")
const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { developerChain } = require("../../helper-hardhat-config")

developerChain.includes(network.name)
    ? describe.skip
    : describe("fundme", async () => {
          let fundme
          let deployer
          const sendValue = ethers.utils.parseEther("0.05")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              console.log(await getNamedAccounts())
              fundme = await ethers.getContract("FundMe", deployer) // connect with depoyer
          })

          it("allows people to fund and withdraw", async () => {
              const tx = await fundme.fund({ value: sendValue })
              tx.wait(3)

              const tx2 = await fundme.withdraw({ gasLimit: 80000 })
              tx2.wait(1)

              const endingBalance = await fundme.provider.getBalance(
                  fundme.address
              )
              console.log(endingBalance.toString())
              assert.equal(endingBalance.toString(), "0")
          })
      })
