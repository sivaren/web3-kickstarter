const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider({
    logging: { quiet: true }
}));

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = deployedCampaigns[0];

    campaign = new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();

        assert.equal(manager, accounts[0]);
    });
    
    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        let isPassed;
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '99'
            });
        } catch (err) {
            isPassed = true;
        }

        assert(isPassed);
    });

    it('allows a manager to make a payment requets', async () => {
        await campaign.methods.createRequest(
            'Buy batteries', '100', accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();

        assert.equal(request.description, 'Buy batteries');
    });

    it('process requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        }); 

        await campaign.methods.createRequest(
            'Accounts[2]', web3.utils.toWei('5', 'ether'), accounts[2]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });
        
        let initBalance = await web3.eth.getBalance(accounts[2]);
        initBalance = web3.utils.fromWei(initBalance, 'ether');
        initBalance = parseFloat(initBalance);

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let finBalance = await web3.eth.getBalance(accounts[2]);
        finBalance = web3.utils.fromWei(finBalance, 'ether');
        finBalance = parseFloat(finBalance);

        const diffBalance = finBalance - initBalance;

        assert(diffBalance > 4);
    });
});
