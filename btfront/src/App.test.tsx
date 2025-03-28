import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import App from './App';
import "whatwg-fetch";

describe("<App/>", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("fetchData should fetch products and update state", async () => {
    jest.clearAllMocks()
    const mockProducts = [
      {
        productId: 12,
        productName: "Hat",
        productCategory: "Clothes",
        productPrice: "21",
        productExpirationDate: "2024-7-19",
        productQuantityStock: 20,
        },
      ];
    const mockSummary=[{
      "categoryName": "Clothes",
      "totalProducts": 21,
      "totalValue": 441.0,
      "averagePrice": 1.0
      }];
    const mockCategories = ["Clothes"];

    // Mock para obtener productos
    (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts, // 📌 Esto es lo que falta en tu test
    }) // Productos
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockSummary,
    }) // Resumen
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    }); // Categorías



    render(<App />);
    await waitFor(() => {
      const productElement = screen.getByText(/Hat/i);
      expect(productElement).toBeInTheDocument(); // Esto debe pasar si se renderiza correctamente
    });
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("http://localhost:9090/products"));
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

    test("newProductSubmit should POST new product data", async () => {
      const mockData = {
        productName: "New Product",
        productCategory: ["Category A"],
        productQuantityStock: 10,
        productPrice: 20,
        productExpirationDate: "2023-12-31",
      };

      // Mock the fetch call
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ message: "The product has been added" }),
        })
      );

      render(<App />);

      // Open the "New Product" modal
      const buttonNewProduct = screen.getByText(/New Product/i);
      fireEvent.click(buttonNewProduct);

        // Fill out the form
      const nameInput = screen.getByPlaceholderText(/Hat/i);
      const categoryInput = screen.getByTestId("select");
      const stockInput = screen.getByPlaceholderText(/45/i);
      const priceInput = screen.getByTestId("productPrice");
      const dateInput = screen.getByTestId("productExpirationDate");
      const saveButton = screen.getByTestId("buttonNewProduct");

      fireEvent.change(nameInput, { target: { value: mockData.productName } });

      // Intento 1: Seleccionar categoría
      await userEvent.selectOptions(categoryInput, "new");
    
      fireEvent.blur(categoryInput);
      await waitFor(() => expect(categoryInput).toHaveValue("new"));
    
      // Intento 2: Asegurar que el input de nueva categoría aparece
      const newCategory = await screen.findByTestId("newCategory");
      fireEvent.change(newCategory, { target: { value: mockData.productCategory[0] } });
    
      fireEvent.change(stockInput, { target: { value: 45 } });
      fireEvent.change(priceInput, { target: { value: mockData.productPrice } });
      fireEvent.change(dateInput, { target: { value: mockData.productExpirationDate } });
    
      // Debug antes de enviar
      console.log("fetch exists?", fetch);
      console.log("Antes de hacer submit:");
      console.log({
        name: (nameInput as HTMLInputElement).value,
        category: (categoryInput as HTMLInputElement).value,
        newCategory: (newCategory as HTMLInputElement).value,
        stock: (stockInput as HTMLInputElement).value,
        price: (priceInput as HTMLInputElement).value,
        date: (dateInput as HTMLInputElement).value,
      });
    
      // Click en guardar
      fireEvent.click(saveButton); 
      // Wait for the fetch call to be made
      await waitFor(() =>{
        const info = screen.getByTestId("newProductModalInfo");
        expect(info.textContent).toBe("The product has been added");
        }
      );
    });
  test("deleteProduct should DELETE a product", async () => {
    jest.clearAllMocks()
    const productId = 12; // Usamos el productId del mock real
    // Mock para la llamada que obtiene los productos
    const mockProducts = [
      {
        productId: 12,
        productName: "Hat",
        productCategory: "Clothes",
        productPrice: "21",
        productExpirationDate: "2024-7-19",
        productQuantityStock: 21,
        },
      ];
    const mockSummary=[{
      "categoryName": "Clothes",
      "totalProducts": 21,
      "totalValue": 441.0,
      "averagePrice": 1.0
      }];
    const mockCategories = ["Clothes"];

    // Mock para obtener productos
    (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts, // 📌 Esto es lo que falta en tu test
    }) // Productos
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockSummary,
    }) // Resumen
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    }); // Categorías



    render(<App />); // Renderiza el componente aquí
    // Espera a que el producto se renderice en la interfaz
     // Espera a que el producto se renderice en la interfaz
     await waitFor(() => {
       const productElement = screen.getByText(/Hat/i); // Busca el nombre del producto
       expect(productElement).toBeInTheDocument();
     }, { timeout: 3000 });

     // Simula el clic en el botón de eliminar
     (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true, 
      json: async () => ({ message: "Deleted" }),
    });
     const deleteButton = screen.getByText(/Delete/i); // Asegúrate de que el texto coincida con el botón de eliminar
     fireEvent.click(deleteButton);

     // Espera a que se llame al fetch para la eliminación
     await waitFor(() =>
       expect(global.fetch).toHaveBeenCalledWith(`http://localhost:9090/products/${productId}/delete`, {
         method: "DELETE",
         headers: { "Content-type": "application/json" },
       })
     );

     // Verifica que el fetch haya sido llamado una vez
     expect(global.fetch).toHaveBeenCalledTimes(4); // Asegúrate de contar las llamadas adecuadamente

     // Verifica que el producto ya no esté en el DOM
     await waitFor(() => {
       const productElement = screen.queryByText(/Hat/i);
       expect(productElement).not.toBeInTheDocument(); // El producto ya no debería estar en el DOM
     });
  });

  test("reStockHandler should PUT product in stock", async () => {
    jest.clearAllMocks()
    const productId = 12; // Usamos el productId del mock real
    // Mock para la llamada que obtiene los productos
    const mockProducts = [
      {
        productId: 12,
        productName: "Hat",
        productCategory: "Clothes",
        productPrice: "21",
        productExpirationDate: "2024-7-19",
        productQuantityStock: 0,
        },
      ];
    const mockSummary=[{
      "categoryName": "Clothes",
      "totalProducts": 21,
      "totalValue": 441.0,
      "averagePrice": 1.0
      }];
    const mockCategories = ["Clothes"];

    // Mock para obtener productos
    (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts, // 📌 Esto es lo que falta en tu test
    }) // Productos
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockSummary,
    }) // Resumen
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    }); // Categorías



    render(<App />);
    await waitFor(() => {
      const productElement = screen.getByText(/Hat/i);
      expect(productElement).toBeInTheDocument(); // Esto debe pasar si se renderiza correctamente
    });
    const checkbox = screen.getByTestId("checkStock");
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true, 
      json: async () => ({ message: "Product with id:"+ productId+"has been restocked." }),
    });
    fireEvent.click(checkbox);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(`http://localhost:9090/products/${productId}/instock`, {
        method: "PUT",
        body: JSON.stringify([]),
        headers: { "Content-type": "application/json" },
      })
    );
    expect(global.fetch).toHaveBeenCalledTimes(4);
  });

  test("outStockHandler should POST product out of stock", async () => {
    jest.clearAllMocks()
    const productId = 12; // Usamos el productId del mock real
    // Mock para la llamada que obtiene los productos
    const mockProducts = [
      {
        productId: 12,
        productName: "Hat",
        productCategory: "Clothes",
        productPrice: "21",
        productExpirationDate: "2024-7-19",
        productQuantityStock: 20,
        },
      ];
    const mockSummary=[{
      "categoryName": "Clothes",
      "totalProducts": 21,
      "totalValue": 441.0,
      "averagePrice": 1.0
      }];
    const mockCategories = ["Clothes"];

    // Mock para obtener productos
    (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts, // 📌 Esto es lo que falta en tu test
    }) // Productos
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockSummary,
    }) // Resumen
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    }); // Categorías



    render(<App />);
    await waitFor(() => {
      const productElement = screen.getByText(/Hat/i);
      expect(productElement).toBeInTheDocument(); // Esto debe pasar si se renderiza correctamente
    });
    const checkbox = screen.getByTestId("checkStock");
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true, 
      json: async () => ({ message: "Product with id: "+ productId+" has been marked as out of stock." }),
    });
    fireEvent.click(checkbox);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(`http://localhost:9090/products/${productId}/outofstock`, {
        method: "POST",
        body: JSON.stringify([]),
        headers: { "Content-type": "application/json" },
      })
    );
    expect(global.fetch).toHaveBeenCalledTimes(4);
});
  test("editProduct should change the products", async () => {
    jest.clearAllMocks()
    const mockProducts = [
      {
        productId: 12,
        productName: "Hat",
        productCategory: "Clothes",
        productPrice: "21",
        productExpirationDate: "",
        productQuantityStock: 21,
        },
      ];
    const productSearched = {
      "productId": 12,
      "productName": "Hat",
      "productCategory": [
          "Clothes"
      ],
      "productPrice": 21,
      "productExpirationDate": "",
      "productQuantityStock": 21,
      "productCreationDate": "2025-03-26",
      "productUpdateDate": "2025-03-27"
  }
    const mockSummary=[{
      "categoryName": "Clothes",
      "totalProducts": 21,
      "totalValue": 441.0,
      "averagePrice": 1.0
      }];
    const mockCategories = ["Clothes"];

    // Mock para obtener productos
    (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      status:200,
      json: async () => mockProducts,
    }) // Productos
    .mockResolvedValueOnce({
      ok: true,
      status:200,
      json: async () => mockSummary,
    }) // Resumen
    .mockResolvedValueOnce({
      ok: true,
      status:200,
      json: async () => mockCategories,
    })
    render(<App />);
     await waitFor(() => {
       const productElement = screen.getByText(/Hat/i); // Busca el nombre del producto
       expect(productElement).toBeInTheDocument();
     });

    // Open the "New Product" modal
    (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      status:200,
      json: async () => productSearched,
    }) // Productos
    const buttonEditProduct = screen.getByText(/Edit/i);
    fireEvent.click(buttonEditProduct);

      // Fill out the form
    await waitFor(() => {
      const nameInput = screen.getByTestId("editName");
      const stockInput = screen.getByTestId("editStock");
      const priceInput = screen.getByTestId("editPrice");
      const dateInput = screen.getByTestId("editDate");
      const sendEdit = screen.getByTestId("editButton");
      expect(nameInput).toBeInTheDocument();
      expect(priceInput).toBeInTheDocument();
      expect(stockInput).toBeInTheDocument();
      expect(dateInput).toBeInTheDocument();
      expect(sendEdit).toBeInTheDocument();
    });
      const nameInput = screen.getByTestId("editName");
      const selectInput = screen.getByTestId("selectEdit");
      const stockInput = screen.getByTestId("editStock");
      const priceInput = screen.getByTestId("editPrice");
      const dateInput = screen.getByTestId("editDate");
      const sendEdit = screen.getByTestId("editButton");

      fireEvent.change(nameInput, { target: { value: "Gloves" } });
      fireEvent.change(selectInput, { target: { value: "Clothes" } });
      fireEvent.blur(selectInput); // Simula que el usuario deja el campo
      fireEvent.change(stockInput, { target: { value: "300" } });
      fireEvent.change(priceInput, { target: { value: "999" } });
      fireEvent.change(dateInput, { target: { value: "" } });
      console.log("fetch exists?", fetch);
      console.log("Antes de hacer submit:");
      console.log({
        name: (nameInput as HTMLInputElement).value,
        category: (selectInput as HTMLInputElement).value,
        stock: (stockInput as HTMLInputElement).value,
        price: (priceInput as HTMLInputElement).value,
        date: (dateInput as HTMLInputElement).value,
      });
    // // Simula el clic en el botón de eliminar
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status:200,
          json: async () => ({ message: "The product has been modified correctly" }),
       }); // Mock for the edit product response
    // // Click en guardar
      fireEvent.click(sendEdit); 
    // // Wait for the fetch call to be made
      await waitFor(() => {
        const info = screen.getByTestId("editInfo");
        expect(info.textContent).toBe("The product has been modified correctly");
      });
  })
});

