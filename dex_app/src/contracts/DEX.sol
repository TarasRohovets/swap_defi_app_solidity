pragma solidity 0.6.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DecetralizedExchange {
    using SafeMath for uint256;
    IERC20 generic_token;

    uint256 public totalLiquidity;

    mapping(address => uint256) public liquidity;

    constructor(address token_addr) public {
        generic_token = IERC20(token_addr);
    }

    function initialize(uint256 tokens) public payable returns (uint256) {
        require(totalLiquidity == 0, "DecetralizedExchange - alredy has liquidity");
        totalLiquidity = address(this).balance;
        liquidity[msg.sender] = totalLiquidity;
        require(generic_token.transferFrom(msg.sender, address(this), tokens));
        return totalLiquidity;
    }

    // like liquidity pool
    function priceDeterminator(
        uint256 input_amount, // how much we want
        uint256 input_reserve, // ETH reserves
        uint256 output_reserve // Some tokens reserves
    ) public view returns (uint256) {
        uint256 input_amount_with_fee = input_amount.mul(997);
        uint256 numerator = input_amount_with_fee.mul(output_reserve);
        uint256 denominator = input_reserve.mul(100).add(input_amount_with_fee);
        return numerator / denominator;
    }

    //swap
    function ethToTokenSwap() public payable returns (uint256) {
        uint256 token_reserve = generic_token.balanceOf(address(this));
        uint256 tokens_bought = priceDeterminator(
            msg.value,
            address(this).balance.sub(msg.value),
            token_reserve
        );
        require(generic_token.transfer(msg.sender, tokens_bought));
        return tokens_bought;
    }

    //swap
    function tokenToEthSwap(uint256 tokens) public returns (uint256) {
        uint256 token_reserve = generic_token.balanceOf(address(this));
        uint256 eth_bought = priceDeterminator(
            tokens,
            token_reserve,
            address(this).balance
        );
        msg.sender.transfer(eth_bought);
        require(generic_token.transferFrom(msg.sender, address(this), tokens));
        return eth_bought;
    }

    function depositFunds() public payable returns (uint256) {
        uint256 eth_reserve = address(this).balance.sub(msg.value);
        uint256 token_reserve = generic_token.balanceOf(address(this));
        uint256 token_amount = (msg.value.mul(token_reserve) / eth_reserve).add(
            1
        );
        uint256 liquidity_minted = msg.value.mul(totalLiquidity) / eth_reserve;
        liquidity[msg.sender] = liquidity[msg.sender].add(liquidity_minted);
        totalLiquidity = totalLiquidity.add(liquidity_minted);
        require(generic_token.transferFrom(msg.sender, address(this), token_amount));
        return liquidity_minted;
    }
     
    
    function withdrawFunds(uint256 amount) public returns (uint256, uint256) {
        uint256 token_reserve = generic_token.balanceOf(address(this));
        uint256 eth_amount = amount.mul(address(this).balance) / totalLiquidity;
        uint256 token_amount = amount.mul(token_reserve) / totalLiquidity;
        liquidity[msg.sender] = liquidity[msg.sender].sub(eth_amount);
        totalLiquidity = totalLiquidity.sub(eth_amount);
        msg.sender.transfer(eth_amount);
        require(generic_token.tranfer(msg.sender, token_amount));
        return (eth_amount, token_amount)
    }
}
