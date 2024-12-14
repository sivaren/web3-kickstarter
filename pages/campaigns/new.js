import React, { useState } from 'react';
import { Input, Button, Form, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

const NewCampaign = () => {
    const [minContribution, setMinContribution] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(minContribution)
                .send({
                    from: accounts[0]
                });
            
            Router.pushRoute('/');
        } catch (err) {
            setErrorMsg(err.message);
        }
        setIsLoading(false);
    };
    
    return (
        <Layout>
            <h3>Create a Campaign</h3> 

            <Form onSubmit={onSubmit} error={!!errorMsg} >
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input 
                        label="wei" 
                        labelPosition="right" 
                        value={minContribution}
                        onChange={(e) => setMinContribution(e.target.value)}
                    />
                </Form.Field>

                <Message 
                    error header="Oops!"
                    content={errorMsg}
                />
                <Button primary loading={isLoading}>Create!</Button>
            </Form>
        </Layout>
    );
}

export default NewCampaign;
