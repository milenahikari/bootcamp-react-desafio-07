import React, { useState, useEffect } from 'react';

import { format } from 'path';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('transactions');

      const transactionsResponse = response.data.transactions;

      const transactionsFormated = transactionsResponse.map(
        (item: Transaction) => ({
          ...item,
          formattedDate: formatDate(new Date(item.created_at)),
          formattedValue:
            item.type === 'outcome'
              ? `- ${formatValue(item.value)}`
              : formatValue(item.value),
        }),
      );

      const balanceResponse = response.data.balance;

      const balanceFormated = {
        income: formatValue(balanceResponse.income),
        outcome: formatValue(balanceResponse.outcome),
        total: formatValue(balanceResponse.total),
      };

      setTransactions(transactionsFormated);
      setBalance(balanceFormated);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions &&
                transactions.map(item => (
                  <tr key={item.id}>
                    <td className="title">{item.title}</td>
                    <td className={item.type}>{item.formattedValue}</td>
                    <td>{item.category.title}</td>
                    <td>{item.formattedDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
