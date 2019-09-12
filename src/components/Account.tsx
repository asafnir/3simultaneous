
import React, { FunctionComponent, useState, useEffect  } from 'react';
import { Input } from 'antd';
import { getAccount } from '../vendor/Stellar'

interface Balances {
    balance: string
}

interface IProps {
}

interface IAccount {
    id: string
    balances: Balances[]
}

const initialUserData: IAccount = {id: '', balances: []}

const Account: FunctionComponent<IProps> = (props: any) => {
    const [account, setAccount] = useState<IAccount>(initialUserData);

    async function fetchAccount() {
        const account = await getAccount()
        console.log(account)
        setAccount(account)
    }

    useEffect(() => {
        fetchAccount()
    }, [])

    
    return <div>
        { Boolean(account) ?
            <div>
                <h4>Your Account: {account["id"]}</h4>
                <h5>Your Balance: {
                    account.balances && account.balances.map( (balance, index) => {
                       return <span key={index}>{balance["balance"]}</span>
                    })
                }</h5>
            </div>
            :
            <div>Fetch your account...</div>
        }
    </div>
}

export default Account;
