import React from "react";
import "./App.css";
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component'
import Modal from './components/Modal';
import {useForm} from "react-hook-form"
import { MultiSelect } from 'primereact/multiselect';



function App() {

  const [data,setData]=useState([]);
  const [registers, setRegisters]=useState([])
  const [filteredReg, setFilteredReg]=useState(registers)
  //Pagination pages
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
  const [summaryRegisters, setSummaryRegisters]=useState([])
  const [inputValue, setInputValue] = useState('');
  const [categorySelected, setCategorySelected] = useState([]);
  const [available, setAvailable] = useState('all');
  const [isNewCategorie, setNewCategorie]=useState(false)
  const [categoryValue, setCategoryValue] = useState([]);
  const [isOpen, setIsOpen]= useState(false);
  const [isOpenModify, setIsOpenModify]= useState(false);
  const [newProductModalInfo, SetnewProductModalInfo]= useState('');
  const [editProductModalInfo, SeteditProductModalInfo]= useState('');
  const {register, formState: {errors},handleSubmit} = useForm();
  const [editId, setEditId]=useState(0)
  const [editName, setEditName]=useState("")
  const [editCategory, setEditCategory]=useState([])
  const [editStock, setEditStock]=useState(0)
  const [editUnitePrice, setEditUnitePrice]=useState(0)
  const [editExpirationDate, setEditExpirationDate]=useState("")

  const fetchAllData = async () => {
    try {
      // Fetch all data in parallel
      const [productsResponse, summaryResponse, categoriesResponse] = await Promise.all([
        fetch("http://localhost:9090/products"),
        fetch("http://localhost:9090/products/summary"),
        fetch("http://localhost:9090/products/Categories"),
      ]);
  
      // Log the status of each response
      console.log("Products Response:", productsResponse);
      console.log("Summary Response:", summaryResponse);
      console.log("Categories Response:", categoriesResponse);
  
      // Check if all responses are OK
      if (!productsResponse.ok || !summaryResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch one or more resources");
      }
  
      // Parse JSON responses
      const products = await productsResponse.json(); // Llama a json() aquí
      const summary = await summaryResponse.json();   // Llama a json() aquí
      const categories = await categoriesResponse.json(); // Llama a json() aquí
  
      // Update state
      setData(products);
      // setRegisters(products);
      // setFilteredReg(products);
      setSummaryRegisters(summary);
      setCategoryValue(categories);
  
    console.log("All data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false after all calls
    }

  };
  
  

  useEffect(() => {
    fetchAllData();
    fetchPaginatedProducts(currentPage, 10);
  }, []); // El arreglo vacío asegura que esto se ejecute solo una vez al montar el componente.
  // useEffect(() => {
  //   setFilteredReg(registers); // Actualiza filteredReg cada vez que registers cambia
  // }, [registers]); // Dependencia de registers
  
    const handleCloseModal =() =>{
        setIsOpen(!isOpen)
        window.location.reload();
    }
 
    
    const newProductSubmit = (data) =>{
      console.log("Fetched categories:", categoryValue);
      console.log(data)
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
    const openEditModal= async (id)=>{
      let search = await gettingSearchedItem(id)
      setEditId(search.productId)
      setEditName(search.productName)
      setEditCategory([search.productCategory])
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
    const fetchPaginatedProducts = async (page, size) => {
      try {
        const response = await fetch(`http://localhost:9090/products/paginated?page=${page}&size=${size}`);
        if (!response.ok) {
          throw new Error('Error al cargar productos paginados');
        }
    
        const { products, total } = await response.json(); // Desestructurar el objeto
        setFilteredReg(products);
        console.log(products)
        setTotalPages(Math.ceil(total / size)); // Calcular el total de páginas
      } catch (error) {
        console.error('Error fetching paginated products:', error);
      }
    };
    const goToNextPage = () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
        fetchPaginatedProducts(currentPage + 1, 10);
      }
    };
  
    const goToPreviousPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
        fetchPaginatedProducts(currentPage - 1, 10);
      }
    };
    const editProductSubmit = (data) =>{
      console.log("Metodo")
      console.log(data)
      // console.log(editId)
      if(data.productName.length<2){
        SeteditProductModalInfo("Your product name is too short :(")
      }
      else if(data.productName.length>120){
        SeteditProductModalInfo("Your product name is too long :(")}
      else if(data.productCategory=="0" || data.productCategory=="No category selected"){
        SeteditProductModalInfo("You have to choose a category or create a new one!")
      }
      else{
        const editUrl = "http://localhost:9090/products/"+String(editId)
        if(data.productCategory=="new"){
          data.productCategory= data.productNewCategory
        }
        data.productCategory= [data.productCategory];
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
    }

    const deleteProduct = async (productId) => {
  
      const deleteUrl = `http://localhost:9090/products/${productId}/delete`;
      console.log(deleteUrl);
    
      try {
        const response = await fetch(deleteUrl, {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
        });
    
        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }
        setRegisters((prevRegisters) => prevRegisters.filter((p) => p.productId !== productId));
        setFilteredReg((prevFilteredReg) => prevFilteredReg.filter((p) => p.productId !== productId));
    
        console.log("Producto eliminado exitosamente");
      } catch (error) {
        console.error("Error eliminando el producto:", error);
      }
    };

    // const onSearch = (searchTerm, category, available) =>{
    //   if(category==0){
    //     category=""
    //   }
    //   console.log(category);
    //   handlerName(searchTerm, category, available);
    // }
    const onSearch = async () => {
      try {
        // Formatear el valor de disponibilidad
        const availability = available === 'all' ? undefined : available === 'true';
    
        // Crear la URL con los parámetros de búsqueda
        const queryParams = new URLSearchParams({
          name: inputValue,
          ...(categorySelected.length > 0 && { categories: categorySelected.join(',') }), // Convertir a cadena
          ...(availability !== undefined && { inStock: String(availability) }) // Convertir a cadena
        });
    
        const response = await fetch(`http://localhost:9090/products/search?${queryParams.toString()}`);
        
    
        // Comprobar si la respuesta fue exitosa
        if (!response.ok) {
          throw new Error('Error al buscar productos');
        }
    
        // Obtener los datos filtrados
        const filteredProducts = await response.json();
        console.log(filteredProducts);
        setFilteredReg(filteredProducts); // Actualizar el estado con los productos filtrados
    
      } catch (error) {
        console.error('Error al buscar productos:', error);
      }
    };

    const changeInputValue = (e) => {
      setInputValue(e.target.value);
    };
    const changeCategorySelected = (selectedCategories) => {
      setCategorySelected(selectedCategories); // Asegúrate de que selectedCategories sea un arreglo
    };
    const changeAvailability = (e) => {
      setAvailable(e.target.value);
    };
    const categorieChange = (event)=>{
      console.log("Valor del select:", event.target.value)
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
    const conditionalRowStyles=[
      {
        when: row => (new Date(row.productExpirationDate).getTime() - Date.now())/(1000*60*60*24) < 7,
        style: {
          backgroundColor: 'red',
          color: 'black',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
      {
        when: row => (new Date(row.productExpirationDate).getTime() - Date.now())/(1000*60*60*24) > 15,
        style: {
          backgroundColor: 'rgb(97, 241, 97)',
          color: 'black',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
      {
        when: row => (new Date(row.productExpirationDate).getTime() - Date.now())/(1000*60*60*24) >=7 && (new Date(row.productExpirationDate).getTime() - Date.now())/(1000*60*60*24) <=14,
        style: {
          backgroundColor: 'yellow',
          color: 'black',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
      {
        when: row => row.productExpirationDate=="",
        style: {
          backgroundColor: 'white',
          color: 'black',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
    ]
    
    
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
            cell: (row) => row.productQuantityStock==0 ||row.productQuantityStock=="0"?<input type="checkbox" data-testid="checkStock" className="checkbox" role="checkbox"  defaultChecked={true} onClick={()=>reStockHandler(row.productId)} /> : <input type="checkbox" className="checkbox" data-testid="checkStock"   defaultChecked={false} onClick={()=>outStockHandler(row.productId)} />
        },
        {
            name: 'Category',
            // selector: row => row.productCategory,
            cell:(row)=> row.productQuantityStock==0? <div className="striked">{row.productCategory}</div>:<div>{row.productCategory}</div>,
            sortable: true,
            maxWidth:'300px',
            minWidth:'200px',
        },
        {
            name: 'Name',
            // selector: row => row.productName,
            cell:(row)=> row.productQuantityStock==0? <div className="striked">{row.productName}</div>:<div>{row.productName}</div>,
            sortable: true,
            maxWidth:'250px',
            minWidth:'200px',
        },
        {
            name: 'Price',
            // selector: row => "$"+row.productPrice,
            cell:(row)=> row.productQuantityStock==0? <div className="striked">${row.productPrice}</div>:<div>${row.productPrice}</div>,
            sortable: true,
            maxWidth:'200px',
            minWidth:'150px',
        },
        {
            name: 'Expiration date',
            // selector: row => row.productExpirationDate,
            cell:(row)=> row.productQuantityStock==0? <div className="striked">{row.productExpirationDate}</div>:<div>{row.productExpirationDate}</div>,
            sortable: true,
            maxWidth:'300px',
            minWidth:'180px',
        },
        {
            name: 'Stock',
            // selector: row => row.productQuantityStock,
            cell: (row) => row.productQuantityStock>10? 
            <div>{row.productQuantityStock}</div>:
            row.productQuantityStock>5? 
            <div className="backgroundOrange">{row.productQuantityStock}</div>:
            row.productQuantityStock<=0?
            <div className="backgroudColorRed striked">{row.productQuantityStock}</div>:<div className="backgroudColorRed">{row.productQuantityStock}</div>,
            sortable: true,
            maxWidth:'130px'
        },
        {
            name: 'Actions',
            button: true,
            minWidth:'300px',
            maxWidth:'300px',
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
          <MultiSelect className="select" value={categorySelected} onChange={(e) => changeCategorySelected(e.value)} options={Array.isArray(categoryValue) ? categoryValue : []}  placeholder="Select a category" maxSelectedLabels={3} />
          {/* <MultiSelect className="select" value={categorySelected} onChange={changeCategorySelected} options={Array.isArray(categoryValue) ? categoryValue : []}  placeholder="Select a category" maxSelectedLabels={3} /> */}
          {/* react Select categories */}
          <div className="divRow">
            <select name="SearchAvailability" className="select" id="searchAvailability" onChange={changeAvailability}>
              <option value="all" key="all">All availability</option>
              <option value="true" key="1">Available</option>
              <option value="false" key="0">Not available</option>
              
            </select>
          {/* react Select */}
            <button onClick={()=>onSearch()}>Search</button>
            {/* <button onClick={()=>onSearch(inputValue,catgorySelected,available)}>Search</button> */}
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
              <input type="text" name="productName" data-testid="productName" id="productName" required placeholder="Hat" {...register('productName'
              )}/>
              {errors.productName?.type==='required' && <p>You have to write a name</p>}
              {/* <input type="text" name="productCategory" placeholder="Clothes"/> */}
              <select  data-testid="select" id="productCategory"  {...register('productCategory')} onChange={categorieChange} name="productCategory" onClick={(e)=>{console.log(e.target)}}>
                {/* SI DA ALGUN PROBLEMA COMO QUE NO ENTRE A ONCHANGE, ES POSIBLE EL REGISTER */}
                <option key="0" value="0">No category selected</option>
                {/* {categoryValue.map(element=>(<option key={element+"CategoryNew"} data-testid="select-option" value={element}>{element}</option>))} */}
                {Array.isArray(categoryValue) && categoryValue.length > 0 ? (
                    categoryValue.map(element => (
                      <option key={element + "CategoryNew"} data-testid="select-option" value={element}>
                        {element}
                      </option>
                    ))
                  ) : (
                    <option key="no-category" value="0">No categories available</option>
                  )}
                <option key="new" value="new" data-testid="select-option-new">Create a new Category!</option>
              </select>
              {isNewCategorie?<input type="text" data-testid="newCategory" required name="productNewCategory" placeholder="Clothes" {...register('productNewCategory')}/> : null}
              <input type="number" id="productQuantityStock" data-testid="productQuantityStock" required name="productQuantityStock" placeholder="45" {...register('productQuantityStock')}/>
              <input type="number" id="productPrice" data-testid="productPrice" required  name="productPrice" placeholder="40" {...register('productPrice')}/>
              <input type="date" id="productExpirationDate" data-testid="productExpirationDate" name="productExpirationDate"  {...register('productExpirationDate')}/>
            </div>
          </div>
            <p data-testid="newProductModalInfo">{newProductModalInfo}</p>
          <button className="buttonNewProduct" data-testid="buttonNewProduct" type="submit">Save</button>
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
              <input type="text" defaultValue={editName} name="productName" data-testid="editName" required placeholder="Hat" {...register('productName'
                
              )}/>
              {errors.productName?.type==='required' && <p>You have to write a name</p>}
              {/* <input type="text" name="productCategory" placeholder="Clothes"/> */}
              <select  {...register('productCategory')} onChange={categorieChange} name="productCategory" data-testid="selectEdit"  required defaultValue={editCategory}  >
                {/* SI DA ALGUN PROBLEMA COMO QUE NO ENTRE A ONCHANGE, ES POSIBLE EL REGISTER */}
                <option key="0" value="No category selected">No category selected</option>
                {/* {categoryValue.map(element=>(<option key={element+"CategoryModify"} value={element}>{element}</option>))} */}
                {Array.isArray(categoryValue) && categoryValue.length > 0 ? (
                    categoryValue.map(element => (
                      <option key={element + "CategoryModify"} data-testid="select-option" value={element}>
                        {element}
                      </option>
                    ))
                  ) : (
                    <option key="no-category" value="0">No categories available</option>
                  )}
                <option key="new" value="new">Create a new Category!</option>
              </select>
              {isNewCategorie?<input type="text" required name="productNewCategory" placeholder="Clothes" {...register('productNewCategory')}/> : null}
              <input type="number" defaultValue={editStock} data-testid="editStock" onChange={(e) => setEditStock(Number(e.target.value))} required name="productQuantityStock" placeholder="45" {...register('productQuantityStock')}/>
              <input type="number" defaultValue={editUnitePrice} data-testid="editPrice" required  name="productPrice" placeholder="40" {...register('productPrice')}/>
              <input type="date" defaultValue={editExpirationDate} data-testid="editDate" name="productExpirationDate"  {...register('productExpirationDate')}/>
            </div>
          </div>
            <p data-testid="editInfo">{editProductModalInfo}</p>
          <button className="buttonNewProduct" data-testid="editButton" type="submit">Save</button>
        </form>
        
      </div>}/> : null}
      
      {/* <ProductsTable/> */}
      <div>
        <DataTable
          columns={columns}
          // data={filteredReg}
          data={Array.isArray(filteredReg) ? filteredReg : []}
          //pagination
          conditionalRowStyles={conditionalRowStyles}
          customStyles={tableProducts}
        />
      </div>
      <div className="pagination-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 0}>Previous</button>
        <span>Page {currentPage + 1} of {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>Next</button>
      </div>
      <br />
      <br />
      <br />
      {/* ProductsTable ends */}
      <div className="carrousel"></div>
      {/* Total princes begins */}
      <div className="totalPrices">
        <DataTable
          columns={tableSummaryColumns}
          data={Array.isArray(summaryRegisters) ? summaryRegisters : []}
          // data={summaryRegisters}
          customStyles={tableSummary}
            
        />
      </div>
      {/* Total prices ends */}
    </div>
  );
}

export default App;

