---
title: "Passwords schmasswords"
date: "2020-05-05"
tldr: "Human Memory Bad, Computer Memory Good!"
---

```JavaScript
import { Directive, ElementRef, Input, NgModule, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appNgClass]'
})
export class DelayedNgClass implements OnInit {
  @Input('appNgClass') public params: DelayedNgClassParams;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  /**
   * Initialize by setting the class if condition is true. No delay here since it would seem wonky
   */
  public ngOnInit(): void {
    for (const classes of Object.keys(this.params)) {
      if (this.params[classes].condition === true) {
        // No Delays Initially
        classes.split(' ').forEach(this.add);
      }
    }
  }

  /**
   * React to changes in the params for this directive by adding / removing the provided classes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.params) {
      for (const classes of Object.keys(changes.params.currentValue)) {
        const { condition, delayOnAdd, delayOnRemove } = changes.params.currentValue[classes];
        if (condition === true) {
          if (delayOnAdd > 0) {
            setTimeout(() => {
              classes.split(' ').forEach(this.add);
            }, delayOnAdd);
          }
          else {
            classes.split(' ').forEach(this.add);
          }
        }
        else if (delayOnRemove > 0) {
          setTimeout(() => {
            classes.split(' ').forEach(this.remove);
          }, delayOnRemove);
        }
        else {
          classes.split(' ').forEach(this.remove);
        }
      }
    }
  }

  private add = (clazz: string) => {
    this.renderer.addClass(this.elRef.nativeElement, clazz);
  }

  private remove = (clazz: string) => {
    this.renderer.removeClass(this.elRef.nativeElement, clazz);
  }
}

type DelayedNgClassParams = {
  [classes: string]: {
    condition: boolean,
    delayOnAdd: number,
    delayOnRemove: number
  }
};

@NgModule({
  declarations: [DelayedNgClass],
  exports: [DelayedNgClass]
})
export class DelayedNgClassModule { }

```
