import {
  addItemToCart,
  applyDiscountToCart,
  EmptyCartError,
  submitCart,
  CartWithZeroTotalError,
  CartWithInvalidAddressError,
} from '../addItemToCart';
import { IAddress } from '../IAddress';
import { IItem } from '../IItem';
import { IShoppingCart } from '../IShoppingCart';
import { IUser } from '../IUser';

describe('Tests for the shopping cart', () => {
  const user_cart: IItem[] = [];
  let user: IUser;
  let address: IAddress;

  beforeEach(() => {
    for (let i = 0; i < 5; i++) {
      const item = { name: 'item ' + i.toString(), price: i * 100 };
      user_cart.push(item);
    }

    address = {
      street: 'street',
      code: 1,
      province: 'province',
      city: 'city',
    };

    user = {
      name: 'name',
      user_id: 1,
      address,
    };
  }),
    test('adds item to shopping cart', () => {
      let cart: IShoppingCart = {
        user,
        items: [],
        cart_total: {
          before: 0,
          after: 0,
        },
      };

      const no_of_items = cart.items.length;
      const item: IItem = user_cart[0];

      cart = addItemToCart(cart, item);

      expect(cart.items.length).toEqual(no_of_items + 1);
    });

  test('cart total is calculated correctly before and after tax', () => {
    let cart: IShoppingCart = {
      user,
      items: [],
      cart_total: {
        before: 0,
        after: 0,
      },
    };

    let before_total = 0;

    user_cart.forEach((item) => {
      before_total += item.price;
      cart = addItemToCart(cart, item);
    });

    const after_total: number = 1.15 * before_total;

    expect(cart.cart_total.before).toEqual(before_total);
    expect(cart.cart_total.after).toEqual(after_total);
  });

  test('adds a 5% discount for every even item', () => {
    let cart: IShoppingCart = {
      user,
      items: [],
      cart_total: {
        before: 0,
        after: 0,
      },
    };

    const before_total = 0;

    user_cart.forEach((item) => {
      cart = addItemToCart(cart, item);
    });

    let discount = 0;

    cart.items.forEach((item, index) => {
      if (index % 2 !== 0) {
        discount += 0.95 * item.price;
      }
    });

    expect(applyDiscountToCart(cart, 0.05)).toEqual(discount);
  });

  test('should throw cart not empty error', () => {
    const cart: IShoppingCart = {
      user,
      items: [],
      cart_total: {
        before: 0,
        after: 0,
      },
    };

    try {
      submitCart(cart);
    } catch (error) {
      expect(error).toBeInstanceOf(EmptyCartError);
    }

    // expect(submitCart(cart)).toThrow(EmptyCartError);
  });

  test('should throw cart zero total error', () => {
    const cart: IShoppingCart = {
      user,
      items: [{ name: 'name', price: 0 }],
      cart_total: {
        before: 0,
        after: 0,
      },
    };

    try {
      submitCart(cart);
    } catch (error) {
      expect(error).toBeInstanceOf(CartWithZeroTotalError);
    }

    // expect(submitCart(cart)).toThrow(CartWithZeroTotalError);
  });

  test('should throw invalid address error', () => {
    user.address.city = '';
    user.address.code = 0;
    user.address.province = '';
    user.address.street = '';

    const cart: IShoppingCart = {
      user,
      items: [{ name: 'name', price: 0 }],
      cart_total: {
        before: 100,
        after: 115,
      },
    };

    try {
      submitCart(cart);
    } catch (error) {
      expect(error).toBeInstanceOf(CartWithInvalidAddressError);
    }
    // expect(submitCart(cart)).toThrow(CartWithInvalidAddressError);
  });
});
