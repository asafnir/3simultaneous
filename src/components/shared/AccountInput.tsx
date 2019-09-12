
import React, { FunctionComponent } from 'react';
import { Input } from 'antd';

interface IProps {
    value: String
    onChange: Function
}

const AccountInput: FunctionComponent<IProps> = (props: any) => {
    
    return <Input
            placeholder="Enter account"
            value={props.value}
            onChange={(account) => props.onChange(account.target.value) }
            />
}

export default AccountInput;
