// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DigiToken is ERC20, ReentrancyGuard, Ownable {
    uint256 public constant MAX_CLAIMABLE_PER_WEEK = 100 * 10**18; 
    mapping(address => uint256) public lastClaimed;
    mapping(address => uint256) public weeklyClaimAmount;

    constructor() ERC20("DigiToken", "DIGI") Ownable(msg.sender) {}

    function claimTokens(uint256 amount) public nonReentrant {
        require(amount <= MAX_CLAIMABLE_PER_WEEK, "Cannot claim more than 100 tokens per week");
        require(balanceOf(msg.sender) < MAX_CLAIMABLE_PER_WEEK, "Your balance is already 100 or more");
        require(block.timestamp - lastClaimed[msg.sender] > 1 weeks || lastClaimed[msg.sender] == 0, "Already claimed this week");
        require(weeklyClaimAmount[msg.sender] + amount <= MAX_CLAIMABLE_PER_WEEK, "Claim exceeds weekly limit");
        
        if(block.timestamp - lastClaimed[msg.sender] > 1 weeks) {
            // reset the amount for a new week
            weeklyClaimAmount[msg.sender] = 0;
        }

        weeklyClaimAmount[msg.sender] += amount;
        lastClaimed[msg.sender] = block.timestamp;
        _mint(msg.sender, amount);
    }
}
