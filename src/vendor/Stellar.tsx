import StellarSdk from 'stellar-sdk';

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();


const PUBLIC_KEY = '';
const SECRET_KEY = '';

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
    const baseAccount = await getAccount(PUBLIC_KEY);
    
    for( var i=0; i < destinationAccounts.length; i++) {
        // Create keypair 
        const pair = await StellarSdk.Keypair.random();
        // Create account
        const res = await creatingChannelAccount(pair);
        const channelAccount = await getAccount(pair.publicKey())
        
        if (res) {
            channelAccounts.push({account: channelAccount, secretKey: pair.secret()})
        } else {
            throw('Was problem with the transaction')
        }
    }
    
    destinationAccounts.map( async(destinationAccount, index) => { 
        console.log(destinationAccount)
        var transaction = new StellarSdk.TransactionBuilder(baseAccount.id, {fee})
        .addOperation(StellarSdk.Operation.payment({
            source: baseAccount.id,
            destination: destinationAccount,
            asset: StellarSdk.Asset.native(),
            amount: amountToSend
        }))
        .setTimeout(180)
        .build();
        
        transaction.sign(StellarSdk.Keypair.fromSecret(SECRET_KEY));
        transaction.sign(StellarSdk.Keypair.fromSecret(channelAccounts[index].secretKey));
    });
}

const getAccount = async (key: string) => {
    return await server.loadAccount(key);
}

// const es = server.payments()
//   .cursor('now')
//   .stream({
//     onmessage: (message: any) => {
//       console.log(message);
//     }
// })

const creatingChannelAccount = async(pair: string | any) => {
    try {
        await fetch(
          `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
        );
        return true;
      } catch (e) {
        console.error("ERROR!", e);
      }
}

export { getAccount, transaction, PUBLIC_KEY }