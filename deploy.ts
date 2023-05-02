import { ethers } from 'ethers'
import * as fs from 'fs-extra'
import 'dotenv/config'

async function main() {
   const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
   // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
   const encryptedJSONKey = fs.readFileSync('./.encryptedKey.json', 'utf8')
   const wallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedJSONKey,
      process.env.PASSWORD!
   ).connect(provider)

   const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8')
   const binary = fs.readFileSync(
      './SimpleStorage_sol_SimpleStorage.bin',
      'utf8'
   )

   const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

   console.log('Deploying, please wait...')

   const contract = await contractFactory.deploy()
   await contract.deploymentTransaction()?.wait(1)

   console.log(`Contract deployed to: ${await contract.getAddress()}`)
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error)
      process.exit(1)
   })
