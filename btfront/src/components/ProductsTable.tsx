import React from 'react'
import data from '../MOCK_DATA copy.json'


function productsTable() {
  return (
    <div>
      <table className='productsTable'>
        <thead>
          <tr>
            <th> </th>
            <th>Category</th>
            <th>Name</th>
            <th>Price</th>
            <th>Expiration Date</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  )
}

export default productsTable
