import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionsService } from '../services/transactions-service';
import { Observable } from 'rxjs';
import { transaction } from '../interfaces/transaction';

@Component({
  selector: 'app-transaction-list-component',
  standalone: false,
  templateUrl: './transaction-list-component.html',
})
export class TransactionListComponent implements OnInit {
  transactions$!: Observable<transaction[]>;

  constructor(
    public router: Router,
    public transactionService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.transactions$ = this.transactionService.transactions$;
  }

  editTransaction(transaction: transaction): void {
    // For now, just log the transaction to edit
    console.log('Edit transaction:', transaction);
    // You can implement navigation to an edit form or open a modal here
    // For example: this.router.navigate(['/edit-transaction', transaction.id]);
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id).subscribe(() => {
      console.log('Transaction deleted successfully');
    });
  }
}
