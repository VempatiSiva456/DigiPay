// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DigiToken is ERC20, ReentrancyGuard, Ownable {
    uint256 public constant MAX_CLAIMABLE_PER_WEEK = 100 * 10**18; // 100 tokens
    mapping(address => uint256) public lastClaimTimestamp;
    mapping(address => uint256) public amountClaimedThisWeek;

    constructor() ERC20("DigiToken", "DIGI") Ownable(msg.sender){}

    function getCurrentWeek() public view returns (uint256) {
        return block.timestamp / 1 weeks;
    }

    function claimTokens(uint256 amount) public nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(amount <= MAX_CLAIMABLE_PER_WEEK, "Cannot claim more than 100 tokens per week");

        uint256 currentWeek = getCurrentWeek();
        if (lastClaimTimestamp[msg.sender] / 1 weeks < currentWeek) {
            // It's a new week, reset the claimed amount
            amountClaimedThisWeek[msg.sender] = 0;
        }

        // Check how much the user has already claimed this week
        uint256 alreadyClaimed = amountClaimedThisWeek[msg.sender];
        require(alreadyClaimed + amount <= MAX_CLAIMABLE_PER_WEEK, "Weekly claim limit exceeded");

        // Update the claimed amount and timestamp
        amountClaimedThisWeek[msg.sender] = alreadyClaimed + amount;
        lastClaimTimestamp[msg.sender] = block.timestamp;

        // Mint the tokens to the user
        _mint(msg.sender, amount);
    }
}
