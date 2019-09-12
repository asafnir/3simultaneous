
import React, { FunctionComponent } from 'react';
import { InputNumber } from 'antd';

interface IProps {
    value: string
    onChange: Function
}

const AmountInput: FunctionComponent<IProps> = (props: any) => {
    return (
        <InputNumber
            style={{width: '100%'}}
            placeholder="Enter your amount"
            formatter={value => `${Number(value).toFixed(7)}`}
            parser={value => value ? value.replace(/\$\s?|(,*)/g, ''): ''}
            defaultValue={props.amountToSend}
            onChange={(amount) => props.onChange(amount)}
            />
    )
}

export default AmountInput;
