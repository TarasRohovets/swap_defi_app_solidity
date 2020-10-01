pragma solidity 0.5.16;

import './XToken.sol';

contract YieldFarming {

    string name = 'Yield Farming';
    XToken public xtoken;
    address public owner;

    address[] public depositers;
    mapping(address => uint256) depositBalance;
    mapping(address => bool) hasDeposited;
    mapping(address => bool) isDepositing;

    constructor(XToken _xtoken) public {
        xtoken = _xtoken;
        owner = msg.sender;
    }

     // deposits tokens in its internal storage
    function depositTokens(uint256 _amount) public {
         require(_amount > 0, 'amount cant be 0');

         depositBalance[msg.sender] = _amount;

       // track if deposited
       if(!hasDeposited[msg.sender]){
           depositers.push(msg.sender);
       }

       //update depositing status
       isDepositing[msg.sender] = true;
       hasDeposited[msg.sender] = true;
    }

    // TODO add value and to params
    function withdrawTokens() public {
        // check balance
        uint256 balance = depositBalance[msg.sender];

        require(balance > 0, 'balance cannot be 0');

        // in case of failure revert transaction
        if(!msg.sender.send(balance))
            revert();

        depositBalance[msg.sender] = 0;

        isDepositing[msg.sender] = false;
        hasDeposited[msg.sender] = false;
    }

    function issueTokens() public {
        require(msg.sender == owner, 'caller must be owner');

        for(uint256 i = 0; i < depositers.length; i++){
            address recepient = depositers[i];
            uint256 balance = depositBalance[recepient];
            if(balance > 0) {
                xtoken.transfer(recepient, balance);
            }
        }
    }
}