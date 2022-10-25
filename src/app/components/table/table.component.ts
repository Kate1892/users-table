import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHeaders, IUser } from '../models/users';
import { v4 as uuid } from 'uuid';
import { genderValidator } from './table.validators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() HeadArray: IHeaders[] = [];
  @Input() GridArray: IUser[] = [];
  @Output() onEdit = new EventEmitter<IUser>();
  @Output() onDelete = new EventEmitter<IUser>();
  @Output() onUpdate = new EventEmitter<IUser>();
  @Output() onCreate = new EventEmitter<IUser>();
  @Output() onCloseEdit = new EventEmitter<IUser>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this._createForm();
  }

  private _createForm() {
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.pattern(/^[0-9]+(?!.)/)]],
      gender: ['', [Validators.required, genderValidator()]],
    });
  }

  setFormValues(item: IUser) {
    this.userForm.setValue({
      firstname: item.firstname,
      lastname: item.lastname,
      email: item.email,
      age: item.age,
      gender: item.gender,
    });
  }

  getFormItem(fieldName: string) {
    switch (fieldName) {
      case 'firstname':
        return this.userForm.get('firstname');

      case 'lastname':
        return this.userForm.get('lastname');
      case 'email':
        return this.userForm.get('email');
      case 'age':
        return this.userForm.get('age');
      case 'gender':
        return this.userForm.get('gender');

      default:
        return this.userForm.value;
    }
  }

  ngOnInit(): void {}

  edit(event: Event, item: IUser) {
    event.stopPropagation();
    this.setFormValues(item);
    this.onEdit.emit(item);
  }

  update(
    event: Event,
    item: IUser,
    _id: string | undefined,
    id: string | undefined
  ) {
    {
      _id
        ? this.onUpdate.emit({ ...item, _id: _id })
        : this.onUpdate.emit({ ...item, id });
    }
    event.stopPropagation();
  }

  delete(event: Event, item: IUser) {
    event.stopPropagation();
    this.onDelete.emit(item);
  }

  create(event: Event) {
    const newUser: IUser = {
      id: uuid(),
      firstname: '',
      lastname: '',
      email: '',
      age: '',
      gender: '',
      isEdit: true,
    };
    this.setFormValues(newUser);
    this.onCreate.emit(newUser);
    event.stopPropagation();
  }

  clickOutside() {
    this.onCloseEdit.emit(undefined);
  }
}
