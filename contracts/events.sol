// SPDX-License-Identifier: Unlicense

pragma solidity 0.8.24;

library Events {

    // Factory
    event eFactory(address indexed contractAddress, string kisi);
    event OfficialChanged(address indexed oldOfficial, address indexed newOfficial);

    // Dummy 
    event Sell(string indexed product, uint indexed kalan);
    event ProductAdded(string productType, string kisi);
    
}