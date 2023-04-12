import { createContext, ReactNode, useEffect, useState } from 'react';

interface CartContextProviderProps {
  children: ReactNode;
}
export type Product = {
  id: number;
  name: string;
  price: number;
  imageSrc: string;
  amount: number;
};

export const CartContext = createContext({} as any);
export const CartContextProvider = ({ children }: CartContextProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  const addNewProductToCart = (currentProduct: Product) => {
    const productAlreadyAdded = products.findIndex((product) => currentProduct.id === product.id);

    if (productAlreadyAdded !== -1) {
      let newProcutList = [...products];
      const oldProductAmount = newProcutList[productAlreadyAdded].amount;
      newProcutList[productAlreadyAdded].amount = currentProduct.amount + oldProductAmount;
      setProducts(newProcutList);
      return;
    }

    setProducts((oldProduct) => [...oldProduct, currentProduct]);
  };

  const removeProductToCart = (currentProduct: Product) => {
    const newArr = products.filter((product) => currentProduct.id !== product.id);
    setProducts(newArr);
  };

  const updateLocalStorage = () => {
    const value = JSON.stringify(products);
    localStorage.setItem('coffe-delivery-cart', value);
  };

  const totalProductsInCart = products.reduce((total, item) => (total += item.amount), 0);

  const totalPrice = products
    .reduce((total, item) => (total += item.price * item.amount), 0)
    .toFixed(2);

  useEffect(() => {
    const retrieveProducts = localStorage.getItem('coffe-delivery-cart');

    if (retrieveProducts && JSON.parse(retrieveProducts).length > 0) {
      setProducts(JSON.parse(retrieveProducts));
      return;
    }
  }, []);

  useEffect(() => {
    updateLocalStorage();
  }, [products]);

  return (
    <CartContext.Provider
      value={{
        totalProductsInCart,
        addNewProductToCart,
        removeProductToCart,
        totalPrice,
        products,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
