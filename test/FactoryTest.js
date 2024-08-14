const hre = require("hardhat");

async function main() {
    // Deploy the Factory contract
    const Factory = await hre.ethers.getContractFactory("Factory");
    const factory = await Factory.deploy();
    await factory.deployed();
    console.log("Factory deployed to:", factory.address);

    // Parameters to deploy a DummyData contract via the Factory
    const ada = 123;
    const parsel = 456;
    const verim = 500;
    const kisi = "Furkan";
    const ekim = 2024;
    const hektar = 500;

    // Deploy a DummyData contract using the Factory's deployDummy function
    const tx = await factory.deployDummy(ada, parsel, verim, kisi, ekim, hektar);
    const receipt = await tx.wait();

    // Debug: Print the entire transaction receipt to inspect it
    console.log("Transaction receipt:", receipt);

    // Check if the Factory event exists in the receipt
    const event = receipt.events?.find(event => event.event === "eFactory");

    if (!event) {
        console.error("Factory event not found!");
        return;
    }

    // Safely access the contract address from the event arguments
    const newContractAddress = event.args?.contractAddress;
    console.log("DummyData deployed to:", newContractAddress);

    // Connect to the newly deployed DummyData contract
    const DummyData = await hre.ethers.getContractAt("DummyData", newContractAddress);
    
    // Verify the initial values
    console.log("queryAda:", await DummyData.queryAda());
    console.log("queryParsel:", await DummyData.queryParsel());
    console.log("queryKisi:", await DummyData.queryKisi());
    console.log("Initial kalan:", await DummyData.kalan());

    // Perform a transaction and verify the state change
    const satisTx = await DummyData.satis(100, { gasLimit: 3000000 });
    await satisTx.wait();
    console.log("kalan after satis:", await DummyData.kalan());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
