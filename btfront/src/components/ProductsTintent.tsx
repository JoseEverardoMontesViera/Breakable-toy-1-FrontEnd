import React from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component'
import data from '../MOCK_DATA copy.json'
function ProductsTintent() {
    const [registers, setRegisters]=useState(data)
    const handler = (e) =>{
        const filteredData = data.filter(record=>{
            return record.productName.toLowerCase().includes(e.target.value.toLowerCase())
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
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                
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
            name: 'stock',
            selector: row => row.productQuantityStock,
            sortable: true
        },
        {
            name: 'Actions'
        },
    ];
  return (
    <div></div>
  )
}

export default ProductsTintent
