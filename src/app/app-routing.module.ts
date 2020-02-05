import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { AddressComponent } from './address/address.component';
import { BasketComponent } from './basket/basket.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'address', component: AddressComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'product', component: ProductComponent },
  { path: 'category', component: CategoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
