// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DummyData {

    struct Ekin {
        uint ada;
        uint parsel;
        uint verim;
        uint ekim;
        uint hektar;
        uint kalan;
        string kisi;
    }

    struct ProductInfo {
        string productType;
        uint quantity;
    }

    mapping(string => Ekin) private urunler;
    address public factory;
    string[] public productTypes;

    event Sell(string indexed product, uint kalan);
    event ProductAdded(string indexed productType, string kisi);

    constructor(address factoryAddress) payable {
    factory = factoryAddress;
    }


    modifier onlyFactory() {
        require(msg.sender == factory, "Only the factory can call this function");
        _;
    }

    function addProduct(
        string memory productType, 
        uint ada, 
        uint parsel, 
        uint verim, 
        string memory kisi,  
        uint ekim, 
        uint hektar
    ) external onlyFactory {
        require(bytes(productType).length > 0, "Product type cannot be empty");
        require(urunler[productType].ada == 0 && urunler[productType].parsel == 0, "Product already exists in a field");

        urunler[productType] = Ekin(ada, parsel, verim, ekim, hektar, calculateUrun(verim, hektar), kisi);
        productTypes.push(productType);

        emit ProductAdded(productType, kisi);
    }

    function queryProductDetails(string memory productType) 
        external 
        view 
        returns (
            uint ada, 
            uint parsel, 
            uint verim, 
            uint ekim, 
            uint hektar, 
            uint kalan, 
            string memory kisi
        ) 
    {
        Ekin memory ekin = urunler[productType];
        return (
            ekin.ada, 
            ekin.parsel, 
            ekin.verim, 
            ekin.ekim, 
            ekin.hektar, 
            ekin.kalan, 
            ekin.kisi
        );
    }

    function calculateUrun(uint verim, uint hektar) internal pure returns (uint) {
        return verim * hektar;
    }

    function satis(string memory productType, uint satisAmount) external onlyFactory returns (uint) {
        require(satisAmount <= urunler[productType].kalan, "Insufficient remaining product");
        urunler[productType].kalan -= satisAmount;
        emit Sell(productType, urunler[productType].kalan);
        return urunler[productType].kalan;
    }

    function getAllProductTypes() external view returns (string[] memory) {
        string[] memory productSummaries = new string[](productTypes.length);
        for (uint i = 0; i < productTypes.length; i++) {
            string memory productType = productTypes[i];
            uint remaining = urunler[productType].kalan;
            productSummaries[i] = string(abi.encodePacked(productType, "(remaining: ", uintToString(remaining), ")"));
        }
        return productSummaries;
    }

    function uintToString(uint v) internal pure returns (string memory str) {
        if (v == 0) {
            return "0";
        }
        uint maxLen = 78;
        bytes memory reversed = new bytes(maxLen);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i); // i is the length of the string
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1]; // reverse it
        }
        str = string(s);
    }
}
