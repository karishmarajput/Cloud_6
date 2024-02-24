async function main() {
    const Certification = await ethers.getContractFactory("Certification");
    const Certification_ = await Certification.deploy();
    console.log("Contract Deployed to Address:", Certification_.address);
  }
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });