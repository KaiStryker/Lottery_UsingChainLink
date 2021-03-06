const { assert } = require('chai')
const truffleAssert = require('truffle-assertions')
const toWei = (value) => web3.utils.toWei(String(value))

contract('Lottery', accounts =>{
    const Lottery = artifacts.require('Lottery')
    const VRFCoordinatorMock = artifacts.require('VRFCoordinatorMock')
    const MockPriceFeed = artifacts.require('MockV3Aggregator')
    const {LinkToken} = require('@chainlink/contracts/truffle/v0.4/LinkToken')
    
    const defaultAccount = accounts[0]
    const player1 = accounts[1]
    const player2 = accounts[2]
    const player3 = accounts[3]
    const players = [ player1, player2, player3 ]

    let lottery, vrfCoordinatorMock, seed, link, keyhash, fee, mockPriceFeed

    describe('#requests a random number', () => {
        let price = '200000000000' //2000 usd
        beforeEach(async() =>{
            keyhash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
            fee = '100000000000000000' // 0.1
            seed = 123
            link = await LinkToken.new({from: defaultAccount})
            mockPriceFeed = await MockPriceFeed.new(8, price, {from: defaultAccount})
            vrfCoordinatorMock = await VRFCoordinatorMock.new(link.address, {from: defaultAccount})
            lottery = await Lottery.new(
                mockPriceFeed.address,
                vrfCoordinatorMock.address,
                link.address,
                keyhash,
                {from:defaultAccount}
                )
        })
        it('starts in closed state', async () =>{
            assert(await lottery.lotteryState() == 1)
        })
        it('corrects get the entrance fee', async () =>{
            let entranceFee = await lottery.getEntranceFee()
            assert.equal(entranceFee.toString(), toWei(0.025))
        })
        it('Disallow entrance without enough money', async () =>{
            await lottery.startLottery({from: defaultAccount})
            await truffleAssert.reverts(
                lottery.enter({from: defaultAccount,  value: 0})
            )  
        })
        it('Plays the game currently', async () =>{
            await lottery.startLottery({from: defaultAccount})
            let entranceFee = await lottery.getEntranceFee()
            
            players.map((player)=>{lottery.enter({from: player,  value: entranceFee.toString()})})
            await link.transfer(lottery.address, toWei(1), {from: defaultAccount})
            let transaction = await lottery.endLottery(seed, {from: defaultAccount})
            let requestId = transaction.receipt.rawLogs[3].topics[0]
            await vrfCoordinatorMock.callBackWithRandomness(requestId, '3', lottery.address, {from: defaultAccount})
            let recentWinner = await lottery.recentWinner()
            assert.equal(recentWinner, player1)
        })
    })
})