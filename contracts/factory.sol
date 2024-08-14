//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./dummy.sol";

contract Factory{
    event eFactory(address contractAddress, string kisi);
    
    function deployDummy( 
        uint ada, 
        uint parsel, 
        uint verim, 
        string memory kisi, 
        uint ekim, 
        uint hektar
    ) external payable returns(address){
        
        DummyData newContract = new DummyData{value: msg.value}(ada, parsel, verim, kisi, ekim, hektar);

        emit eFactory(address(newContract), kisi);

        return address(newContract);
    }
}
