// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditoriasContract {
    uint256 public dateCreated; // Timestamp when the contract was deployed
    bool public isValid;        // Validity flag

    // Constructor to set the date and validity
    constructor(bool _initialValidity) {
        dateCreated = block.timestamp; // Set the creation date
        isValid = _initialValidity;    // Set the initial validity
    }

    // Function to get the creation date
    function getCreationDate() public view returns (uint256) {
        return dateCreated;
    }

    // Function to update the validity status
    function setValidity(bool _isValid) public {
        isValid = _isValid;
    }
}
