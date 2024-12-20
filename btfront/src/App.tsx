import React from "react";
import "./App.css";
import { useState } from 'react';
import data from './MOCK_DATA copy.json'
import DataTable from 'react-data-table-component'
import TotalNPrices from "./components/TotalNPrices";
import Select from 'react-select';

function App() {
  const [registers, setRegisters]=useState(data)
    const handlerName = (e) =>{
        const filteredData = data.filter(record=>{
            return record.productName.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setRegisters(filteredData)
    }
    const handlerCategory = (e) =>{
        const filteredData = data.filter(record=>{
            return record.productCategory.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setRegisters(filteredData)
    }
    

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontSize:'30px',
                backgroundColor:'rgb(201, 199, 199);',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontSize:'30px'
                
            },
        },
    };
    const columns = [
        {
            name: 'Category',
            selector: row => row.productCategory,
            sortable: true
        },
        {
            name: 'Name',
            selector: row => row.productName,
            sortable: true
        },
        {
            name: 'Price',
            selector: row => row.productPrice,
            sortable: true
        },
        {
            name: 'Expiration date',
            selector: row => row.productExpirationDate,
            sortable: true
        },
        {
            name: 'Stock',
            selector: row => row.productQuantityStock,
            sortable: true
        },
        {
            name: 'Actions'
        },
    ];
  return (
    <div className="Bod">
      {/* Inicia search */}
      <div className="SearchDiv">
        <div className="divColumn labels">
          <label htmlFor="SearchName">Name</label>
          <label htmlFor="SearchCategory"> Category</label>
          <label htmlFor="SearchAvailability"> Availability</label>
        </div>
        <div className="divColumn">
          <input
            type="text"
            name="SearchName"
            id="searchName"
            onChange={handlerName}
          />
          {/* Select de react */}
          <Select className="select" options = {[]} onChange={handlerCategory} defaultValue={{label:'Nothing selected', value:'nothing'}}/>
          {/* <select name="SearchCategory" id="searchCategory">
            <option value="1">Ejemplo1</option>
            <option value="2">Ejemplo2</option>
          </select> */}
          <div className="divRow">
            <select name="SearchAvailability" className="select" id="searchAvailability">
              <option value="1">Ejemplo1</option>
              <option value="2">Ejemplo2</option>
            </select>
          {/* Select de react */}
            <button onClick={handlerName}>Search</button>
          </div>
        </div>
      </div>
      {/* termina  search */}
      <button className="newProduct">New Product</button>
      {/* <ProductsTable/> */}
      <div>
        <DataTable
          columns={columns}
          data={registers}
          selectableRows
          pagination
          customStyles={customStyles}
          fixedHeader
        />
      </div>
      <div className="carrousel"></div>
      <TotalNPrices />
    </div>
  );
}

export default App;
