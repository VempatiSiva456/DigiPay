// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TransactionRecorder {
    event TransactionRecorded(address indexed sender, address indexed recipient, uint amount, string note, string email);

    function sendETH(address payable recipient, string memory note, string memory email) public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        (bool sent, ) = recipient.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit TransactionRecorded(msg.sender, recipient, msg.value, note, email);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

