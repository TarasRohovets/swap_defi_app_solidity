pragma solidity 0.5.16;

import "./XToken.sol";

contract Swap {
    string public name = "Swap";
    XToken public xtoken;
    uint256 public rate = 100;

    event TokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokensSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(XToken _xtoken) public {
        xtoken = _xtoken;
    }

    function buyTokens() public payable {
        uint256 xTokenAmount = msg.value * rate;

        require(xtoken.balanceOf(address(this)) >= xTokenAmount);
        xtoken.transfer(msg.sender, xTokenAmount);

        emit TokensPurchased(msg.sender, address(xtoken), xTokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        require(xtoken.balanceOf(msg.sender) >= _amount);

        uint256 etherAmountToSell = _amount / rate;

        require(address(this).balance >= etherAmountToSell);

        xtoken.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmountToSell);

        emit TokensSold(msg.sender, address(xtoken), _amount, rate);
    }
}