import { InvoicesService } from './invoices.service';
import { CustomersService } from './customers.service';
import { ProductsService } from './products.service';
import { HeaderService } from './header.service';
import { ModalBoxService } from './modal-box.service';


export const APP_SERVICE_PROVIDERS = [
  InvoicesService,
  CustomersService,
  ProductsService,
  HeaderService,
  ModalBoxService
];
