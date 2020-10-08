pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GenericToken is ERC20 {
    constructor() public ERC20("GenericToken", "GTK") {
        _mint(msg.sender, 1000 * 10**18);
    }
}
