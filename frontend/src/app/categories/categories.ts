import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  categories$: Observable<Category[]>;
  categoryForm: FormGroup;
  showAddForm = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categories$ = this.categoryService.categories$;
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    // Categories are already loaded from the service
  }

  get categoryName() {
    return this.categoryForm.get('name');
  }

  addCategory() {
    if (this.categoryForm.valid) {
      const category: Category = this.categoryForm.value;
      this.categoryService.addCategory(category).subscribe(() => {
        this.categoryForm.reset();
        this.showAddForm = false;
      });
    }
  }

  editCategory(category: Category) {
    const newName = prompt('Edit category name:', category.name);
    const newDescription = prompt('Edit category description:', category.description || '');
    
    if (newName && newName.trim()) {
      const updatedCategory: Category = {
        ...category,
        name: newName.trim(),
        description: newDescription?.trim() || ''
      };
      
      this.categoryService.updateCategory(updatedCategory).subscribe();
    }
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe();
  }
}
