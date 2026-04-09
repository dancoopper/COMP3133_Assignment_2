import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo?: string;
}

const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      id
      first_name
      last_name
      email
      department
      designation
      salary
      gender
      date_of_joining
    }
  }
`;

const SEARCH_EMPLOYEES = gql`
  query SearchEmployeeByDesignationOrDepartment($designation: String, $department: String) {
    searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
      id
      first_name
      last_name
      email
      department
      designation
      salary
      gender
      date_of_joining
    }
  }
`;

const GET_EMPLOYEE_BY_ID = gql`
  query SearchEmployeeByEid($id: ID!) {
    searchEmployeeByEid(id: $id) {
      id
      first_name
      last_name
      email
      department
      designation
      salary
      gender
      date_of_joining
      employee_photo
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation AddNewEmployee(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String!
    $designation: String!
    $salary: Float!
    $date_of_joining: String!
    $department: String!
    $employee_photo: String
  ) {
    addNewEmployee(
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      salary: $salary
      date_of_joining: $date_of_joining
      department: $department
      employee_photo: $employee_photo
    ) {
      id
      first_name
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployeeByEid(
    $id: ID!
    $first_name: String
    $last_name: String
    $email: String
    $gender: String
    $designation: String
    $salary: Float
    $date_of_joining: String
    $department: String
    $employee_photo: String
  ) {
    updateEmployeeByEid(
      id: $id
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      salary: $salary
      date_of_joining: $date_of_joining
      department: $department
      employee_photo: $employee_photo
    ) {
      id
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployeeByEid($id: ID!) {
    deleteEmployeeByEid(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private apollo: Apollo) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.query<{ getAllEmployees: Employee[] }>({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'network-only' // Ensure fresh data when listing
    }).pipe(map(res => res.data!.getAllEmployees));
  }

  searchEmployees(designation?: string, department?: string): Observable<Employee[]> {
    return this.apollo.query<{ searchEmployeeByDesignationOrDepartment: Employee[] }>({
      query: SEARCH_EMPLOYEES,
      variables: { designation, department },
      fetchPolicy: 'network-only'
    }).pipe(map(res => res.data!.searchEmployeeByDesignationOrDepartment));
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo.query<{ searchEmployeeByEid: Employee }>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id },
      fetchPolicy: 'network-only'
    }).pipe(map(res => res.data!.searchEmployeeByEid));
  }

  addEmployee(employee: Partial<Employee>): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: {
        ...employee,
        salary: Number(employee.salary)
      }
    });
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: {
        id,
        ...employee,
        salary: Number(employee.salary)
      }
    });
  }

  deleteEmployee(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id }
    });
  }
}
