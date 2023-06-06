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

export type User = {
  name: string,
  id: number,
  userGroup: string,
  email: string,
  status: string
};

export const CartContext = createContext({} as any);
export const CartContextProvider = ({ children }: CartContextProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [userLoged, setUserLoged] = useState<User>();
  const [isLoged, setIsLoged] = useState(false);

  const addNewProductToCart = (currentProduct: Product, pageType?: string, descrease?: boolean) => {
    const productAlreadyAdded = products.findIndex((product) => currentProduct.id === product.id);

    if (productAlreadyAdded !== -1) {
      let newProcutList = [...products];
      const oldProductAmount = newProcutList[productAlreadyAdded].amount;

      let newAmount = currentProduct.amount + (descrease ? (oldProductAmount * -1) : oldProductAmount);
      if (pageType === 'cart') {
        newAmount = currentProduct.amount + (descrease ? -1 : 1);
      }

      newProcutList[productAlreadyAdded].amount = newAmount;
      setProducts(newProcutList);
      return;
    }

    setProducts((oldProduct) => [...oldProduct, currentProduct]);
  };

  const removeProductToCart = (currentProduct: Product) => {
    const newArr = products.filter((product) => currentProduct.id !== product.id);
    setProducts(newArr);
  };

  const cleanCart = () => {
    setProducts([]);
  }

  const updateLocalStorage = () => {
    const value = JSON.stringify(products);
    localStorage.setItem('coffe-delivery-cart', value);
  };

  const signIn = (user: User) => {
    setUserLoged(user);
    setIsLoged(true);
  }

  const signOut = () => {
    setUserLoged(undefined);
    setIsLoged(false);
  }

  const totalProductsInCart = products.reduce((total, item) => (total += item.amount), 0);

  const totalPrice = products
    .reduce((total, item) => (total += item.price * item.amount), 0)
    .toLocaleString();

  const totalPriceNumber = products
    .reduce((total, item) => (total += item.price * item.amount), 0);

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
        cleanCart,
        totalPrice,
        products,
        signIn,
        signOut,
        userLoged,
        isLoged,
        totalPriceNumber
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
