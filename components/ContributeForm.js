import React, { useState } from 'react'; 
import { Message, Button, Form, Input } from 'semantic-ui-react';
import campaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

const ContributeForm = ({ address }) => {
    const [inputVal, setInputVal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();

        const campaign = campaignInstance(address);
        setIsLoading(true);
        setErrorMsg('');

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(inputVal, 'ether')
            });

            Router.replaceRoute(`/campaigns/${address}`)
        } catch (err) {
            setErrorMsg(err.message);
            console.log(err.message);
        };
        setIsLoading(false); 
        setInputVal('');
    };

    return (
        <Form onSubmit={onSubmit} error={!!errorMsg} >
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input 
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    label="ether"
                    labelPosition='right'
                />
            </Form.Field>
            
            <Message error header="Oops!" content={errorMsg} />
            <Button primary loading={isLoading} >Contribute!</Button>
        </Form>
    );
};

export default ContributeForm;
