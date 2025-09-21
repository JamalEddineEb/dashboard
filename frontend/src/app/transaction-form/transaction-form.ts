import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { transaction } from '../interfaces/transaction';
import { Category } from '../interfaces/category';
import { TransactionsService } from '../services/transactions-service';
import { CategoryService } from '../services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.html',
  standalone: false, 
  styleUrls: ['./transaction-form.css']
})
export class TransactionForm implements OnInit {
  transactionForm: FormGroup;
  transactions: Array<transaction> = [];
  categories$: Observable<Category[]>;

  constructor(
    public router: Router, 
    public transactionService: TransactionsService,
    public categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.transactionForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
      amount: [1, [Validators.required, Validators.min(0.01)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      type: ['expense', Validators.required],
      date: ['', Validators.required],
      categoryId: ['', Validators.required], // Changed to categoryId
      description: ['']
    });
    
    this.categories$ = this.categoryService.categories$;
  }

  ngOnInit() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    this.transactionForm.patchValue({ date: today });
  }

  // Convenience getters for form controls
  get name() { return this.transactionForm.get('name'); }
  get amount() { return this.transactionForm.get('amount'); }
  get price() { return this.transactionForm.get('price'); }
  get type() { return this.transactionForm.get('type'); }
  get date() { return this.transactionForm.get('date'); }
  get categoryId() { return this.transactionForm.get('categoryId'); }
  get description() { return this.transactionForm.get('description'); }

  addTransaction() {
    if (this.transactionForm.valid) {
      const transaction: transaction = this.transactionForm.value;
      console.log(transaction,'nn');

      
      try {
        this.transactionService.addTransaction(transaction).subscribe({
          next: (response) => {
            console.log(transaction,'yy');
            
            this.transactions.push(response);
            // Reset the form
            this.transactionForm.reset();
            // Set default values again
            this.transactionForm.patchValue({ 
              type: 'expense',
              date: new Date().toISOString().split('T')[0]
            });
          },
          error: (error) => {
            console.error('Failed to add transaction:', error);
            alert('Failed to add transaction: ' + error.message);
          }
        });
      } catch (error: any) {
        console.error('Validation error:', error);
        alert('Validation error: ' + error.message);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.transactionForm.controls).forEach(key => {
        this.transactionForm.get(key)?.markAsTouched();
      });
    }
  }
}
