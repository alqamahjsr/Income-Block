import React, { Component, Fragment } from "react";
import { MetaMaskButton } from 'rimble-ui';
import { Button } from 'rimble-ui';
import { QR } from 'rimble-ui';
import smartphone from './img/smartphone.svg';

class MyComponent extends Component {

  state = {
      foundationCapital: 14,
      beneficiaries: 1,
      interest: 0,
      claimed: false,
      claimTime: "",
      claimCount: 0,
      claimAmount: 14.99,
      isButtonDisabled: false,
      deposited: false,
      connected: false,
      beneficiaryAdded: false,
      loading: true,
      showDonateBox:false,

    };

  handleClick() {
      console.log('this is:', this);
  }

 foundationCapital = async () => {
   const { contract, web3 } = this.props;

     //Get balance of foundation account
     var balance = await web3.eth.getBalance(contract.options.address); //Will give value of the foundation capital in.
     const num = web3.utils.fromWei(balance, "ether");
     this.setState({ foundationCapital: num});
     //const balance = await contract.methods.balanceOf().call({from: accounts[0]});
     //const numBN = web3.utils.toBN(balance);

     //Calculate interest and share for each beneficiary
     this.setState(({ interest }) => ({ interest : this.state.foundationCapital * 0.1499}));
     if(this.state.beneficiaries > 0){
         this.setState(({ interest }) => ({ claimAmount : this.state.interest / this.state.beneficiaries}));
     }

 }

  componentDidMount = async () => {
    await this.foundationCapital();
  };

  //connect to MetaMask
  connectMM = async () => {
    await window.ethereum.enable();//await needs async
    this.setState({ connected: true });
  }

  //add a beneficiary to the mapping
  addBeneficiary = async () => {
    const { accounts, contract } = this.props;
    console.log(accounts); //bug: account empty on conditional rendering
    await contract.methods.addBeneficiary(accounts[0]).send({ from: accounts[0], gasLimit: 100000 });
    this.setState({ beneficiaryAdded: true });
  }

  //beneficiary can withdraw UBI amount
  withdraw = async () => {

    //Trigger beneficiary withdrawal
    const { accounts, contract } = this.props;
    await contract.methods.withdraw().send({ from: accounts[0], gasLimit: 100000 })

    //Increase the beneficiary count and disable button for 24hours
    this.setState(({ claimCount, claimed, isButtonDisabled }) => ({ claimCount : claimCount + 1, claimed : true, isButtonDisabled: true}))

    //Display time of last claim
    let date = new Date();
    let timestamp = date.toTimeString();
    this.setState(({ claimTime }) => ({ claimTime : timestamp}))
    this.state.beneficiaries += 1;
  }

  //deposit amount to UBI contract address
  deposit = async () => {
    const { accounts, contract, web3 } = this.props;
    await contract.methods.deposit().send({ value: web3.utils.toBN(5000000000000000000), from: accounts[0], gasLimit: 100000});
    await this.foundationCapital();
    this.setState({ deposited: true, showDonateBox: false });
  }


  renderConnectionBox(){
    if(window.ethereum.selectedAddress) return null;
    return (
         <div id="step1" className="floatright bluebox">
         <h2>Connect with MetaMask to claim your Universal Block Income</h2>
         <MetaMaskButton onClick={this.connectMM} >Connect with MetaMask</MetaMaskButton>
         </div>
      )
  }

  renderRegistrationBox(){
    if(this.state.beneficiaryAdded) return null;
    if(!window.ethereum.selectedAddress) return null;
    const { accounts } = this.props;
     return (
          <div id="step3" className="floatright bluebox">
          <h2>To claim your share...</h2><img className="phone" src={smartphone} alt="phone"></img>
          <p>...register this account: <small>{accounts}</small> to the beneficiary database. Registration is only necessary once. If you encounter a error reload the page.</p>
          <Button onClick={this.addBeneficiary}>Register</Button>
          </div>
      );
  }

  renderClaimBox(){
      if(!this.state.beneficiaryAdded) return null;
      const { accounts } = this.props;
      return (
            <div id="step2" className="floatright bluebox">
            <h2>Your share</h2><img className="phone" src={smartphone} alt="phone"></img>
            <p>Today's interest of {this.state.interest} ETH, divided by {this.state.beneficiaries} beneficiaries:  </p>
            <p>With this account <small>{accounts}</small> you can claim approx. <span className="bold"> {this.state.claimAmount} ETH</span>, today.</p>
            <Button onClick={this.withdraw} disabled={this.state.isButtonDisabled}>Claim it</Button>
            <p>{this.state.claimed ? "See you in 24 hours again! Last claim on " : " "}{this.state.claimTime} </p>
            </div>
      );
  }

  renderDonateBox(){
      const { contract } = this.props;
      if(!this.state.showDonateBox) return null;
      return(
          <div id="step4" className="floatright bluebox">
          <h2>Donate to this address</h2>
          <div className="center"><QR value={contract.options.address} /></div>
          <small>{contract.options.address}</small>
          <p> </p>
          <Button onClick={this.deposit}>Donate 5 ETH</Button>
          </div>
      );
  }

  render() {
      return (
        <Fragment>
              <h1>#UniversalBlockIncome</h1>
              <div className="floatleft">
                <h2 className="tcenter">Current foundation assets: <span className="cyan capital">{this.state.foundationCapital} ETH</span></h2>
                <h3>You need money? Claim it. Every 24h.</h3>
                <h3>You want to help? <a href="#" onClick={() => this.setState({ showDonateBox: true})}>Donate</a>. Temporary or permanently.</h3>
              </div>
              {this.renderConnectionBox()}
              {this.renderRegistrationBox()}
              {this.renderClaimBox()}
              {this.renderDonateBox()}

        </Fragment>
      );
   }
}

export default MyComponent;
