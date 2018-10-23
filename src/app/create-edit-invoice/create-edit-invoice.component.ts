import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { map, filter, switchMap, tap } from 'rxjs/operators';

import { Customer } from '../core/interfaces/customer';
import { Product } from '../core/interfaces/product';
import { Invoice } from '../core/interfaces/invoice';

import { CustomersService } from '../core/services/customers.service';
import { ProductsService } from '../core/services/products.service';
import { InvoicesService } from '../core/services/invoices.service';


@Component({
  selector: 'app-create-edit-invoice',
  templateUrl: './create-edit-invoice.component.html',
  styleUrls: ['./create-edit-invoice.component.scss']
})
export class CreateEditInvoiceComponent implements OnInit, OnDestroy {

  createInvoiceForm: FormGroup;
  customersList$: Observable<Customer[]>;
  productsList$: Observable<Product[]>;
  invoicesList$: Observable<Invoice[]>;
  createInvoiceFormSubscription: Subscription;
  productControlSubscription: Subscription;
  createInvoiceSubscription: Subscription;
  passCreateInvoiceRequest$: Subject<any> = new Subject();

  constructor(
    private customerService: CustomersService,
    private productsService: ProductsService,
    private invoicesService: InvoicesService,
  ) {
  }

  get createInvoiceArray() {
    return this.createInvoiceForm.get('items') as FormArray;
  }
  get createInvoiceDiscountControl() {
    return this.createInvoiceForm.get('discount');
  }
  get createInvoiceTotalControl() {
    return this.createInvoiceForm.get('total');
  }

  ngOnInit() {
    this.customersList$ = this.customerService.customersList$;
    this.productsList$ = this.productsService.productsList$;
    this.invoicesList$ = this.invoicesService.invoicesCollection$;

    // this.createInvoiceForm = new FormGroup({
    //   customer_id: new FormControl(null, Validators.required ),
    //   product_id: new FormControl(null, Validators.required),
    //   quantity: new FormControl(null, {
    //     validators: Validators.required,
    //     updateOn: 'blur'
    //   }),
    //   price: new FormControl(null),
    //   discount: new FormControl(null, {
    //     validators: Validators.required,
    //     updateOn: 'blur'
    //   }),
    //   total: new FormControl(),
    // });

    this.createInvoiceForm = new FormGroup({
      customer_id: new FormControl(null),
      discount: new FormControl(null, {
        updateOn: 'blur'
      }),
      total: new FormControl(),
      items: new FormArray([]),
    });

    this.createInvoiceArray.push(this.fillInvoiceArray());

    // this.createInvoiceFormSubscription = this.createInvoiceForm.valueChanges.pipe(
    //   filter(form =>  form.quantity && form.product_id),
    // ).subscribe(form => {
    //     const total = (+form.quantity * form.price) * ((100 - +form.discount) / 100);
    //     return this.createInvoiceTotalControl.patchValue(total, {onlySelf: true});
    //   }
    // );
    // this.productControlSubscription = this.createInvoiceProductControl.valueChanges.pipe(
    //   switchMap( productName => this.productsList$.pipe(
    //     map(products => _.find(products, {'id': productName}).price),
    //   ))
    // ).subscribe(price => this.createInvoicePriceControl.patchValue(price));

    this.createInvoiceSubscription = this.passCreateInvoiceRequest$.pipe(
      switchMap(data => {
        const invoiceItems = {
          product_id: data.product_id,
          quantity: data.quantity,
        };
        const invoice = {
          customer_id: data.customer_id,
          discount: data.discount,
          total: data.total,
          items: [{...invoiceItems}],
        };
        return this.invoicesService.postInvoiceRequest(invoice);
      }),
      tap(newInvoice => this.invoicesService.addInvoice$.next(newInvoice)),
    ).subscribe();
  }

  onSubmit() {
    this.passCreateInvoiceRequest$.next(this.createInvoiceForm.value);
  }

  fillInvoiceArray() {
    return new FormGroup({
      product_id: new FormControl(null, Validators.required),
      quantity: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'blur'
      }),
      price: new FormControl(null),
    });
  }

  ngOnDestroy() {
    // this.createInvoiceFormSubscription.unsubscribe();
    // this.productControlSubscription.unsubscribe();
    this.createInvoiceSubscription.unsubscribe();
  }
}
