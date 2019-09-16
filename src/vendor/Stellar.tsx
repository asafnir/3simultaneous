import StellarSdk from 'stellar-sdk';

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
    const transactionResults = Array();

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
        var transaction = new StellarSdk.TransactionBuilder(channelAccounts[index].account, {fee})
        .addOperation(StellarSdk.Operation.payment({
            source: baseAccount.id,
            destination: destinationAccount,
            asset: StellarSdk.Asset.native(),
            amount: amountToSend
        }))
        .setTimeout(20)
        .build();
        
        transaction.sign(StellarSdk.Keypair.fromSecret(SECRET_KEY));
        transaction.sign(StellarSdk.Keypair.fromSecret(channelAccounts[index].secretKey));

        var transactionResult = await submitTransaction(transaction);
        transactionResults.push(transactionResult)
    });
    
}

const submitTransaction = async (transaction: any) => {
    try {
        const transactionResult = await server.submitTransaction(transaction);
        return transactionResult;
        // console.log(JSON.stringify(transactionResult, null, 2));
        // console.log(transactionResult._links.transaction.href);
    } catch (e) {
        console.log('An error has occured:');
        console.log(e);
    }
}

const getAccount = async (key: string) => {
    return await server.loadAccount(key);
}

// const eventStream = server.transactions()
//     .forAccount(PUBLIC_KEY)
//     .cursor('now')
//     .stream({
//         onmessage: (message: any) => {
//             console.log("Getting message")
//             return message
//         }
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

export { getAccount, transaction, PUBLIC_KEY, server }