require('dotenv').config();
import Web3 from "web3";

let web3;

// conditional rendering in browser OR server 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // we're in the browser and metamask is running 
    window.ethereum.request({ 
        method: "eth_requestAccounts"
    });
    web3 = new Web3(window.ethereum);
} else {
    // we're on the server OR the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        process.env.NETWORK_API
    ); 
    web3 = new Web3(provider);
}

export default web3; 
