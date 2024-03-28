// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TransactionRecorder {
    IERC20 public digiToken;
    event TransactionRecorded(address indexed sender, address indexed recipient, uint amount, string note, string email);

    constructor(address _digiTokenAddress) {
        digiToken = IERC20(_digiTokenAddress);
    }

    function sendDigiTokens(address recipient, uint amount, string memory note, string memory email) public {
        require(digiToken.transferFrom(msg.sender, recipient, amount), "Token transfer failed");
        emit TransactionRecorded(msg.sender, recipient, amount, note, email);
    }
}
