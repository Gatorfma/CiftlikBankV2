// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./dummy.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract Factory {
    address public official;

    event eFactory(address contractAddress, string kisi);
    event OfficialChanged(address indexed oldOfficial, address indexed newOfficial);

    constructor() {
        official = msg.sender;  // Set the deployer as the official
    }

    modifier onlyOfficial() {
        require(msg.sender == official, "Only the official can call this function");
        _;
    }

    // Function to generate salt from kisi
    function generateSalt(string memory kisi) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(kisi));
    }

    // Function to deploy the DummyData contract using CREATE2 with the generated salt
    function deployDummy( 
        uint ada, 
        uint parsel, 
        uint verim, 
        string memory kisi, 
        uint ekim, 
        uint hektar
    ) external payable onlyOfficial returns(address) {
        
        bytes32 salt = generateSalt(kisi);

        // The bytecode of the DummyData contract
        bytes memory bytecode = abi.encodePacked(
            type(DummyData).creationCode,
            abi.encode(ada, parsel, verim, kisi, ekim, hektar, address(this))  // Pass the factory address
        );

        address newContract = Create2.deploy(msg.value, salt, bytecode);

        emit eFactory(newContract, kisi);

        return newContract;
    }

    // Function to compute the address of the contract
    function computeAddress(
        uint ada, 
        uint parsel, 
        uint verim, 
        string memory kisi, 
        uint ekim, 
        uint hektar
    ) external view returns (address) {
        bytes32 salt = generateSalt(kisi);

        bytes memory bytecode = abi.encodePacked(
            type(DummyData).creationCode,
            abi.encode(ada, parsel, verim, kisi, ekim, hektar, address(this))  // Pass the factory address
        );

        return Create2.computeAddress(salt, keccak256(bytecode), address(this));
    }

    function changeOfficial(address newOfficial) external onlyOfficial {
        require(newOfficial != address(0), "New official cannot be the zero address");
        emit OfficialChanged(official, newOfficial);
        official = newOfficial;
    }
}
