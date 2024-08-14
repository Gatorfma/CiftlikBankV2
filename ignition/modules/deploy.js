require("@nomiclabs/hardhat-ethers");
const fs = require("fs");
const path = require("path");

const deploymentsFile = path.join(__dirname, "deployments.json");

async function deployIfNotDeployed(contractName, args, deployer) {
    let contractAddress;

    // Check if the deployments file exists
    if (fs.existsSync(deploymentsFile)) {
        const deployments = JSON.parse(fs.readFileSync(deploymentsFile));

        // Check if this contract is already deployed
        if (deployments[contractName]) {
            contractAddress = deployments[contractName];
            console.log(`${contractName} is already deployed at ${contractAddress}`);
        }
    }

    // Deploy the contract if it hasn't been deployed
    if (!contractAddress) {
        console.log("Deploying the contract...");
        const Contract = await hre.ethers.getContractFactory(contractName);
        const contract = await Contract.deploy(...args);
        await contract.deployed();

        // Save the contract address
        fs.writeFileSync(
            deploymentsFile,
            JSON.stringify({ [contractName]: contract.address }, null, 2)
        );

        console.log(`${contractName} deployed to: ${contract.address}`);
        contractAddress = contract.address;
    }

    // Return the contract instance
    return await hre.ethers.getContractAt(contractName, contractAddress);
}

async function connectAndModify(contract, hre) {
    console.log("Ada:", await contract.queryAda());
    console.log("Parsel:", await contract.queryParsel());
    console.log("Verim:", await contract.queryVerim());
    console.log("Kisi:", await contract.queryKisi());
    console.log("Ekim:", await contract.queryEkim());
    console.log("Hektar:", await contract.queryHektar());
    console.log("Initial kalan:", await contract.kalan());

    const tx = await contract.satis(20, { gasLimit: 3000000 });
    await tx.wait();

    console.log("Kalan after satis:", await contract.kalan());
}

async function main() {
    const deployer = await hre.ethers.getSigner();
    const args = [123, 456, 500, "Furkan", 2024, 500]; // Arguments for your contract's constructor

    // Deploy if not already deployed
    const contract = await deployIfNotDeployed("DummyData", args, deployer);

    // Modify the data according to the contract and post the data values
    await connectAndModify(contract, hre);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
