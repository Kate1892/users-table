import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '../models/users';

@Pipe({
  name: 'toUserKeys',
})
export class FormatPipe implements PipeTransform {
  transform(value: string): keyof IUser {
    return value as keyof IUser;
  }
}
