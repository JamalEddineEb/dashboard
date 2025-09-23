import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionForm } from './transaction-form/transaction-form';
import { Reports } from './reports/reports';

const routes: Routes = [
  { path: '', redirectTo: '/transactions', pathMatch: 'full' },
  { path: 'transactions', component: TransactionForm },
  { 
    path: 'categories', 
    loadComponent: () => import('./categories/categories').then(m => m.Categories)
  },
  { path: 'reports', component: Reports },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
