import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IHeaders, IUser, Status } from '../models/users';
import { environment } from 'src/environments/environment';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  baseUrl = environment.apiUrl;
  users: IUser[] = [];
  status: Status = Status.LOADING;

  headArray: IHeaders[] = [
    { Head: 'First name', FieldName: 'firstname' },
    { Head: 'Last name', FieldName: 'lastname' },
    { Head: 'Email', FieldName: 'email' },
    { Head: 'Age', FieldName: 'age' },
    { Head: 'Gender', FieldName: 'gender' },
    { Head: '', FieldName: '' },
  ];

  HttpClickSubscriptionFetch: Subscription | undefined;
  HttpClickSubscriptionUpdate: Subscription | undefined;
  HttpClickSubscriptionDelete: Subscription | undefined;

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.HttpClickSubscriptionFetch?.unsubscribe();
    this.HttpClickSubscriptionUpdate?.unsubscribe();
    this.HttpClickSubscriptionDelete?.unsubscribe();
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  private _notEditUsers() {
    this.users.forEach((elem) => {
      elem.isEdit = false;
    });
  }

  private _deleteNotSavedUsers(item: IUser | undefined) {
    const editedUser: IUser[] = this.users.filter(
      (user) => user.isEdit === true
    );
    if (editedUser[0] && editedUser[0].id) {
      if (item && editedUser[0].id != item?.id) {
        this.deleteUser(editedUser[0]);
      } else if (!item) {
        this.deleteUser(editedUser[0]);
      }
    }
  }

  private _errorHandler(error: HttpErrorResponse) {
    this.status = Status.ERROR;
    return throwError(() => error.message);
  }

  fetchUsers() {
    this.status = Status.LOADING;
    this.HttpClickSubscriptionFetch = this.http
      .get<IUser[]>(`${this.baseUrl}/user/`)
      .pipe(catchError(this._errorHandler.bind(this)))
      .subscribe((result: Object) => {
        this.users = <IUser[]>result;
        this.status = Status.SUCCESS;
      });
  }

  editUser(item: IUser) {
    this.closeEditUsers(undefined);
    item.isEdit = true;
  }

  updateUser(item: IUser) {
    this.status = Status.LOADING;
    const sendItem: IUser = {
      age: item.age,
      email: item.email,
      firstname: item.firstname,
      gender: item.gender,
      lastname: item.lastname,
    };
    let method, url: string;
    if (item._id) {
      method = 'PUT';
      url = `${this.baseUrl}/user/${item._id}`;
    } else {
      method = 'POST';
      url = `${this.baseUrl}/user/`;
    }
    const req = new HttpRequest(`${method}`, url, { ...sendItem });

    this.HttpClickSubscriptionUpdate = this.http
      .request(req)
      .pipe(catchError(this._errorHandler.bind(this)))
      .subscribe((el) => {
        if (el instanceof HttpResponse) this.fetchUsers();
      });
    item.isEdit = false;
  }

  deleteUser(item: IUser) {
    if (item._id) {
      this.status = Status.LOADING;
      this.HttpClickSubscriptionDelete = this.http
        .delete(`${this.baseUrl}/user/${item._id}`)
        .pipe(catchError(this._errorHandler.bind(this)))
        .subscribe(() => {
          this.fetchUsers();
        });
    } else {
      this.users = this.users.filter((user) => user.id != item.id);
    }
  }

  createUser(item: IUser) {
    this.closeEditUsers(item);
    this.users = [...this.users, item];
  }

  closeEditUsers(item: IUser | undefined) {
    this._deleteNotSavedUsers(item);
    this._notEditUsers();
  }
}
