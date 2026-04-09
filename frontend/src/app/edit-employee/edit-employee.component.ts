import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  employeeId!: string;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      date_of_joining: ['', Validators.required], 
      department: ['', Validators.required],
      employee_photo: ['']
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.employeeId) {
      this.router.navigate(['/employees']);
      return;
    }

    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        // Strip the time part from date_of_joining for `<input type="date">`
        let doj = employee.date_of_joining;
        if (doj && doj.indexOf('T') !== -1) {
          doj = doj.split('T')[0];
        }

        this.employeeForm.patchValue({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: doj,
          department: employee.department,
          employee_photo: employee.employee_photo
        });
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading employee', 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;

    this.isSubmitting = true;
    this.employeeService.updateEmployee(this.employeeId, this.employeeForm.value).subscribe({
      next: () => {
        this.snackBar.open('Employee updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackBar.open(err.message || 'Error updating employee', 'Close', { duration: 4000, panelClass: 'error-snackbar' });
      }
    });
  }
}
