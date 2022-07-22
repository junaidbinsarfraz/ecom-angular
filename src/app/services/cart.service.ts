import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(cartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = null;

    existingCartItem = this.cartItems.find(ci => ci.id == cartItem.id);

    alreadyExistsInCart = existingCartItem != undefined;

    if(alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeTotalPrice();
  }

  decrementItem(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity == 0) {
      this.removeItem(cartItem);
    } else {
      this.computeTotalPrice();
    }
  }

  removeItem(cartItem: CartItem) {
    const itemIndex: number = this.cartItems.findIndex(c => c.id == cartItem.id);

    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      
      this.computeTotalPrice();
    }
  }

  computeTotalPrice() {
    let totalPrice: number = 0;
    let totalQuality: number = 0;

    this.cartItems.forEach(cartItem => {
      totalPrice += cartItem.unitPrice * cartItem.quantity;
      totalQuality += cartItem.quantity;
    })

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuality);

    console.log(totalPrice);
    console.log(totalQuality);
  }
}
