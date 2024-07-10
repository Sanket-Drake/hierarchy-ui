'use client';

import "./styles.css";
import { addDepartment, addEditTeam, ceoPage, hierarchy } from "./constants";
import React, { SetStateAction, useEffect, useState } from "react";
import { home } from "./constants";
import { addEditTeamMember } from "./constants";
import { viewTeam } from "./constants";
import { listEmployee } from "./constants";
import Hierarchy from "./screens/Hierarchy";
import AddEditTeamMember from "./screens/AddEditTeamMember";
import AddEditTeam from "./screens/AddEditTeam";
import ViewTeam from "./screens/ViewTeam";
import ListEmployee from "./screens/ListEmployee";
import { getItem, setItem } from "./service/storageService";
import { CEOStorage } from "./constants";
import AddDepartment from "./screens/AddDepartment";
import CEOPage from "./screens/CEOPage";

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch stock data from API (example using a mock API endpoint)
  useEffect(() => {
    fetch('https://api.benzinga.com/api/v1/quoteDelayed?token=0beae1e20cfd42c3b17b65e2a54c9d7f&symbols=AAPL%2CTSLA')
      .then(response => response.json())
      .then(data => {
        console.log(data.quotes);
         setStocks(data.quotes)});
  }, []);

  // Function to handle buying stocks
  const buyStock = (stock: any, quantity: any) => {
    // Calculate total cost based on current price fetched from API
    const totalCost = stock.price * quantity;

    // Update portfolio and transactions
    setPortfolio((prevPortfolio: any) => {
      const existingStock = prevPortfolio.find((item: any) => item.symbol === stock.symbol);
      if (existingStock) {
        // If stock already exists in portfolio, update quantity and average cost
        return prevPortfolio.map((item: any) =>
          item.symbol === stock.symbol
            ? { ...item, quantity: item.quantity + quantity, avgCost: (item.avgCost + totalCost) / (item.quantity + quantity) }
            : item
        );
      } else {
        // Add new stock to portfolio
        return [...prevPortfolio, { symbol: stock.symbol, quantity, avgCost: totalCost }];
      }
    });

    // Update transactions
    setTransactions(prevTransactions => [
      ...prevTransactions,
      { type: 'buy', symbol: stock.symbol, quantity, price: stock.price, totalCost, timestamp: new Date() }
    ]);

    // Update local storage
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    localStorage.setItem('transactions', JSON.stringify(transactions));
  };

  // Function to handle selling stocks
  const sellStock = (stock: any, quantity: any) => {
    // Update portfolio and transactions (similar logic as buyStock)
    setPortfolio((prevPortfolio: any) => {
      const updatedPortfolio = prevPortfolio.map((item: any) =>
        item.symbol === stock.symbol
          ? { ...item, quantity: item.quantity - quantity }
          : item
      );
      return updatedPortfolio.filter((item: any) => item.quantity > 0);
    });

    // Update transactions
    const totalGain = stock.price * quantity;
    setTransactions(prevTransactions => [
      ...prevTransactions,
      { type: 'sell', symbol: stock.symbol, quantity, price: stock.price, totalGain, timestamp: new Date() }
    ]);

    // Update local storage
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    localStorage.setItem('transactions', JSON.stringify(transactions));
  };

  return (
    <div className="app">
      <h1>Stock Market Trader</h1>
      <div className="container">
        <StockList stocks={stocks} onBuy={buyStock} />
        <Portfolio portfolio={portfolio} onSell={sellStock} />
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
};

const StockList = ({ stocks, onBuy }: {stocks: any, onBuy: any}) => {
  return (
    <div className="stock-list">
      <h2>Stock List</h2>
      <ul>
        {stocks?.map((stock: any) => (
          <li key={stock.security.symbol}>
            <span>{stock.security.symbol} </span>
            <span>{stock.quote.close} </span>
            <button onClick={() => onBuy(stock, 1)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Portfolio = ({ portfolio, onSell }: {portfolio: any, onSell: any}) => {
  return (
    <div className="portfolio">
      <h2>Portfolio</h2>
      <ul>
        {portfolio.map((stock: any) => (
          <li key={stock.symbol}>
            <span>{stock.symbol}</span>
            <span>Quantity: {stock.quantity}</span>
            <span>Avg Cost: {stock.avgCost}</span>
            <button onClick={() => onSell(stock, 1)}>Sell</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TransactionHistory = ({ transactions }: {transactions: any}) => {
  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((transaction: any, index: any) => (
          <li key={index}>
            <span>{transaction.type === 'buy' ? 'Bought' : 'Sold'}</span>
            <span>{transaction.symbol}</span>
            <span>Quantity: {transaction.quantity}</span>
            <span>Price: {transaction.price}</span>
            <span>Total: {transaction.type === 'buy' ? transaction.totalCost : transaction.totalGain}</span>
            <span>Time: {transaction.timestamp.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  // const [screen, changeScreens] = useState(home);
  // const [data, changeData] = useState(null);

  // function changeScreen(page: SetStateAction<string>, data: SetStateAction<null> | undefined) {
  //   if(data)
  //     changeData(data);
  //   else 
  //     changeData(null)
  //   changeScreens(page);
  // }

  // function showHierarchy() {
  //   const CEOLocal = getItem(CEOStorage);
  //   if(CEOLocal) 
  //     changeScreen(hierarchy, null);
  //   else 
  //     changeScreen(ceoPage, null)
  // }
  // switch (screen) {
  //   case hierarchy:
  //     return <Hierarchy changeScreen={changeScreen} />;
  //   case addEditTeam:
  //     return <AddEditTeam changeScreen={changeScreen} data={data} />;
  //   case addEditTeamMember:
  //     return <AddEditTeamMember changeScreen={changeScreen} data={data} />;
  //   case viewTeam:
  //     return <ViewTeam changeScreen={changeScreen} />;
  //   case listEmployee:
  //     return <ListEmployee changeScreen={changeScreen} />;
  //   case addDepartment:
  //     return <AddDepartment changeScreen={changeScreen} />;
  //   case ceoPage:
  //     return <CEOPage changeScreen={changeScreen} />;
  //   default: 
  //   return (
  //     <div className="App">
  //       <h1>Home</h1>
  //       <button className="primary-button" onClick={() => showHierarchy()}>Show Hierarchy</button>
  //     </div>
  //   );
  // }
}
