export interface IUser {
  _id?: string;
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  age: number | string;
  gender: string;
  isEdit?: boolean;
}

export interface IHeaders {
  Head: string;
  FieldName: string;
}

export enum Status {
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success',
}
