import React from 'react';
import { Layout } from 'antd';
import AppHeader from './components/shared/AppHeader';
import TransactionsForm from './components/TransactionsForm';
import Account from './components/Account';
import './assets/App.css';

const { Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="App">
      <AppHeader/>
      <Content style={{ padding: '40px' }}>
        <Account/>
        <TransactionsForm/>
      </Content>
      <Footer style={{ textAlign: 'center' }}></Footer>
    </Layout>
  );
}

export default App;
