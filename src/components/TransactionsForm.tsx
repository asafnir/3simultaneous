import * as React from 'react';
import { Form, Button, Row, Col } from 'antd';

import AccountInput from './shared/AccountInput';
import AmountInput from './shared/AmountInput';
import Log from './shared/Log';
import {transaction} from '../vendor/Stellar';
import { async } from 'q';

interface IProps {

}

interface IState {

}
  
export default class TransactionsForm extends React.Component<IProps, IState> {
    public state = {
        transactionObject: {
            destinationAccounts: ['', '', ''],
            baseAccount: '',
            customerAddress: '',
            amountToSend: ''
        },
        loading: false,
        transactionResults: []
    }
    
    onSubmit = async (e: any) => {
        const { transactionObject } = this.state;
        e.preventDefault();
        this.setState({loading: true})
        const results = await transaction(this.state.transactionObject);
        this.setState({loading: false, transactionResults: results})
    }

    private onChangeAccount = (val: string, index: number) => {
        const tmp = this.state.transactionObject;
        tmp.destinationAccounts[index] = val;
        this.setState({transactionObject: tmp})
    }

    private addInput = () => {
        const tmp = this.state.transactionObject;
        tmp.destinationAccounts.push('')
        this.setState({transactionObject: tmp})
    }

    private changeAmount= (amount: string) => {
        const tmp = this.state.transactionObject;
        tmp.amountToSend = Number(amount).toFixed(7);
        this.setState({transactionObject: tmp})    
    }

    private removeInput = (index: number) => {
        const tmp = this.state.transactionObject;
        tmp.destinationAccounts.splice(index);
        this.setState({transactionObject: tmp})
    }

    public render() {
        const { transactionObject, loading, transactionResults } = this.state;
        const canSend = () => transactionObject.amountToSend && transactionObject.destinationAccounts.every(a => a.length !== 0 )
        
        return (
        <React.Fragment>
            <div style={{padding: 3, marginBottom: 10, overflow: 'scroll'}}>
                <p><b>Test accounts</b></p>
                <p>GB4XWPQ4O3C33CJGMUDVACWGVNSALTEZYPFXYGG7PG6NMYKENFLIOBTJ</p>
                <p>GD5ICAQAHPNJN5LUQJF6W5HH3T7QPUKZMV436WIPTGH6TNXFWKEBKJUA</p>
                <p>GC5HEY4BY7ANJYJ2I7XGWXXJFM6SQT4D2AMQDPDBGSRAIN3KVLXTJ37L</p>
            </div>
            <Row gutter={24}>
                <Col span={12}>
                    <Form onSubmit={this.onSubmit}>
                        { transactionObject.destinationAccounts.map( (account, index: number) => {
                            return (
                                <Form.Item key={index} style={{width: '100%'}}>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <AccountInput value={account} onChange={(val: string) => this.onChangeAccount(val,index)}/>
                                        </Col>
                                        <Col span={4}>
                                            { index > 2 && <Button type="primary" shape="circle" icon="delete" onClick={() => this.removeInput(index)}/>}
                                        </Col>
                                    </Row>
                                </Form.Item>
                            )
                            }) 
                        }
                        <Form.Item>
                            <Button type="primary" onClick={() => this.addInput()}>Add account</Button>
                        </Form.Item>
                        <p>perform a minimum of 3 simultaneous Stellar payment transactions</p>
                        <hr/>
                        <Form.Item>
                            <span>Amount to Send</span>
                            <AmountInput value={transactionObject.amountToSend} onChange={(amount: string) => this.changeAmount(amount)}/>
                        </Form.Item>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit" disabled={!canSend() || loading}>
                                Send
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    <Log loading={loading} numberOfTransaction={transactionObject.destinationAccounts.length}/>
                </Col>
            </Row>
        </React.Fragment>
        );
    }
}