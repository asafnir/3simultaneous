
import React, { FunctionComponent } from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const AppHeader: FunctionComponent<{}> = (props: any) => {
    return <Header>
      <div className="logo">3Transactions</div>
  </Header>
}

export default AppHeader;
