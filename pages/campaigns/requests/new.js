import React, { useState } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react'
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';
import campaignInstance from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

export const getServerSideProps = async (context) => {
    const { address } = context.query;

    return {
        props: { address }
    };
};

const RequestNew = ({ address }) => {
    const [desc, setDesc] = useState('');
    const [value, setValue] = useState('');
    const [recipient, setRecipient] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault;

        const campaign = campaignInstance(address);
        setIsLoading(true);
        setErrorMsg('');

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                desc, web3.utils.toWei(value, 'ether'), recipient
            ).send({
                from: accounts[0]
            });

            Router.pushRoute(`/campaigns/${address}/requests`)
        } catch (err) {
            setErrorMsg(err.message);
            console.log(err.message);
        }
        setIsLoading(false);
        // setDesc('');
        // setValue('');
        // setRecipient('');
    }

    return (
        <Layout>
            <Link route={`/campaigns/${address}/requests`}>
                <a>Back</a>
            </Link>

            <h3>Create a Request</h3>
            
            <Form onSubmit={onSubmit} error={!!errorMsg}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={recipient}
                        onChange={e => setRecipient(e.target.value)}
                    />
                </Form.Field>

                <Message error header="Oops!" content={errorMsg}/>
                <Button primary loading={isLoading}>Create!</Button>
            </Form>
        </Layout>
    );
}

export default RequestNew;
