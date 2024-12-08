import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    // Ensure Hardhat environment is loaded
    const Auditoria = await ethers.getContractFactory("AuditoriaContract");

    // Deploy the contract
    const auditoria = await Auditoria.deploy();
    await auditoria.deployed();

    console.log("Contract deployed to:", auditoria.address);
}

// Catch errors and exit
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
