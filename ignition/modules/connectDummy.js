require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function main() {
    let factory = await ethers.getContractFactory("Factory");
    let Factory = factory.attach("0x3695E2A6c8f62FC37517ba1fcc0DF43dD30C98df");
    // let tx = await Factory.deployDummy("Mert2408");
    // tx.wait()

    tx = await Factory.addProductToDummy("0x1eb54dCdAce0ddb1464392A1d71771Ad83d6eF05", "Cilek", 1, 4, 10, "Mert2408", 1724938373, 100000)
    
    await tx.wait();

    factory = await ethers.getContractFactory("DummyData");
    let Dummy = factory.attach("0x1eb54dCdAce0ddb1464392A1d71771Ad83d6eF05");

    console.log(
        `queryProductDetails :
            ${await Dummy.queryProductDetails("Cilek")}
        `
    )
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
