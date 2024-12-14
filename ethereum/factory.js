require('dotenv').config();
import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factoryInstance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    process.env.CONTRACT_FACTORY_ADDRESS
);

export default factoryInstance;
