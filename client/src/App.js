import React, { Component } from 'react';
import UBIContract from "./contracts/UBI.json";
import getWeb3 from "./utils/getWeb3";
import MyComponent from "./MyComponent";

import "./App.css";

class App extends Component {
    state = {
        web3: null,
        accounts: [],
        contract: null,
        loading: true
    };

    componentDidMount = async () => {
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
    
          // Use web3 to get the user's accounts (e.g. Metamask account).
          const accounts = await web3.eth.getAccounts();
    
          // Get the contract instance.
          //const networkId = await web3.eth.net.getId();
          const networkId = 5777;
          const deployedNetwork = UBIContract.networks[networkId];
          const contract = new web3.eth.Contract(
            UBIContract.abi,
            deployedNetwork && deployedNetwork.address
          );
    
          this.setState({ accounts, web3, contract, loading: false })
    
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
      };
      render() {
        const { contract, web3, accounts, loading } = this.state;
        if(loading) {
          return 'Loading...';
        }
    
        return (
          <div className="App">
            <div className="container">
                <MyComponent
                    web3={web3}
                    contract={contract}
                    accounts={accounts}
                />
            </div>
          </div>
          //end App
    
    
    
        );
      }
}

export default App;
