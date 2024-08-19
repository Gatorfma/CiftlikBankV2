require("@nomiclabs/hardhat-ethers");
const fs = require("fs");
const { ethers } = require("hardhat");
const path = require("path");

const deploymentsFile = path.join(__dirname, "deployments.json");

async function deployIfNotDeployed(contractName) {
    let contractAddress;
    let networkName = hre.network.name; // Dynamically get the network name from Hardhat
    let deployments = {};

    // Check if the deployments file exists
    if (fs.existsSync(deploymentsFile)) {
        deployments = JSON.parse(fs.readFileSync(deploymentsFile));

        // Check if the network is present in the deployments file
        if (!deployments[networkName]) {
            deployments[networkName] = {}; // Initialize the network section if it doesn't exist
        }

        // Check if the contract is already deployed on this network
        if (deployments[networkName][contractName]) {
            contractAddress = deployments[networkName][contractName];
            console.log(`${contractName} is already deployed on ${networkName} at ${contractAddress}`);
        }
    } else {
        // If the deployments file does not exist, create an initial structure
        deployments = {
            [networkName]: {}
        };
    }

    // Deploy the Factory contract if it hasn't been deployed
    if (!contractAddress) {
        console.log(`Deploying ${contractName} on ${networkName}...`);
        const Contract = await hre.ethers.getContractFactory(contractName);
        const contract = await Contract.deploy();
        await contract.deployed();

        // Store the contract address under the network section
        deployments[networkName][contractName] = contract.address;

        // Write the updated deployments back to the file
        fs.writeFileSync(
            deploymentsFile,
            JSON.stringify(deployments, null, 2)
        );

        console.log(`${contractName} deployed to: ${contract.address}`);
        contractAddress = contract.address;
    }

    // Return the contract instance
    const factoryContract = await hre.ethers.getContractAt(contractName, contractAddress);

    // Check if the dummyDataAddresses array is empty
    if (!deployments[networkName].sell || !deployments[networkName].sell.dummyDataAddresses || deployments[networkName].sell.dummyDataAddresses.length === 0) {
        console.log("No DummyData contracts found. Calling connectAndModify to deploy one.");
        // Call connectAndModify to deploy DummyData contracts
        await connectAndModify(factoryContract, hre);
    } else {
        console.log("DummyData contracts already exist. Skipping deployment.");
    }


    return factoryContract;
}

async function connectAndModify(factoryContract, hre) {
    const ada = 789;
    const parsel = 753;
    const verim = 500;
    const kisi = "Gator";
    const ekim = 1723708776;
    const hektar = 500;

    // Deploy the DummyData contract by calling deployDummy from the Factory contract
    const tx = await factoryContract.deployDummy(ada, parsel, verim, kisi, ekim, hektar);
    const receipt = await tx.wait();

    // Assuming the DummyData contract address is returned in the events or logs
    const dummyDataAddress = receipt.events[0].args.contractAddress; 

    // Load the existing deployments
    let deployments = fs.existsSync(deploymentsFile)
        ? JSON.parse(fs.readFileSync(deploymentsFile))
        : {};

    const networkName = hre.network.name;

    // Ensure the network and sell sections exist
    if (!deployments[networkName]) {
        deployments[networkName] = {};
    }
    if (!deployments[networkName].sell) {
        deployments[networkName].sell = {};
    }
    if (!deployments[networkName].sell.dummyDataAddresses) {
        deployments[networkName].sell.dummyDataAddresses = [];
    }

    // Add the new DummyData address to the array if it's not already included
    if (!deployments[networkName].sell.dummyDataAddresses.includes(dummyDataAddress)) {
        deployments[networkName].sell.dummyDataAddresses.push(dummyDataAddress);
    }

    // Write the updated deployments back to the file
    fs.writeFileSync(
        deploymentsFile,
        JSON.stringify(deployments, null, 2)
    );

    console.log(`DummyData deployed and address stored: ${dummyDataAddress}`);
}


async function getContractAddress(contractName) {
    const deploymentsPath = path.join(__dirname, 'deployments.json');
    let deployments;

    if (fs.existsSync(deploymentsPath)) {
        deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
    } else {
        deployments = {};
    }

    const networkName = hre.network.name;

    // Ensure the necessary structure exists in the deployments object
    if (!deployments[networkName]) {
        deployments[networkName] = {};
    }

    if (!deployments[networkName].sell) {
        deployments[networkName].sell = {};
    }

    // Check if the dummyDataAddresses array exists, create it if not
    if (!deployments[networkName].sell.dummyDataAddresses) {
        deployments[networkName].sell.dummyDataAddresses = [];
    }

    let dummyDataAddresses = deployments[networkName].sell.dummyDataAddresses;

    // Check if there's a single address stored directly and move it to the array
    if (deployments[networkName].sell.DummyData) {
        // Move the existing single address to the array
        dummyDataAddresses.push(deployments[networkName].sell.DummyData);

        // Remove the old single address format
        delete deployments[networkName].sell.DummyData;

        // Save the updated deployments back to the file
        fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));

        console.log(`Moved old DummyData address into array: ${dummyDataAddresses[dummyDataAddresses.length - 1]}`);
    }

    if (dummyDataAddresses.length === 0) {
        console.log("No DummyData contracts found, deploying a new one...");

        // Deploy new DummyData contract
        const DummyData = await ethers.getContractFactory("DummyData");
        const contract = await DummyData.deploy(/* constructor args */);
        await contract.deployed();

        // Save the new contract address
        dummyDataAddresses.push(contract.address);
        fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));

        console.log(`New DummyData contract deployed at: ${contract.address}`);
    }

    const lastIndex = dummyDataAddresses.length - 1; // Get the index of the last address

    if (lastIndex < 0) {
        throw new Error(`No DummyData contracts found in the array for network ${networkName}`);
    }

    return dummyDataAddresses[lastIndex];
}

async function childCall(contractAddress, satisAmount){
    const DummyData = await ethers.getContractFactory("DummyData");
    const contract = DummyData.attach(contractAddress);

    const tx = await contract.satis(satisAmount);
    console.log(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Transaction confirmed: ${tx.hash}`);

    const kalan = receipt.events[0].args[0].toString();
    console.log(`Kalan after satis: ${kalan}`);
}

async function main() {

    // Deploy Factory if not already deployed
    const contract = await deployIfNotDeployed("Factory");

    const satisAmount = 1;
    
    // Get the first DummyData contract address
    const contractAddress = getContractAddress("DummyData");

    // Modify the data according to the contract and post the data values
    await connectAndModify(contract, hre);
    
    // Call the child function
    await childCall(contractAddress, satisAmount);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
