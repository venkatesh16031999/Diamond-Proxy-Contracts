const { ethers } = require("hardhat");

const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 }

// get function selectors from ABI
function getSelectors (contract) {
  const signatures = Object.keys(contract.interface.functions)
  const selectors = signatures.reduce((acc, val) => {
    if (val !== 'init(bytes)') {
      acc.push(contract.interface.getSighash(val))
    }
    return acc
  }, [])
//   selectors.contract = contract
//   selectors.remove = remove
//   selectors.get = get
  return selectors
}

async function deployDiamond () {
    const Diamond = await ethers.getContractFactory('DiamondProxy');
    const diamond = await Diamond.deploy();
    await diamond.deployed();
    console.log('DiamondProxy Contract is deployed at ', diamond.address);

    const FacetNames = ['InitialMessageFacet', 'SetMessageFacet', 'GetMessageFacet'];

    const facetCuts = [];

    for await (let facetName of FacetNames) {
        const facetFactory = await ethers.getContractFactory(facetName);
        const facet = await facetFactory.deploy();
        await facet.deployed();
        console.log(`${facetName} Contract is  deployed at `, facet.address);

        facetCuts.push({
            target: facet.address,
            action: FacetCutAction.Add,
            selectors: getSelectors(facet)
        });
    }

    const DiamondProxyContract = await ethers.getContractAt("DiamondProxy", diamond.address);

    console.log("Before Adding New Facets : ", await DiamondProxyContract.facetAddresses());

    await DiamondProxyContract.diamondCut(facetCuts, ethers.constants.AddressZero, '0x');

    console.log("After Adding New Facets : ", await DiamondProxyContract.facetAddresses());
}

deployDiamond()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})