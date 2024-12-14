require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    // two params: seed phrase, network API 
    process.env.SEED_PHRASE,
    process.env.NETWORK_API
); 

const web3 = new Web3(provider);

const deploy = async () => {
    // get list of accounts since one seed phrase can generate many accounts
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account:', accounts[0]);

    // deploy the contract using first account
    const deployedContract = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' }) 
    
    console.log('Contract Address:', deployedContract.options.address);

    // to prevent a hanging deployment, stop the engine after all deployed
    provider.engine.stop();
    console.log('Engine stopped, contract deployed!')
};

deploy();
