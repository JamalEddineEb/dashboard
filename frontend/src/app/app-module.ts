import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TransactionForm } from './transaction-form/transaction-form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { TransactionListComponent } from './transaction-list-component/transaction-list-component';
import { Header } from './header/header';
import { Categories } from './categories/categories';
import { Reports } from './reports/reports';

@NgModule({
  declarations: [
    App,
    TransactionForm,
    TransactionListComponent,
    Header,
    Reports
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ],
  bootstrap: [App]
})
export class AppModule { }
