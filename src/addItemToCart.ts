import { IAddress } from './IAddress';
import { IItem } from './IItem';
import { IShoppingCart } from './IShoppingCart';

export function addItemToCart(cart: IShoppingCart, item: IItem): IShoppingCart {
  cart.items.push(item);
  cart.cart_total.before += item.price;
  cart.cart_total.after = 1.15 * cart.cart_total.before;
  return cart;
}

export function applyDiscountToCart(
  cart: IShoppingCart,
  discount_rate: number,
): number {
  const cart_items: IItem[] = cart.items;
  let discount = 0;

  cart_items.forEach((item, index) => {
    if (index % 2 !== 0) {
      discount += item.price * (1 - discount_rate);
    }
  });

  return discount;
}

export function submitCart(cart: IShoppingCart): void {
  if (cart.items.length == 0) {
    throw new EmptyCartError('cannot submit empty cart');
  } else if (cart.cart_total.before == 0) {
    throw new CartWithZeroTotalError('cannot submit cart with total of zero');
  }

  const address: IAddress | undefined = cart.user?.address;

  if (address == undefined) {
    throw new CartWithoutAddressError('cannot submit cart without an address');
  } else if (
    address.street == '' ||
    address.province == '' ||
    address.city == '' ||
    address.code == 0
  ) {
    throw new CartWithInvalidAddressError(
      'Cannot submit cart with an invalid address',
    );
  }
}

export class EmptyCartError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CartWithZeroTotalError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CartWithoutAddressError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CartWithInvalidAddressError extends Error {
  constructor(message: string) {
    super(message);
  }
}
