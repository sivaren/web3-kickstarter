import React from 'react';
import Layout from '../../components/Layout';
import { Card, Grid, Button } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import campaignInstance from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

export const getServerSideProps = async (context) => {
    const campaign = campaignInstance(context.query.address);
    let campaignSummary = await campaign.methods.getSummary().call();
    campaignSummary = {
        address: context.query.address,
        minimumContribution: campaignSummary["0"].toString(),
        balance: campaignSummary["1"].toString(),
        requestsCount: campaignSummary["2"].toString(),
        approversCount: campaignSummary["3"].toString(),
        manager: campaignSummary["4"],
    };
    
    console.log(campaignSummary);

    return {
        props: { campaignSummary }
    };
};

const renderCards = (campaignSummary) => {
    const {
        minimumContribution,
        balance,
        requestsCount,
        approversCount,
        manager,
    } = campaignSummary;
    
    const items = [
        {
            header: manager,
            meta: 'Address of Manager',
            description: 'The manager created this campaign and can create requests to withdraw money',
            style: { overflowWrap: 'break-word' },
        },
        {
            header: minimumContribution,
            meta: 'Minimum Contribution (wei)',
            description: 'You must contribute at least this much wei to become an approver',
            style: { overflowWrap: 'break-word' },
        },
        {
            header: requestsCount,
            meta: 'Number of Requests',
            description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers',
            style: { overflowWrap: 'break-word' },
        },
        {
            header: approversCount,
            meta: 'Number of Approvers',
            description: 'Number of people who have already donated to this campaign',
            style: { overflowWrap: 'break-word' },
        },
        {
            header: web3.utils.fromWei(balance, 'ether'),
            meta: 'Campaign Balance (ether)',
            description: 'The balance is how much money this campaign has left to spend',
            style: { overflowWrap: 'break-word' },
        },
    ]

    return <Card.Group items={items} />
};

const ShowCampaign = ({ campaignSummary }) => {
    return (
        <Layout>
            <h3>Show Campaign</h3>

            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        { renderCards(campaignSummary) }
                    </Grid.Column>

                    <Grid.Column width={6}>
                        <ContributeForm address={campaignSummary.address} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link route={`/campaigns/${campaignSummary.address}/requests`}>
                            <a>
                                <Button primary>View Requests</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
};

export default ShowCampaign;
