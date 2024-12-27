import React from "react";
import "./App.css";
import { useState, useEffect } from 'react';
// import data from './MOCK_DATA ID.json'
import DataTable from 'react-data-table-component'
import TotalNPrices from "./components/TotalNPrices";
import Select from 'react-select';
import Modal from './components/Modal';


function App() {
  // let unique = data.map(item => item.productCategory)
  // .filter((value, index, self) => self.indexOf(value) === index)
  const [data,setData]=useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [registers, setRegisters]=useState([])
  const [summaryRegisters, setSummaryRegisters]=useState([])
  const [inputValue, setInputValue]=useState('')
  const [catgorySelected, setCategorySelected]=useState('')
  const [available, setAvailable]=useState(false)
  const [categoryValue, setCategoryValue]=useState([])
  const [isOpen, setIsOpen]= useState(false);
  const [isOpenModify, setIsOpenModify]= useState(false);
  

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:9090/products");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result:[] = await response.json();
      setData(result);
      setRegisters(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Una vez que la solicitud termine, cambiamos `loading` a `false`
    }
  };
  const getSummary = async () => {
    try {
      const response = await fetch("http://localhost:9090/products/summary");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result:[] = await response.json();
      setSummaryRegisters(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Una vez que la solicitud termine, cambiamos `loading` a `false`
    }
  };
  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:9090/products/Categories");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result:[] = await response.json();
      setCategoryValue(result);
      console.log("categorias "+result)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Una vez que la solicitud termine, cambiamos `loading` a `false`
    }
  };
  useEffect(() => {
    fetchData();
    getSummary();
    getCategories();
     // Llamamos a la función para hacer la solicitud GET.
  },[]); // El arreglo vacío asegura que esto se ejecute solo una vez al montar el componente.

  if (loading) {
    // Si estamos en estado de carga, mostramos el spinner o mensaje de carga
    return <p>Cargando productos...</p>;
  }
  
    const handleCloseModal =() =>{
        setIsOpen(!isOpen)
    }
 
    const handleCloseModalModify =() =>{
        setIsOpen(!isOpenModify)
    }
    const handlerName = (searchTerm, category, available) =>{
      console.log(searchTerm," ", category," ", available)
      if(available=="true"){
        const filteredData = data.filter(record=>{
            return record.productName.toLowerCase().includes(searchTerm.toLowerCase()) && record.productCategory.toLowerCase().includes(category.toLowerCase()) && record.productQuantityStock !=0
        })
        setRegisters(filteredData)
      }
      else{
        const filteredData = data.filter(record=>{
          return record.productName.toLowerCase().includes(searchTerm.toLowerCase()) && record.productCategory.toLowerCase().includes(category.toLowerCase()) && record.productQuantityStock ==0
      })
      setRegisters(filteredData)
      }
        // setRegisters(filteredData)
    }
    const handlerCategory = (e) =>{
        const filteredData = data.filter(record=>{
            return record.productCategory.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setRegisters(filteredData)
    }
    const gatherCategories = (data)=>{
      console.log(data)
      let categories = []
      data.forEach(product => {
        if(categories.includes(product.productCategory)==false){
          categories.push(product.productCategory)
        }
        
      });
      console.log(categories)
    }
    const OnChangeCategory=(e)=>{
      setCategoryValue(e.target.value)
      console.log(categoryValue);
    }
    
    const onSearch = (searchTerm, category, available) =>{
      if(category==0){
        category=""
      }
      handlerName(searchTerm, category, available);
    }

    const changeInputValue = (event)=>{
      setInputValue(event.target.value);
    }
    const changeCategorySelected = (event)=>{
      setCategorySelected(event.target.value);
    }
    const changeAvailability = (event)=>{
      setAvailable(event.target.value);
    }
    const ButtonModify = () => <button type="button">Modify</button>;
    const ButtonDelete = () => <button type="button">Delete</button>;
    const tableProducts = {
        rows: {
            style: {
                minHeight: '80px', // override the row height
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '3px',
                fontSize:'30px',
                backgroundColor:'rgb(201, 199, 199);',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '1px',
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
    const tableSummary = {
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
            sortable: true,
            maxWidth:'150px'
        },
        {
            name: 'Actions',
            button: true,
            minWidth:'130px',
		        cell: () => <div className="actionButtons"><button className="modifyButton">Modify</button> <button className="deleteButton">Delete</button></div> 
        },
    ];
    const tableSummaryColumns = [
        {
            name: 'Categories',
            selector: row => row.categoryName,
            sortable: true
            
        },
        {
            name: 'Total products on stock',
            selector: row => row.totalProducts,
            sortable: true
        },
        {
            name: 'Total value on stock',
            selector: row => row.totalValue,
            sortable: true
        },
        {
            name: 'Average price on stock',
            selector: row => row.averagePrice,
            sortable: true
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
          <select name="SearchCategory" className="select" id="searchCategory" onChange={changeCategorySelected}>
            <option key="0" value="0">All categories</option>
            {/* {categoryValue.map(
              element=>(<option key={element.productId} value={element.productCategory}>{element.productCategory}</option>))} */}
              {categoryValue.map(element=>(<option key={element} value={element}>{element}</option>))}
          </select> 
          <div className="divRow">
            <select name="SearchAvailability" className="select" id="searchAvailability" onChange={changeAvailability}>
              {/* {categoryValue.map(element=>(<option key={element.productId} value={element.productId}>{element.productCategory}</option>))} */}
              <option value="true" key="1">Available</option>
              <option value="false" key="0">Not available</option>
              
            </select>
          {/* react Select */}
            <button onClick={()=>onSearch(inputValue,catgorySelected,available)}>Search</button>
          </div>
        </div>
      </div>
      {/* search ends */}
      <button className="newProduct" onClick={()=>setIsOpen(true)}>New Product</button>
      { isOpen ? <Modal close={handleCloseModal} content={<div><h1>HOLA</h1></div>}/> : null}
      { isOpenModify ? <Modal close={handleCloseModal} content={'contenido'}/> : null}
      
      {/* <ProductsTable/> */}
      <div>
        <DataTable
          columns={columns}
          data={registers}
          selectableRows
          pagination
          customStyles={tableProducts}
          fixedHeader
        />
      </div>
      {/* ProductsTable ends */}
      <div className="carrousel"></div>
      {/* Total princes begins */}
      <div className="totalPrices">
        <DataTable
          columns={tableSummaryColumns}
          data={summaryRegisters}
          customStyles={tableSummary}
            
        />
      </div>
      {/* Total prices ends */}
    </div>
  );
}

export default App;
