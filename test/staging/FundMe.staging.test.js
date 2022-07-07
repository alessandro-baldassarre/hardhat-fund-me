const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let deployer
          let fundMe
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              const transactionResponse = await fundMe.fund({
                  value: ethers.utils.parseEther("0.1"),
              })
              await transactionResponse.wait()
              console.log("Funded!")
              const transactionResponseWithdraw = await fundMe.withdraw()
              await transactionResponseWithdraw.wait()
              console.log("Got it back!")

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
