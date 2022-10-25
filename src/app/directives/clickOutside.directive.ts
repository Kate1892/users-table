import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  OnDestroy,
  Directive,
  ElementRef,
  Inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { filter, fromEvent, Subscription } from 'rxjs';

//author - Monsterlessons Academy (https://www.youtube.com/watch?v=8a6R2P9YqGY)

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
  @Output() clickOutside = new EventEmitter<void>();

  documentClickSubscription: Subscription | undefined;
  constructor(
    private element: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}
  ngAfterViewInit(): void {
    this.documentClickSubscription = fromEvent(this.document, 'click')
      .pipe(
        filter((event: Event) => {
          return !this.isInside(event?.target as HTMLElement);
        })
      )
      .subscribe(() => {
        this.clickOutside.emit();
      });
  }
  ngOnDestroy(): void {
    this.documentClickSubscription?.unsubscribe();
  }

  isInside(elementToCheck: HTMLElement): boolean {
    return (
      elementToCheck === this.element.nativeElement ||
      this.element.nativeElement.contains(elementToCheck)
    );
  }
}
