import * as React from 'react';
import { render, screen, fireEvent, getByPlaceholderText, waitFor } from '@testing-library/react';
import App from './App';
import * as DeprecatedReactTestUtils from 'react-dom/test-utils'
import { json } from 'stream/consumers';
import userEvent from '@testing-library/user-event';


describe("<App/>", ()=>{
  //   test("Test creating a new product", async ()=>{
  //   render(<App/>);
  //   const buttonNewProduct = screen.getByText(/New Product/i);
  //   fireEvent.click(buttonNewProduct)
  //   const nameInput  = screen.getByLabelText(/Name/i);
  //   const categoryInput  = screen.getByTestId('select')
  //   const stockInputconst= screen.getByLabelText(/Stock/i);
  //   const unitPriceInputconst= screen.getByLabelText(/Unit Price/i);
  //   const addProduct = screen.getByText(/Save/i);
  //   const closeModal = screen.getByText(/Cancel/i);
  //   fireEvent.change(nameInput,{target: {value: 'Dog'}})
  //   fireEvent.change(categoryInput,{target: {value: 'new'}})
  //   const newCategory = screen.getByPlaceholderText(/Clothes/i);    
  //   fireEvent.change(newCategory,{target: {value: 'pets'}})
  //   fireEvent.change(stockInputconst,{target: {value: 15}})
  //   fireEvent.change(unitPriceInputconst,{target: {value: 20}})
  //   fireEvent.click(addProduct)
    
  //   await userEvent.click()
  //   const info = screen.getByTestId(/newProductModalInfo/i);
  //   expect(info.value).toHaveBeenCalledWith(addProduct);
  //   //expect(info.value).toBe('')

  // })

   test("New product modal exists", ()=>{
    render(<App/>);
    const buttonNewProduct = screen.getByText(/New Product/i);
    fireEvent.click(buttonNewProduct)
    const nameInput  = screen.getByLabelText(/Name/i);
    const categoryInput  = screen.getByTestId('select')
    const stockInputconst= screen.getByLabelText(/Stock/i);
    const unitPriceInputconst= screen.getByLabelText(/Unit Price/i);
    const addProduct = screen.getByText(/Save/i);
    const closeModal = screen.getByText(/Cancel/i);
    expect(nameInput).toBeInTheDocument;
    expect(categoryInput).toBeInTheDocument;
    expect(stockInputconst).toBeInTheDocument;
    expect(unitPriceInputconst).toBeInTheDocument;
    expect(addProduct).toBeInTheDocument;
    expect(closeModal).toBeInTheDocument;
   })
  // test("Test deleting a product")
  // test("Filtering by name")
  // test("Filtering by category")
  // test("Filtering by availability")
  // test("Mark as out of stock")
  // test("Mark as stocked")
})

  
