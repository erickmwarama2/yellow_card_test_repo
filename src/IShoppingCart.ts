import { ICartTotal } from './ICartTotal';
import { IItem } from './IItem';
import { IUser } from './IUser';

export interface IShoppingCart {
  user: IUser;
  items: IItem[];
  cart_total: ICartTotal;
}
