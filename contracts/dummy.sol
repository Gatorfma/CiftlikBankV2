//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DummyData {

    struct Ekin {
        uint ada;
        uint parsel;
        uint verim;
        string kisi;
        uint ekim;
        uint hektar;
    }

    uint public kalan;
    Ekin private newEkin;

    event Sell(uint kalan);

    constructor(
        uint ada, 
        uint parsel, 
        uint verim, 
        string memory kisi, 
        uint ekim, 
        uint hektar
    ) payable {
        newEkin = Ekin(ada, parsel, verim, kisi, ekim, hektar);
        kalan = calculateUrun();
    }

    function queryAda() external view returns (uint) {
        return newEkin.ada;
    }

    function queryParsel() external view returns (uint) {
        return newEkin.parsel;
    }

    function queryVerim() external view returns (uint) {
        return newEkin.verim;
    }

    function queryKisi() external view returns (string memory) {
        return newEkin.kisi;
    }

    function queryEkim() external view returns (uint) {
        return newEkin.ekim;
    }

    function queryHektar() external view returns (uint) {
        return newEkin.hektar;
    }

    function calculateUrun() internal view returns (uint) {
        return newEkin.hektar * newEkin.verim;
    }

    function satis(uint satisAmount) external returns (uint) {
        require(satisAmount <= kalan, "Insufficient remaining product");
        kalan -= satisAmount;
        emit Sell(kalan);
        return kalan;
    }
}