// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./dummy.sol";

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

    function deployDummy( 
        uint ada, 
        uint parsel, 
        uint verim, 
        string memory kisi, 
        uint ekim, 
        uint hektar
    ) external payable onlyOfficial returns(address) {
        
        DummyData newContract = new DummyData(ada, parsel, verim, kisi, ekim, hektar);

        emit eFactory(address(newContract), kisi);

        return address(newContract);
    }

    function changeOfficial(address newOfficial) external onlyOfficial {
        require(newOfficial != address(0), "New official cannot be the zero address");
        emit OfficialChanged(official, newOfficial);
        official = newOfficial;
    }
}
