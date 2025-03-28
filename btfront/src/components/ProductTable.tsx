import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useState as reactUseState } from 'react';

const ProductTable = ({ data, onEdit, onDelete, onStockChange }) => {
  const [editId, setEditId]=useState(0)
  const [editName, setEditName]=useState("")
  const [editCategory, setEditCategory]=useState([])
  const [editStock, setEditStock]=useState(0)
  const [editUnitePrice, setEditUnitePrice]=useState(0)
  const [editExpirationDate, setEditExpirationDate]=useState("")
  const [isOpenModify, setIsOpenModify]= useState(false);
  const [editProductModalInfo, SeteditProductModalInfo]= useState('');
  
  const gettingSearchedItem= async (id) =>{
    const response = await fetch("http://localhost:9090/products/search/"+String(id));
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await response.json();
    return result
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
  const editProductSubmit = (data) =>{
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
  const columns = [
  
          // {
          //     name: '',
          //     maxWidth:'1px',
          //     cell: (row) => row.productQuantityStock==0 ||row.productQuantityStock=="0"?<input type="checkbox" className="checkbox"  defaultChecked={true} onClick={()=>reStockHandler(row.productId)} /> : <input type="checkbox" className="checkbox"  defaultChecked={false} onClick={()=>outStockHandler(row.productId)} />
          // },
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

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      conditionalRowStyles={conditionalRowStyles}
      customStyles={tableProducts}
      fixedHeader
    />
  );
};

export default ProductTable;
