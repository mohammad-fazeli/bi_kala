import Product from "../models/product.model";
import Order from "../models/order.model";

export const updateProducts = async (
  items: Array<{
    id: string;
    quantity: number;
  }>,
  operation: string
) => {
  if (operation === "buy") {
    for (const item of items) {
      try {
        const product = await Product.findById(item.id);
        if (product) {
          product.number = product.number - item.quantity;
          if (product.number === 0) {
            product.availability = false;
          }
        }
        await product.save();
      } catch (err) {
        continue;
      }
    }
  } else if (operation === "cancel") {
    for (const item of items) {
      try {
        const product = await Product.findById(item.id);
        if (product) {
          product.number = product.number + item.quantity;
          product.availability = true;
        }
        await product.save();
      } catch (err) {
        continue;
      }
    }
  }
};

export const createOrder = async (
  id: string,
  cart: Array<{
    id: string;
    quantity: number;
    name: string;
    price: number;
    discount: number;
    image: string;
  }>,
  amount: number,
  paymentType: string,
  address: {
    street: string;
    city: string;
    state: string;
    alley: string;
    HouseNumber: string;
  }
) => {
  const order = new Order({
    amount,
    userId: id,
    address,
    items: cart,
    paymentType,
  });
  await order.save();
  return order._id;
};
