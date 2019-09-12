import StellarSdk from 'stellar-sdk';
import { ok } from 'assert';

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();


const PUBLIC_KEY = 'GDDV6XB7VOO72WMZ32PRGONH4ISXIAEH4M7YWAIJH2LMPZ5TU2D5VMWI';
const SECRET_KEY = 'SBDWQNJR56IDZ7L72FY5SOKDP62MHH467QK7YMN4UM5FTXK6H3XKJZ75';

interface transactionObject {
    destinationAccounts: String[],
    baseAccount: String,
    customerAddress: String,
    amountToSend: String
}

const transaction = async (transactionObject: transactionObject) => {
    const channelAccounts = Array();
    const { destinationAccounts, amountToSend  } = transactionObject;
    const fee = await server.fetchBaseFee();
    for( var i=0; i < destinationAccounts.length; i++) {
        // Create keypair 
        const pair = await StellarSdk.Keypair.random();
        // Create account
        const res = await creatingChannelAccount(pair);
        if (res) {
            channelAccounts.push({secretKey: pair.secret(), publicKey: pair.publicKey()})
        } else {
            throw('Was problem with the transaction')
        }
    }
    const account = await server.loadAccount(PUBLIC_KEY);

    destinationAccounts.map( async(destinationAccount, index) => { 
        var transaction = new StellarSdk.TransactionBuilder(channelAccounts[index].publicKey, {fee})
        .addOperation(StellarSdk.Operation.payment({
            source: account.address(),
            destination: destinationAccount,
            asset: StellarSdk.Asset.native(),
            amount: amountToSend
        }))
        .setTimeout(180)
        .build();

        transaction.sign(SECRET_KEY);
        transaction.sign(channelAccounts[index].secretKey);
    })
    
}

const getAccount = async () => {
    return await server.loadAccount(PUBLIC_KEY);
}


const creatingChannelAccount = async(pair: string | any) => {
    try {
        const response = await fetch(
          `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
        );
        return true;
      } catch (e) {
        console.error("ERROR!", e);
      }
}

export {getAccount, transaction }