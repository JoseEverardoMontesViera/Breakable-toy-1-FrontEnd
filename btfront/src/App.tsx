import React from 'react';
import './App.css';
import Search from './components/Search';
import ProductsTable from './components/ProductsTable';
import TotalNPrices from './components/TotalNPrices';

function App() {
  return (
    <body className="App">
      <div className="Bod">
        <Search></Search>
        <button className="newProduct">New Product</button>
        <ProductsTable/>
        <div className="carrousel"></div>
        <TotalNPrices/>
      </div>
    </body>
    
  );
}

export default App;
