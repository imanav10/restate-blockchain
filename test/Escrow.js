const { expect } = require('chai')
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer, seller, inspector, lender
    let realEstate, escrow

    beforeEach(async() => {
        [buyer,seller,inspector,lender] = await ethers.getSigners() 

        // Deploy
        const RealEstate = await ethers.getContractFactory('RealEstate')
        realEstate = await RealEstate.deploy()

        // Mint 
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmXstmQpTKxSKLrSJYNobPTgVKCFrT1cDKEVfwCjB7MaDr?filename=img1.jpg")
        await transaction.wait()

        const Escrow = await ethers.getContractFactory('Escrow')
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        )
        // Approve
        transaction = await realEstate.connect(seller).approve(escrow.address, 1)
        await transaction.wait()

        // List property
        transaction = await escrow.connect(seller).list(1, buyer.address, tokens(10), tokens(5))
        await transaction.wait()
    })

    describe('deployment', () => {
        it('Returns NFT address',async() => {
            let result  = await escrow.nftAddress()
            expect(result).to.be.equal(realEstate.address);
        })
    
        it('Returns seller', async() => {
            result  = await escrow.seller()
            expect(result).to.be.equal(seller.address);
        })
    
        it('Returns inspector',async() =>{
            result  = await escrow.inspector()
            expect(result).to.be.equal(inspector.address);
        })
    
        it('Returns lender',async() =>{
            result  = await escrow.lender()
            expect(result).to.be.equal(lender.address);
        })
    })

    describe('listing', () => {
        it('Updates the ownership',async() => {
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address)
        })
        it('Updates as listed',async() => {
            const result = await escrow.isListed(1)
            expect(result).to.be.equal(true)
        })
        it('Returns the buyer',async() => {
            const result = await escrow.buyer(1)
            expect(result).to.be.equal(buyer.address)
        })
        it('Returns the Purchase Price',async() =>{
            const result = await escrow.purchasePrice(1)
            expect(result).to.be.equal(tokens(10))
        })
        it('Returns the Escrow Amount',async() =>{
            const result = await escrow.escrowAmount(1)
            expect(result).to.be.equal(tokens(5))
        })
        
    })

    describe('onlySeller modifier', () => {
        it('should allow the seller to call sellerAction', async () => {
            await expect(escrow.connect(seller).sellerAction())
                .to.not.be.revertedWith("Only seller can call this");
        });
    
        it('should not allow non-seller to call sellerAction', async () => {
            await expect(escrow.connect(buyer).sellerAction())
                .to.be.revertedWith("Only seller can call this");
        });
    });

    describe('Deposits', () => {
        it('Updates Curr Balance', async () => {
            const transaction = await escrow.connect(buyer).depositEarnest(1,{value: tokens(5)})
            await transaction.wait()
            const result = await escrow.getBalance()
            expect(result).to.be.equal(tokens(5))
        });
    });

    describe('Inspection', () => {
        it('Inspection Status', async () => {
            const transaction = await escrow.connect(inspector).updateInspection(1,true)
            await transaction.wait()
            const result = await escrow.inspectionPassed(1)
            expect(result).to.be.equal(true)
        });
    });

    describe('Approval', () => {
        it('Update Approval', async () => {
            let transaction = await escrow.connect(buyer).approveSale(1)
            await transaction.wait()
            transaction = await escrow.connect(seller).approveSale(1)
            await transaction.wait()
            transaction = await escrow.connect(lender).approveSale(1)
            await transaction.wait()
            expect(await escrow.approval(1, buyer.address)).to.be.equal(true)
            expect(await escrow.approval(1, seller.address)).to.be.equal(true)
            expect(await escrow.approval(1, lender.address)).to.be.equal(true)
        });
    });
    describe('Sale', () => {
        beforeEach(async () => {
            let transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) })
            await transaction.wait()

            transaction = await escrow.connect(inspector).updateInspection(1, true)
            await transaction.wait()

            transaction = await escrow.connect(buyer).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(seller).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(lender).approveSale(1)
            await transaction.wait()

            await lender.sendTransaction({ to: escrow.address, value: tokens(5) })

            transaction = await escrow.connect(seller).finalizeSale(1)
            await transaction.wait()
        })

        it('Updates ownership', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address)
        })

        it('Updates balance', async () => {
            expect(await escrow.getBalance()).to.be.equal(0)
        })
    })
});