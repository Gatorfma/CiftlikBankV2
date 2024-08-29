// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./dummy.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import "./events.sol";

contract Factory {
    address public official;

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

    // Function to deploy the DummyData contract using CREATE2 with only the kisi parameter
    function deployDummy(string memory kisi) external payable onlyOfficial returns(address) {
        bytes32 salt = generateSalt(kisi);

        // The bytecode of the DummyData contract, initializing it with the factory address only
        bytes memory bytecode = abi.encodePacked(
            type(DummyData).creationCode,
            abi.encode(address(this))  // Pass only the factory address
        );

        // Compute the address before deploying
        address predictedAddress = Create2.computeAddress(salt, keccak256(bytecode), address(this));
        address newContract = Create2.deploy(msg.value, salt, bytecode);

        // Check if the predicted address matches the deployed address
        require(newContract == predictedAddress, "Deployed address does not match the predicted address");

        emit Events.eFactory(newContract, kisi);

        return newContract;
    }

    // Function to compute the address of the contract
    function computeAddress(string memory kisi) external view returns (address) {
        bytes32 salt = generateSalt(kisi);

        bytes memory bytecode = abi.encodePacked(
            type(DummyData).creationCode,
            abi.encode(address(this))  // Pass only the factory address
        );

        return Create2.computeAddress(salt, keccak256(bytecode), address(this));
    }

    // Function to change the official
    function changeOfficial(address newOfficial) external onlyOfficial {
        require(newOfficial != address(0), "New official cannot be the zero address");
        emit Events.OfficialChanged(official, newOfficial);
        official = newOfficial;
    }

    // Function to perform a sale on a deployed DummyData contract
    function sellProduct(
        address dummyDataAddress,
        string memory productTypeToSell,
        uint saleAmount
    ) external onlyOfficial returns (uint) {
        DummyData dummyData = DummyData(dummyDataAddress);
        uint remainingAmount = dummyData.satis(productTypeToSell, saleAmount);
        return remainingAmount;
    }

    // New function to add a product to a deployed DummyData contract
    function addProductToDummy(
        address dummyDataAddress,
        string memory productType, 
        uint ada, 
        uint parsel, 
        uint verim, 
        string memory kisi,  
        uint ekim, 
        uint hektar
    ) external onlyOfficial {
        DummyData dummyData = DummyData(dummyDataAddress);
        dummyData.addProduct(productType, ada, parsel, verim, kisi, ekim, hektar);
    }
}
