import { FormControl } from '@angular/forms';

export function genderValidator(): object | null {
  return (control: FormControl) => {
    let valid =
      !control.value ||
      control.value === 'male' ||
      control.value === 'female' ||
      control.value === 'other';

    return valid ? null : { gender: true };
  };
}
