import React, { useState } from 'react';
import { Button, Table } from 'semantic-ui-react'
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import campaignInstance from '../../../ethereum/campaign';

export const getServerSideProps = async (context) => {
    const { address } = context.query;
    const campaign = campaignInstance(address);

    let requestsCount = await campaign.methods.getRequestsCount().call();
    requestsCount = parseInt(requestsCount);

    let approversCount = await campaign.methods.approversCount().call();
    approversCount = approversCount.toString();

    let requests = await Promise.all(
        Array(requestsCount)
            .fill()
            .map((element, index) => {
                return campaign.methods.requests(index).call();
            })
    );
    requests = requests.map((element, index) => {
        return {
            description: element.description,
            value: element.value.toString(),
            recipient: element.recipient,
            complete: element.complete,
            approvalCount: element.approvalCount.toString()
        };
    });

    console.log(requests);

    return {
        props: { address, requests, requestsCount, approversCount }
    };
};

const renderRows = (address, requests, approversCount) => {
    return (
        requests.map((request, index) => {
            return (
                <RequestRow 
                    key={index}
                    id={index}
                    request={request}
                    address={address}
                    approversCount={approversCount}
                />
            )
        })
    );
};

const RequestsIndex = ({ address, requests, requestsCount, approversCount }) => {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
        <Layout>
            <h3>requests</h3>
            <Link route={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary floated="right" style={{ marginBottom: 10 }}>
                        Add Request
                    </Button>
                </a>
            </Link>

            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {renderRows(address, requests, approversCount)}
                </Body>
            </Table>
            <div>Found {requestsCount} requests.</div>
        </Layout>
    );
}

export default RequestsIndex;
