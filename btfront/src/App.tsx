import React from "react";
import "./App.css";
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component'
import Modal from './components/Modal';
import {useForm} from "react-hook-form"


function App() {
  // let unique = data.map(item => item.productCategory)
  // .filter((value, index, self) => self.indexOf(value) === index)
  const [data,setData]=useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [registers, setRegisters]=useState([])
  const [summaryRegisters, setSummaryRegisters]=useState([])
  const [inputValue, setInputValue]=useState('')
  const [catgorySelected, setCategorySelected]=useState('')
  const [available, setAvailable]=useState("true")
  const [isNewCategorie, setNewCategorie]=useState(false)
  const [categoryValue, setCategoryValue]=useState([])
  const [isOpen, setIsOpen]= useState(false);
  const [isOpenModify, setIsOpenModify]= useState(false);
  const [newProductModalInfo, SetnewProductModalInfo]= useState('');
  const [editProductModalInfo, SeteditProductModalInfo]= useState('');
  const {register, formState: {errors},handleSubmit} = useForm();
  const [editId, setEditId]=useState(0)
  const [editName, setEditName]=useState("")
  const [editCategory, setEditCategory]=useState("")
  const [editStock, setEditStock]=useState(0)
  const [editUnitePrice, setEditUnitePrice]=useState(0)
  const [editExpirationDate, setEditExpirationDate]=useState("")
  const [rowsWith0Stock,setRowsWith0Stock]=useState([])
  

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:9090/products");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result:[] = await response.json();
      setData(result);
      setRegisters(result);
      console.log("data fetched")
    } catch (error) {
      console.error('Error fetching data:', error);
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
     
  },[]); // El arreglo vacío asegura que esto se ejecute solo una vez al montar el componente.

  
    const handleCloseModal =() =>{
        setIsOpen(!isOpen)
        window.location.reload();
    }
 
    const handleCloseModalModify =() =>{
        setIsOpen(!isOpenModify)
        window.location.reload();
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

    const newProductSubmit = (data) =>{
      const postUrl = "http://localhost:9090/products"
      if(data.productCategory=="new"){
        data.productCategory= data.productNewCategory
      }
      data.productExpirationDate = String(data.productExpirationDate);
      delete data['productNewCategory'];
      fetch(postUrl,{
        method:"POST",
        body:JSON.stringify(data),
        headers:{"Content-type":"application/json"}
      }).then(response => { 
        if(response.status==200){
          SetnewProductModalInfo("The product has been added")
        }
        else{
          SetnewProductModalInfo("Something went wrong :(")
        }
      })
    }
    const openEditModal= async (id)=>{
      let search = await gettingSearchedItem(id)
      setEditId(search.productId)
      setEditName(search.productName)
      setEditCategory(search.productCategory)
      setEditStock(search.productQuantityStock)
      setEditUnitePrice(search.productPrice)
      setEditExpirationDate(search.productExpirationDate)
      setIsOpenModify(true);
    }
    const gettingSearchedItem= async (id) =>{
      const response = await fetch("http://localhost:9090/products/search/"+String(id));
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      return result
    }
    const editProductSubmit = (data) =>{
      console.log(data)
      const editUrl = "http://localhost:9090/products/"+String(editId)
      if(data.productCategory=="new"){
        data.productCategory= data.productNewCategory
      }
      
      data.productExpirationDate = String(data.productExpirationDate);
      delete data['productNewCategory'];
      fetch(editUrl,{
        method:"PUT",
        body:JSON.stringify(data),
        headers:{"Content-type":"application/json"}
      }).then(response => { 
        if(response.status==200){
          SeteditProductModalInfo("The product has been modified correctly")
        }
        else{
          SeteditProductModalInfo("Something went wrong :(")
        }
      })
    }
    const deleteProduct= (data) =>{
      console.log(data)
      const deleteUrl = "http://localhost:9090/products/"+data+"/delete"
      fetch(deleteUrl,{
        method:"DELETE",
        body:JSON.stringify(data),
        headers:{"Content-type":"application/json"}
      })
      window.location.reload();
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
    const categorieChange = (event)=>{
      if(event==undefined){
        console.log("indefinido soy")
      }
      console.log("cambié")
      if(event.target.value=="new"){
        setNewCategorie(true);
      }
      else{
        setNewCategorie(false);

      }
    }


    const reStockHandler = (id)=>{
      const reStock = "http://localhost:9090/products/"+id+"/instock"
           fetch(reStock,{
             method:"PUT",
             body:JSON.stringify(data),
             headers:{"Content-type":"application/json"}
           })
           window.location.reload();
    }
    const outStockHandler = (id)=>{
      const outOfStock = "http://localhost:9090/products/"+id+"/outofstock"
           fetch(outOfStock,{
             method:"POST",
             body:JSON.stringify(data),
             headers:{"Content-type":"application/json"}
           })
           window.location.reload();
    }
    
    
    
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
            name: '',
            maxWidth:'1px',
            cell: (row) => row.productQuantityStock==0?<input type="checkbox" className="checkbox"  defaultChecked={true} onClick={()=>reStockHandler(row.productId)} /> : <input type="checkbox" className="checkbox"  defaultChecked={false} onClick={()=>outStockHandler(row.productId)} />
        },
        {
            name: 'Category',
            selector: row => row.productCategory,
            sortable: true,
            maxWidth:'300px',
            minWidth:'200px',
        },
        {
            name: 'Name',
            selector: row => row.productName,
            sortable: true,
            maxWidth:'250px',
            minWidth:'200px',
        },
        {
            name: 'Price',
            selector: row => "$"+row.productPrice,
            sortable: true,
            maxWidth:'200px',
            minWidth:'150px',
        },
        {
            name: 'Expiration date',
            selector: row => row.productExpirationDate,
            sortable: true,
            maxWidth:'300px',
            minWidth:'180px',
        },
        {
            name: 'Stock',
            selector: row => row.productQuantityStock,
            sortable: true,
            maxWidth:'130px'
        },
        {
            name: 'Actions',
            button: true,
            minWidth:'130px',
		        cell: (row) => <div className="actionButtons"><button className="modifyButton" onClick={()=>openEditModal(row.productId)}>Edit</button> <button className="deleteButton" onClick={()=>deleteProduct(row.productId)}>Delete</button></div> 
        },
    ];
    const tableSummaryColumns = [
        {
            name: 'Categories',
            selector: row => row.categoryName,
            sortable: true,
            maxWidth:'200px'
            
        },
        {
            name: 'Total products on stock',
            selector: row => row.totalProducts,
            sortable: true,
            minWidth:'380px'
        },
        {
            name: 'Total value on stock',
            selector: row => "$"+row.totalValue,
            sortable: true,
            minWidth:'380px'
        },
        {
            name: 'Average price on stock',
            selector: row => "$"+row.averagePrice,
            sortable: true,
            minWidth:'380px'
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
      {/* New Product Modal */}
      { isOpen ? <Modal close={handleCloseModal} content={<div className="newProduct">
        <form className="newProductForm" onSubmit={handleSubmit(newProductSubmit)}>
          <div className="rowNewProduct">
            <div className="columnNewProduct">
              <label htmlFor="productName">Name </label>  
              <label htmlFor="productCategory">Caregories </label>
              {isNewCategorie?<br />:null}
              <label htmlFor="productQuantityStock">Stock </label>
              <label htmlFor="productPrice">Unit Price </label>
              <label htmlFor="productExpirationDate">Expiration Date </label>
            </div>
            <div className="columnNewProduct">
              <input type="text" name="productName" required placeholder="Hat" {...register('productName',
                {maxLength:120,
                  minLength:2,
                  required:true
                }
              )}/>
              {errors.productName?.type==='required' && <p>You have to write a name</p>}
              {/* <input type="text" name="productCategory" placeholder="Clothes"/> */}
              <select  {...register('productCategory',{required:true})} onChange={categorieChange} name="productCategory"  >
                {/* SI DA ALGUN PROBLEMA COMO QUE NO ENTRE A ONCHANGE, ES POSIBLE EL REGISTER */}
                <option key="0" value="0">No category selected</option>
                {categoryValue.map(element=>(<option key={element} value={element}>{element}</option>))}
                <option key="new" value="new">Create a new Category!</option>
              </select>
              {isNewCategorie?<input type="text" required name="productNewCategory" placeholder="Clothes" {...register('productNewCategory',{required:true})}/> : null}
              <input type="number" required name="productQuantityStock" placeholder="45" {...register('productQuantityStock',{required:true})}/>
              <input type="number" required  name="productPrice" placeholder="40" {...register('productPrice',{required:true})}/>
              <input type="date"  name="productExpirationDate"  {...register('productExpirationDate')}/>
            </div>
          </div>
            <p>{newProductModalInfo}</p>
          <button className="buttonNewProduct" type="submit">Save</button>
        </form>
        
      </div>}/> : null}
      {/* New Product Modal */}
      { isOpenModify ? <Modal close={handleCloseModal} content={<div className="newProduct">
        <form className="newProductForm" onSubmit={handleSubmit(editProductSubmit)}>
          <div className="rowNewProduct">
            <div className="columnNewProduct">
              <label htmlFor="productName">Name </label>  
              <label htmlFor="productCategory">Caregories </label>
              {isNewCategorie?<br />:null}
              <label htmlFor="productQuantityStock">Stock </label>
              <label htmlFor="productPrice">Unit Price </label>
              <label htmlFor="productExpirationDate">Expiration Date </label>
            </div>
            <div className="columnNewProduct">
              <input type="text" defaultValue={editName} name="productName" required placeholder="Hat" {...register('productName',
                {maxLength:120,
                  minLength:2,
                }
              )}/>
              {errors.productName?.type==='required' && <p>You have to write a name</p>}
              {/* <input type="text" name="productCategory" placeholder="Clothes"/> */}
              <select  {...register('productCategory')} onChange={categorieChange} name="productCategory" required defaultValue={editCategory}  >
                {/* SI DA ALGUN PROBLEMA COMO QUE NO ENTRE A ONCHANGE, ES POSIBLE EL REGISTER */}
                <option key="0" value="No category selected">No category selected</option>
                {categoryValue.map(element=>(<option key={element} value={element}>{element}</option>))}
                <option key="new" value="new">Create a new Category!</option>
              </select>
              {isNewCategorie?<input type="text" required name="productNewCategory" placeholder="Clothes" {...register('productNewCategory')}/> : null}
              <input type="number" defaultValue={editStock} onChange={(e) => setEditStock(Number(e.target.value))} required name="productQuantityStock" placeholder="45" {...register('productQuantityStock')}/>
              <input type="number" defaultValue={editUnitePrice} required  name="productPrice" placeholder="40" {...register('productPrice')}/>
              <input type="date" defaultValue={editExpirationDate} name="productExpirationDate"  {...register('productExpirationDate')}/>
            </div>
          </div>
            <p>{editProductModalInfo}</p>
          <button className="buttonNewProduct" type="submit">Save</button>
        </form>
        
      </div>}/> : null}
      
      {/* <ProductsTable/> */}
      <div>
        <DataTable
          columns={columns}
          data={registers}
          // selectableRows
          
          // selectableRowSelected={rowSelectCritera}
          // onSelectedRowsChange={handleSelectedRow}
          
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
