require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function main() {
    const factory = await ethers.getContractFactory("Factory");
    let Factory = await factory.deploy();

    let tx = await Factory.deployDummy("Mete290824");
    await tx.wait()

    console.log(tx)
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
