import { Component, OnDestroy, OnInit, QueryList, ViewChildren, } from '@angular/core';

import { MatTabLink } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';

import { InvoicesService } from '../services/invoices.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  @ViewChildren(MatTabLink) inkBar: QueryList<any>;
  
  invoicesAmount$: Observable<string>;
  hideNavInkBarSubscription: Subscription;
  
  navItems: { path: string, label: string }[] = [
    { path: '/products', label: 'Products' },
    { path: '/customers', label: 'Customers'},
    { path: '/invoices', label: 'Invoices'},
  ];

  constructor(
    private invoicesService: InvoicesService,
  ) {
  }

  ngOnInit() {
    this.invoicesAmount$ = this.invoicesService.invoicesCollection$.pipe(
      map(invoices => invoices ? `(${invoices.length})` : '')
    );
    
    this.hideNavInkBarSubscription = this.invoicesService.hideNavInkBar$
      .subscribe(() => this.hideInkBar());
  }
  
  ngOnDestroy() {
    this.hideNavInkBarSubscription.unsubscribe();
  }

  hideInkBar() {
    this.inkBar.last._elementRef.nativeElement.nextElementSibling.style.visibility = 'hidden';
  }
}
