const DummyData = artifacts.require("DummyData");

module.exports = function (deployer, network, accounts) {
    const ada = 123;
    const parsel = 456;
    const verim = 10;
    const kisi = "Furkan";
    const ekim = 2024;
    const hektar = 20;

    deployer.deploy(DummyData, ada, parsel, verim, kisi, ekim, hektar, { from: accounts[0] });
};
