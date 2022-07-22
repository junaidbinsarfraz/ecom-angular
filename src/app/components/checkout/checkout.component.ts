import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/models/cart-item';
import { Country } from 'src/app/common/models/country';
import { Order } from 'src/app/common/models/order';
import { OrderItem } from 'src/app/common/models/order-item';
import { Purchase } from 'src/app/common/models/purchase';
import { State } from 'src/app/common/models/state';
import { CustomValidators } from 'src/app/common/validators/custom-validators';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private fb: FormBuilder, 
              private formService: FormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      customer: this.fb.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.fb.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.fb.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.fb.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      }),
    });

    this.formService.getCreditCardMonths(new Date().getMonth() + 1).subscribe(data => this.creditCardMonths = data);
    this.formService.getCreditCardYears().subscribe(data => this.creditCardYears = data);

    this.formService.getCountries().subscribe(data => this.countries = data);

    this.reviewCartDetails();
  }

  formSubmit() {
    if(this.checkoutForm.invalid) {
      this.checkoutForm.markAsTouched();
      return;
    }

    let order: Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems: CartItem[] = this.cartService.cartItems;

    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    let purchase: Purchase = new Purchase();

    purchase.shippingAddress = this.checkoutForm.controls["shippingAddress"].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutForm.controls["billingAddress"].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    purchase.customer = this.checkoutForm.controls["customer"].value

    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(response.orderTrackingNumber);

          this.resetCard();
        },
        error: err => {
          alert(err);
        }
      }
    )

  }

  copyShippingToBillingAddress(event) {
    if(event.target.checked) {
      this.checkoutForm.controls.billingAddress.setValue(this.checkoutForm.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutForm.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  updateCreditCardMonths() {
    const startYear: number = new Date().getFullYear();
    const currentYear: number = Number(this.checkoutForm.get('creditCard').value.expirationYear);

    let startMonth: number = 1;

    if(currentYear == startYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data);
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutForm.get(formGroupName);
    const countryCode: string = formGroup.value.country.code;

    this.formService.getStates(countryCode).subscribe(data => {
      if(formGroupName == 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      formGroup.get('state').setValue(data[0]);
    });
  }

  private resetCard() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutForm.reset();

    this.router.navigateByUrl('/products');
  }

  private reviewCartDetails() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
  }

  get firstName() { return this.checkoutForm.get('customer.firstName'); }
  get lastName() { return this.checkoutForm.get('customer.lastName'); }
  get email() { return this.checkoutForm.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutForm.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutForm.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutForm.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutForm.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutForm.get('shippingAddress.country'); }
  
  get billingAddressStreet() { return this.checkoutForm.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutForm.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutForm.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutForm.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutForm.get('billingAddress.country'); }
  
  get creditCardType() { return this.checkoutForm.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutForm.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutForm.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutForm.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutForm.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutForm.get('creditCard.expirationYear'); }

}
