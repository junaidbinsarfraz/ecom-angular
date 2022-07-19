import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuality: Subject<number> = new Subject<number>();

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

  private computeTotalPrice() {
    let totalPrice: number = 0;
    let totalQuality: number = 0;

    this.cartItems.forEach(cartItem => {
      totalPrice += cartItem.unitPrice * cartItem.quantity;
      totalQuality += cartItem.quantity;
    })

    this.totalPrice.next(totalPrice);
    this.totalQuality.next(totalQuality);

    console.log(totalPrice);
    console.log(totalQuality);
  }
}
