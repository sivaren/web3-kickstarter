import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import factoryInstance from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

export const getServerSideProps = async () => {
    const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();
    console.log(campaigns);

    return {
        props: { campaigns }
    };
};

const renderCampaigns = (campaigns) => {
    const items = campaigns.map(address => {
        return {
            header: address,
            description: (
                <Link route={`/campaigns/${address}`}>
                    <a>View Campaign</a>
                </Link>
            ),
            fluid: true
        }
    });

    return <Card.Group items={items} /> 
}; 

export default ({ campaigns }) => {
    return (
        <Layout>
            <div>
                <h3>Open Campaigns</h3>

                <Link route="/campaigns/new">
                    <a className="item">
                        <Button 
                            floated="right"
                            content="Create Campaign"
                            icon="add circle"
                            primary={true}
                        />
                    </a>
                </Link>

                {renderCampaigns(campaigns)}
            </div>
        </Layout>
    );
}
