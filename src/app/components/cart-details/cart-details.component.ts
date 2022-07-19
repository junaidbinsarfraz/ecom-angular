import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalQuantity: number = 0;
  totalPrice: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.initializeCartItems();
  }

  initializeCartItems() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);

    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.computeTotalPrice();
  }

  increamentQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decreamentQuantity(cartItem: CartItem) {
    this.cartService.decrementItem(cartItem);
  }

  removeItem(cartItem: CartItem) {
    this.cartService.removeItem(cartItem);
  }

}
