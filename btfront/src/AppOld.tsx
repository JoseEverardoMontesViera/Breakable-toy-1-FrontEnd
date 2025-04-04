import React from "react";
import "./App.css";
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component'
import Modal from './components/Modal';
import {useForm} from "react-hook-form"
import { MultiSelect } from 'primereact/multiselect';
import ProductTable from "./components/ProductTable";
import SearchForm from "./components/SearchForm";


function AppOld() {

  const [data,setData]=useState([]);
  const [registers, setRegisters]=useState([])
  const [filteredReg, setFilteredReg]=useState(registers)
  const [summaryRegisters, setSummaryRegisters]=useState([])
  const [inputValue, setInputValue]=useState('')
  const [catgorySelected, setCategorySelected]=useState('')
  const [available, setAvailable]=useState("all")
  const [isNewCategorie, setNewCategorie]=useState(false)
  const [categoryValue, setCategoryValue]=useState([])
  const [isOpen, setIsOpen]= useState(false);

  const [newProductModalInfo, SetnewProductModalInfo]= useState('');

  const {register, formState: {errors},handleSubmit} = useForm();
 

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:9090/products");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result:[] = await response.json();
      setData(result);
      setRegisters(result);
      setFilteredReg(result)
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
 
    const handlerName = (searchTerm, category, available) =>{
      let filteredData = []
      setFilteredReg(registers)
      console.log(filteredReg)
      if(category.length == categoryValue.length){
        console.log("todas")
        console.log(available)
        if(available=="all"){
          filteredData =(data.filter(record=>{
          return record.productName.toLowerCase().includes(searchTerm.toLowerCase())
        }))}
        else if(available=="true"){
          filteredData =(data.filter(record=>{
          return record.productName.toLowerCase().includes(searchTerm.toLowerCase()) && record.productQuantityStock !=0
        }))}
        else if(available=="false"){
          filteredData =(data.filter(record=>{
          return record.productName.toLowerCase().includes(searchTerm.toLowerCase()) && record.productQuantityStock ==0
        }))
      }
      console.log("todas")
        setFilteredReg(filteredData)

        console.log(filteredData)  
      }
      else if(category!="" && category.length!=0 ){
        category.forEach(element => {
          if(available=="true"){
            console.log(true)
            filteredData =(data.filter(record=>{
              console.log(record," recordavailable")
              return record.productName.toLowerCase().includes(searchTerm.toLowerCase()) && record.productQuantityStock >0 && record.productCategory.includes(element)
            }))
            
            console.log(filteredData + "we")
            setFilteredReg(filteredData)
          }
          else if(available=="false"){
            filteredData = (data.filter(record=>{
              return record.productName.toLowerCase().includes(searchTerm.toLowerCase()) && record.productQuantityStock ==0 && record.productCategory.includes(element) 
          }))
          
          setFilteredReg(filteredData)
          }
          else{
            filteredData =(data.filter(record=>{
              return record.productName.toLowerCase().includes(searchTerm.toLowerCase()) && record.productCategory.includes(element)
          }))
          console.log(filteredData, " se hizo push")
          setFilteredReg(filteredData)
          }
            });
       }
       else{
         console.log(available)
         if(available=="all"){
              filteredData =(data.filter(record=>{
              return record.productName.toLowerCase().includes(searchTerm.toLowerCase())
            }))
            console.log(filteredData, " filtrado");
            setFilteredReg(filteredData)
            }
            else if(available=="true"){
              filteredData =(data.filter(record=>{
                console.log(record)
              return record.productName.toLowerCase().includes(searchTerm.toLowerCase()) && record.productQuantityStock !=0
            }))
            console.log(filteredData, " filtrado");
            setFilteredReg(filteredData)
            }
            else if(available=="false"){
              filteredData =(data.filter(record=>{
                return record.productName.toLowerCase().includes(searchTerm.toLowerCase()) && record.productQuantityStock ==0
            }))
            setFilteredReg(filteredData)
            }
            else{
              filteredData =(data.filter(record=>{
                return record.productName.toLowerCase().includes(searchTerm.toLowerCase())
            }))
            setFilteredReg(filteredData)
            }
       }
      
    }
    

    const newProductSubmit = (data) =>{
      if(data.productName.length<2){
        SetnewProductModalInfo("Your product name is too short :(")
      }
      else if(data.productName.length>120){
        SetnewProductModalInfo("Your product name is too long :(")}
      else if(data.productCategory=="0" || data.productCategory=="No category selected"){
        SetnewProductModalInfo("You have to choose a category or create a new one!")
      }
      else{
        const postUrl = "http://localhost:9090/products"
        if(data.productCategory=="new"){
          data.productCategory= data.productNewCategory
        }
        data.productCategory= [data.productCategory];
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
      
    }
    
    
    
 
    const onSearch = (searchTerm, category, available) =>{
      if(category==0){
        category=""
      }
      console.log(category);
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
  // return (
  //   <div className="Bod">
  //     {/*  search Begins */}
  //     <div className="SearchDiv">
  //       <div className="divColumn labels">
  //         <label htmlFor="SearchName">Name</label>
  //         <label htmlFor="SearchCategory"> Category</label>
  //         <label htmlFor="SearchAvailability"> Availability</label>
  //       </div>
  //       <div className="divColumn">
  //         <input type="text" name="SearchName"
  //           id="searchName" value={inputValue} onChange={changeInputValue}
  //         />
  //         <MultiSelect className="select" value={catgorySelected} onChange={changeCategorySelected} options={categoryValue}  placeholder="Select a category" maxSelectedLabels={3} />
  //         {/* react Select categories */}
  //         <div className="divRow">
  //           <select name="SearchAvailability" className="select" id="searchAvailability" onChange={changeAvailability}>
  //             <option value="all" key="all">All availability</option>
  //             <option value="true" key="1">Available</option>
  //             <option value="false" key="0">Not available</option>
              
  //           </select>
  //         {/* react Select */}
  //           <button onClick={()=>onSearch(inputValue,catgorySelected,available)}>Search</button>
  //         </div>
  //       </div>
  //     </div>
  //     {/* search ends */}
  //     <button className="newProduct" onClick={()=>setIsOpen(true)}>New Product</button>
  //     {/* New Product Modal */}
  //     { isOpen ? <Modal close={handleCloseModal} content={<div className="newProduct">
  //       <form className="newProductForm" onSubmit={handleSubmit(newProductSubmit)}>
  //         <div className="rowNewProduct">
  //           <div className="columnNewProduct">
  //             <label htmlFor="productName">Name </label>  
  //             <label htmlFor="productCategory">Caregories </label>
  //             {isNewCategorie?<br />:null}
  //             <label htmlFor="productQuantityStock">Stock </label>
  //             <label htmlFor="productPrice">Unit Price </label>
  //             <label htmlFor="productExpirationDate">Expiration Date </label>
  //           </div>
  //           <div className="columnNewProduct">
  //             <input type="text" name="productName" id="productName" required placeholder="Hat" {...register('productName'
  //             )}/>
  //             {errors.productName?.type==='required' && <p>You have to write a name</p>}
  //             {/* <input type="text" name="productCategory" placeholder="Clothes"/> */}
  //             <select  data-testid="select" id="productCategory"  {...register('productCategory')} onChange={categorieChange} name="productCategory"  >
  //               {/* SI DA ALGUN PROBLEMA COMO QUE NO ENTRE A ONCHANGE, ES POSIBLE EL REGISTER */}
  //               <option key="0" value="0">No category selected</option>
  //               {categoryValue.map(element=>(<option key={element+"CategoryNew"} data-testid="select-option" value={element}>{element}</option>))}
  //               <option key="new" value="new" data-testid="select-option-new">Create a new Category!</option>
  //             </select>
  //             {isNewCategorie?<input type="text" required name="productNewCategory" placeholder="Clothes" {...register('productNewCategory')}/> : null}
  //             <input type="number" id="productQuantityStock" required name="productQuantityStock" placeholder="45" {...register('productQuantityStock')}/>
  //             <input type="number" id="productPrice" required  name="productPrice" placeholder="40" {...register('productPrice')}/>
  //             <input type="date" id="productExpirationDate" name="productExpirationDate"  {...register('productExpirationDate')}/>
  //           </div>
  //         </div>
  //           <p data-testid="newProductModalInfo">{newProductModalInfo}</p>
  //         <button className="buttonNewProduct" type="submit">Save</button>
  //       </form>
        
  //     </div>}/> : null}
  //     {/* New Product Modal */}
  //     { isOpenModify ? <Modal close={handleCloseModal} content={<div className="newProduct">
  //       <form className="newProductForm" onSubmit={handleSubmit(editProductSubmit)}>
  //         <div className="rowNewProduct">
  //           <div className="columnNewProduct">
  //             <label htmlFor="productName">Name </label>  
  //             <label htmlFor="productCategory">Caregories </label>
  //             {isNewCategorie?<br />:null}
  //             <label htmlFor="productQuantityStock">Stock </label>
  //             <label htmlFor="productPrice">Unit Price </label>
  //             <label htmlFor="productExpirationDate">Expiration Date </label>
  //           </div>
  //           <div className="columnNewProduct">
  //             <input type="text" defaultValue={editName} name="productName" required placeholder="Hat" {...register('productName'
                
  //             )}/>
  //             {errors.productName?.type==='required' && <p>You have to write a name</p>}
  //             {/* <input type="text" name="productCategory" placeholder="Clothes"/> */}
  //             <select  {...register('productCategory')} onChange={categorieChange} name="productCategory" required defaultValue={editCategory}  >
  //               {/* SI DA ALGUN PROBLEMA COMO QUE NO ENTRE A ONCHANGE, ES POSIBLE EL REGISTER */}
  //               <option key="0" value="No category selected">No category selected</option>
  //               {categoryValue.map(element=>(<option key={element+"CategoryModify"} value={element}>{element}</option>))}
  //               <option key="new" value="new">Create a new Category!</option>
  //             </select>
  //             {isNewCategorie?<input type="text" required name="productNewCategory" placeholder="Clothes" {...register('productNewCategory')}/> : null}
  //             <input type="number" defaultValue={editStock} onChange={(e) => setEditStock(Number(e.target.value))} required name="productQuantityStock" placeholder="45" {...register('productQuantityStock')}/>
  //             <input type="number" defaultValue={editUnitePrice} required  name="productPrice" placeholder="40" {...register('productPrice')}/>
  //             <input type="date" defaultValue={editExpirationDate} name="productExpirationDate"  {...register('productExpirationDate')}/>
  //           </div>
  //         </div>
  //           <p>{editProductModalInfo}</p>
  //         <button className="buttonNewProduct" type="submit">Save</button>
  //       </form>
        
  //     </div>}/> : null}
      
  //     {/* <ProductsTable/> */}
  //     <div>
  //       <DataTable
  //         columns={columns}
  //         data={filteredReg}
  //         pagination
  //         conditionalRowStyles={conditionalRowStyles}
  //         customStyles={tableProducts}
  //         fixedHeader
  //       />
  //     </div>
  //     {/* ProductsTable ends */}
  //     <div className="carrousel"></div>
  //     {/* Total princes begins */}
  //     <div className="totalPrices">
  //       <DataTable
  //         columns={tableSummaryColumns}
  //         data={summaryRegisters}
  //         customStyles={tableSummary}
            
  //       />
  //     </div>
  //     {/* Total prices ends */}
  //   </div>
  return (
    <div></div>
    // <div className="Bod">
    //   <SearchForm
    //     searchTerm={searchTerm}
    //     setSearchTerm={setSearchTerm}
    //     category={category}
    //     setCategory={setCategory}
    //     available={available}
    //     setAvailable={setAvailable}
    //     categories={categories}
    //     onSearch={onSearch}
    //   />
    //   <button className="newProduct" onClick={() => setIsOpen(true)}>New Product</button>
    //   {isOpen && (
    //     <Modal close={handleCloseModal} content={
    //       <div className="newProduct">
    //         <form className="newProductForm" onSubmit={handleSubmit(newProductSubmit)}>
    //           {/* Form fields */}
    //           <button className="buttonNewProduct" type="submit">Save</button>
    //         </form>
    //       </div>
    //     } />
    //   )}
    //   {isOpenModify && (
    //     <Modal close={handleCloseModal} content={
    //       <div className="newProduct">
    //         <form className="newProductForm" onSubmit={handleSubmit(editProductSubmit)}>
    //           {/* Form fields */}
    //           <button className="buttonNewProduct" type="submit">Save</button>
    //         </form>
    //       </div>
    //     } />
    //   )}
    //   <ProductTable
    //     data={data}
    //     onEdit={openEditModal}
    //     onDelete={deleteProduct}
    //     onStockChange={(id, inStock) => inStock ? reStockHandler(id) : outStockHandler(id)}
    //   />
    //   <div className="totalPrices">
    //     <DataTable
    //       columns={[
    //         { name: 'Categories', selector: row => row.categoryName, sortable: true },
    //         { name: 'Total products on stock', selector: row => row.totalProducts, sortable: true },
    //         { name: 'Total value on stock', selector: row => "$" + row.totalValue, sortable: true },
    //         { name: 'Average price on stock', selector: row => "$" + row.averagePrice, sortable: true },
    //       ]}
    //       data={summary}
    //       customStyles={{
    //         rows: { style: { minHeight: '80px' } },
    //         headCells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: '30px' } },
    //         cells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: '30px' } },
    //         pagination: { style: { fontSize: '25px' }, pageButtonsStyle: { padding: '9px', margin: '1px' } },
    //       }}
    //     />
    //   </div>
    // </div>
  );
}

export default AppOld;

