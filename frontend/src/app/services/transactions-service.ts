import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { transaction } from '../interfaces/transaction';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  // internal state holder
  private transactionsSubject = new BehaviorSubject<transaction[]>([]);
  // observable for components to subscribe to
  transactions$ = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTransactions();
  }

  /** initial load */
  private loadTransactions(): void {
    this.http.get<transaction[]>(this.apiUrl).subscribe(data => {
      this.transactionsSubject.next(data);
    });
  }

  /** add */
  addTransaction(tx: transaction): Observable<transaction> {
    // Validate transaction data
    this.validateTransaction(tx);
    
    return this.http.post<transaction>(this.apiUrl, tx).pipe(
      tap(c => {
        this.loadTransactions();
      })
    );
  }

  /** validate transaction data */
  private validateTransaction(tx: transaction): void {
    if (!tx.name || !tx.name.trim()) {
      throw new Error('Transaction name is required and cannot be empty');
    }
    
    if (tx.amount <= 0) {
      throw new Error('Transaction amount must be greater than 0');
    }
    
    if (tx.price <= 0) {
      throw new Error('Transaction price must be greater than 0');
    }
    
    if (!tx.date) {
      throw new Error('Transaction date is required');
    }
    
    if (!['income', 'expense'].includes(tx.type)) {
      throw new Error('Transaction type must be either "income" or "expense"');
    }
  }

  // /** update */
  // updateTransaction(tx: transaction): Observable<transaction> {
  //   return this.http.put<transaction>(`${this.apiUrl}`, tx).pipe(
  //     tap(updated => {
  //       const current = this.transactionsSubject.value;
  //       const index = current.findIndex(t => t.id === updated.id);
  //       if (index !== -1) {
  //         current[index] = updated;
  //         this.transactionsSubject.next([...current]);
  //       }
  //     })
  //   );
  // }

  /** delete */
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadTransactions(); // Reload transactions after delete
      })
    );
  }
}
