pragma solidity ^0.5.0;

import '../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
//import 'github.com/OpenZeppelin/zeppelin-solidity/contracts/lifecycle/Pausable.sol';

/** @title Universal Block Income (UBI) */
contract UBI is Pausable {
    uint payTime; //This is the total time the user has to claim a new UBI adding to the time taken by the user when claiming the UBI last time
    uint claimWaitSeconds = 5; //24 Hours for PROD i.e.86400 seconds, 5 seconds are mentioned for testing purpose
    uint beneficiaryCount; //No. Of people who claimed the UBI
    uint interest; //ROI received on investing in foundation capital.
    uint public deposits; //Must be set to private for PROD.Deposits are teh amount donated to foundation capital.
    address private agent;// Agent Address
    mapping(address => bool) public beneficiaries; //Must be set to Private for PROD. Beneficiaries claim the UBI.

    constructor() public{
        agent = msg.sender;
        updateClaimTime();
    }
    event payOnTime(
        uint payTime
    );
    event withdrawCorrectAmount(
        uint interest
    );
    /** @dev Updates a time, when a claim is made with additional 24 hours
      *  now = current block timestamp
      *  claimWaitSeconds is specified in the variables on the top
      */
    function updateClaimTime() public {
        payTime = now + claimWaitSeconds;
    }
    /** @dev donor can deposit an amount to an account accessible by the beneficiaries
      */
    function deposit()
    external //Only people from Outside can call It.
    whenNotPaused()
    payable {
        deposits += msg.value;
        interest += (msg.value * 2) / 100;
    }
    /** @dev adds a UBI beneficiary to a mapping
      *  adds a beneficiary if the beneficiary isn't in the mapping yet
      *  beneficiaryCount is number of beneficiaries
      *  @param beneficiary address of beneficiary
      */
    function addBeneficiary(address payable beneficiary) external onlyAgent() whenNotPaused() payable {
        if (beneficiaries[beneficiary] == false){
            beneficiaryCount += 1;
        }
        beneficiaries[beneficiary] = true;
    }
    /** @dev Beneficiary can withdraw her/his share of the UBI
      *  interest available in deposit account is divided by the count of beneficiaries
      *  time of claim is updated, that beneficiaries can't claim multiple times in 24 hours
      *  beneficiary count is reset
      */
    function withdraw() public onlyOnPayDay() whenNotPaused() onlyBeneficiary() {
        beneficiaries[msg.sender] = false;
        msg.sender.transfer(2000000000000000000); //Arbitrary Number which can be replaced by an
        //Interest Function after dividing the total interest among number of beneficiaries.
        //Also gas fee can be deducted from the interest earned.
        updateClaimTime();
        beneficiaryCount -= 1;
        emit payOnTime(payTime);
        emit withdrawCorrectAmount(interest);
    }
    /** @dev defines owner of contract
      */
    modifier onlyAgent(){
        require(msg.sender == agent, "Ony Agent");
        _;
    }
    /** @dev defines who is a beneficiary
      */
    modifier onlyBeneficiary() {
        require(beneficiaries[msg.sender] == true, "Only Beneficiary");
        _;
    }
    /** @dev defines when future withdrawal will be possible
      */
    modifier onlyOnPayDay() {
        require(now > payTime, "onlyOnPayDay");
        _;
    }
}

