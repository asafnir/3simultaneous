
import React, { FunctionComponent, useState, useEffect } from 'react';
import { Card, Skeleton, message } from 'antd';
import { server, PUBLIC_KEY } from '../../vendor/Stellar';

interface IProps {
    loading: Boolean
    numberOfTransaction: number
}

const AppHeader: FunctionComponent<IProps> = (props: any) => {
    const [transactionResults, setTransactionResults] = useState<Object[]>([]);
    const eventStream = server.transactions();

    var txHandler =  (txResponse: any) => {
        if (props.numberOfTransaction > transactionResults.length) {
            const tmp = transactionResults;
            tmp.push(txResponse);
            // setTransactionResults(tmp)
            setTransactionResults(prevResults => ([...prevResults, ...tmp]));

        } else {
            eventStream();
        }
    };
    
    if (props.loading) {
        eventStream.forAccount(PUBLIC_KEY)
        .cursor('now')
        .stream({onmessage: txHandler})
    }
    
    useEffect(() => {
        
    }, [transactionResults]);

    return <Card title="Transaction logs" style={{background: '#fff', padding: 10, border: '1px solid', minHeight: 300}}>
        {props.loading ?
            <Skeleton active />
            :
            <div>
            { !!transactionResults ?
                transactionResults.map((transaction: any, index: number) => 
                    <div key={index} style={{height: '100%', flexWrap: 'wrap', overflowWrap: 'break-word'}}>
                        <p><b>Transaction</b></p>
                        <p>Created at <b>{transaction.created_at}</b></p>
                        <p>Hash: {transaction.hash}</p>
                        <p>View the transaction at: <a href={transaction._links && transaction._links.self.href}>Transaction link</a></p>
                    </div>
                )
                :
                <div>
                    Loading log ...
                </div>
            }
            </div>
        }
        
    </Card>
  
}

export default AppHeader;
