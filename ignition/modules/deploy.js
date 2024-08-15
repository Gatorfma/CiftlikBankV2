require("@nomiclabs/hardhat-ethers");
const fs = require("fs");
const path = require("path");

const deploymentsFile = path.join(__dirname, "deployments.json");

async function deployIfNotDeployed(contractName, deployer) {
    let contractAddress;

    // Check if the deployments file exists
    if (fs.existsSync(deploymentsFile)) {
        const deployments = JSON.parse(fs.readFileSync(deploymentsFile));

        // Specify the network name directly
        const networkName = "sepolia";

        // Check if this contract is already deployed on the sepolia network under the sell object
        if (deployments[networkName] && deployments[networkName].sell && deployments[networkName].sell[contractName]) {
            contractAddress = deployments[networkName].sell[contractName];
            console.log(`${contractName} is already deployed on ${networkName} at ${contractAddress}`);
        }
    }

    // Deploy the contract if it hasn't been deployed
    if (!contractAddress) {
        console.log(`Deploying ${contractName}...`);
        const Contract = await hre.ethers.getContractFactory(contractName);
        const contract = await Contract.deploy();
        await contract.deployed();

        // Load existing deployments or create a new structure
        const deployments = fs.existsSync(deploymentsFile)
            ? JSON.parse(fs.readFileSync(deploymentsFile))
            : {};

        // Ensure the network and sell sections exist
        if (!deployments[networkName]) {
            deployments[networkName] = {};
        }
        if (!deployments[networkName].sell) {
            deployments[networkName].sell = {};
        }

        // Store the contract address under the sell object
        deployments[networkName].sell[contractName] = contract.address;

        // Write the updated deployments back to the file
        fs.writeFileSync(
            deploymentsFile,
            JSON.stringify(deployments, null, 2)
        );

        console.log(`${contractName} deployed to: ${contract.address}`);
        contractAddress = contract.address;
    }

    // Return the contract instance
    return await hre.ethers.getContractAt(contractName, contractAddress);
}

async function connectAndModify(contract, hre) {
    const ada = 789;
    const parsel = 753;
    const verim = 500;
    const kisi = "Mert";
    const ekim = 1723708776;
    const hektar = 500;

    // Deploy the DummyData contract by calling deployDummy
    const tx = await contract.deployDummy(ada, parsel, verim, kisi, ekim, hektar);
    const receipt = await tx.wait();

    // Assuming the DummyData contract address is returned in the events or logs
    const dummyDataAddress = receipt.events[0].args.contractAddress; // Adjust based on actual event emitted

    // Load the existing deployments
    let deployments = fs.existsSync(deploymentsFile)
        ? JSON.parse(fs.readFileSync(deploymentsFile))
        : {};

    const networkName = "sepolia";

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

async function getContractAddress(contractName, index = 0) {
    const deploymentsPath = path.join(__dirname, 'deployments.json');
    let deployments;

    if (fs.existsSync(deploymentsPath)) {
        deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
    } else {
        deployments = {};
    }

    const networkName = "sepolia";

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

    if (index >= dummyDataAddresses.length) {
        throw new Error(`Index ${index} out of bounds for DummyData contracts on ${networkName} network`);
    }

    return dummyDataAddresses[index];
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
    const deployer = await hre.ethers.getSigner();
    
    // Deploy Factory if not already deployed
    const contract = await deployIfNotDeployed("Factory", deployer);

    const satisAmount = 25;
    
    // Get the first DummyData contract address
    const contractAddress = getContractAddress("DummyData");

    if (!contractAddress) {
        console.log("No DummyData contract found, skipping childCall.");
        return; // Or deploy a new DummyData contract, or handle accordingly
    }

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
