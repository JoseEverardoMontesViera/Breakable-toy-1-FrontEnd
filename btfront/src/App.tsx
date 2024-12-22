import React from "react";
import "./App.css";
import { useState } from 'react';
import data from './MOCK_DATA ID.json'
import DataTable from 'react-data-table-component'
import TotalNPrices from "./components/TotalNPrices";
import Select from 'react-select';

function App() {
  const [tableRegisters, setTableRegisters]=useState(data)
  const [registers, setRegisters]=useState(data)
  const [inputValue, setInputValue]=useState('')
    const handlerName = (searchTerm) =>{
        const filteredData = data.filter(record=>{
            return record.productName.toLowerCase().includes(searchTerm.toLowerCase())
        })
        setRegisters(filteredData)
    }
    const handlerCategory = (e) =>{
        const filteredData = data.filter(record=>{
            return record.productCategory.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setRegisters(filteredData)
    }
    
    const onSearch = (searchTerm) =>{
      handlerName(searchTerm);
    }

    const changeInputValue = (event)=>{
      setInputValue(event.target.value);
    }

    const customStyles = {
        rows: {
            style: {
                minHeight: '80px', // override the row height
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
        pagination:{
          style:{
            fontSize: '25px',
          },
          pageButtonsStyle:{
            padding: '9px',
            margin: '1  px',
          }
        }
        
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
      {/*  search Begins */}
      <div className="SearchDiv">
        <div className="divColumn labels">
          <label htmlFor="SearchName">Name</label>
          <label htmlFor="SearchCategory"> Category</label>
          <label htmlFor="SearchAvailability"> Availability</label>
        </div>
        <div className="divColumn">
          <input type="text" name="SearchName"
            id="searchName" value={inputValue} onChange={changeInputValue}
          />
          {/* react Select */}
          <Select className="select" options = {[]} onChange={handlerCategory} defaultValue={{label:'Nothing selected', value:'nothing'}}/>
          {/* <select name="SearchCategory" id="searchCategory">
            <option value="1">Ejemplo1</option>
            <option value="2">Ejemplo2</option>
          </select> */}
          <div className="divRow">
            <select name="SearchAvailability" className="select" id="searchAvailability">
              {/* {this.tableRegisters.map(element=>(<option key={element.productId} value={element.productId}>{element.productCategory}</option>))} */}
            </select>
          {/* react Select */}
            <button onClick={()=>onSearch(inputValue)}>Search</button>
          </div>
        </div>
      </div>
      {/* search ends */}
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
      {/* ProductsTable ends */}
      <div className="carrousel"></div>
      {/* Total princes begins */}
      <div className="totalPrices">

      </div>
      {/* Total prices ends */}
    </div>
  );
}

export default App;
