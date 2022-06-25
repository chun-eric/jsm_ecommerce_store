import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  // are we showing the cart of are we not?
  const [showCart, setshowCart] = useState(false);
  const [cartItems, setcartItems] = useState([]);
  const [totalPrice, settotalPrice] = useState(0);
  const [totalQuantities, settotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  // variables will be used in the toggleCartItemQuantity
  let foundProduct;
  let index;

  // need to make a function that can add product and quantity into the cart
  const onAdd = (product, quantity) => {
    // is current item already in the cart?
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );
    settotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    settotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    // if current already in cart we need to check the price as well as the qnty amount. We dont need to make another instance of the product. Makes sense.
    // so the below if statements only increases the quantity and price
    // now we need to update the items in the cart
    // we get each individual item called cartProduct
    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product.id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });
      setcartItems(updatedCartItems);
    }
    // this checks if there is new product added to the cart and updates accordingly. We need to spread the cartItems and the new product object
    else {
      product.quantity = quantity;
      setcartItems([...cartItems, { ...product }]);
    }
    // we added a success toast after adding a new or existing product into the cart.
    toast.success(`${qty} ${product.name} added to the cart`);
  };

  // removing any item / product in our cart
  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);
    settotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    settotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setcartItems(newCartItems);
  };

  // making a new function that will toggle items amount and price inside the cart
  const toggleCartItemQuantity = (id, value) => {
    // first we need to find the product we are working with. We need to create a new foundProduct variable and index. Lets set it at the top where all the states are set.

    // so first find the item that matches our item
    foundProduct = cartItems.find((item) => item._id === id);
    // second get the index of the item that we found
    index = cartItems.findIndex((product) => product._id === id);
    // Next are we incrementing or decrementing this product?
    // Remember to never mutate the oringal array. We need to make a copy of it.
    //Whenever we try to reduce or add an extra qty inside the cart the product duplicates itself.
    // How do we fix this bug?
    // We need to create a new array that doesn’t mutate the original cartItems array.
    // We can use a filter method to get any item that doesn’t include the item id that matches the id already in the cart which is represented as id

    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === "inc") {
      setcartItems([
        ...newCartItems,
        { ...foundProduct, quantity: foundProduct.quantity + 1 },
      ]);
      settotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      settotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        setcartItems([
          ...newCartItems,
          { ...foundProduct, quantity: foundProduct.quantity - 1 },
        ]);
        settotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        settotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  // lets make function to add qty
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  // lets make function to decrease qty
  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        setcartItems,
        totalPrice,
        settotalPrice,
        totalQuantities,
        settotalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        showCart,
        setshowCart,
        toggleCartItemQuantity,
        onRemove,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// we are exporting the useStateContext through useContext and passing in our Context with all its values

export const useStateContext = () => useContext(Context);
