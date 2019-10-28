import {Directive, ElementRef, Input} from '@angular/core';

interface ConfigLabelStatus {
  borderRadius?: number;
  color?: string;
  isCircle?: boolean;
  fontFamily?: string;
  fontSize?: number;
  opacity?: number;
  padding?: string;
  status?: string;
  statusArray: {id: string, someLabel: string, labelColor: string}[];
}

@Directive({
  selector: '[appLabelStatus]'
})
export class LabelStatusDirective {
  @Input('appLabelStatus') config: ConfigLabelStatus;

  constructor(private _el: ElementRef) {
    setTimeout(() => {
      this.config = {
        borderRadius: this.config.borderRadius ? this.config.borderRadius : 4,
        color: this.config.color ? this.config.color : '#FFA000',
        isCircle: this.config.isCircle ? this.config.isCircle : false,
        fontFamily: this.config.fontFamily ? this.config.fontFamily : 'Roboto',
        fontSize: this.config.fontSize ? this.config.fontSize : 14,
        opacity: this.config.opacity ? this.config.opacity : .2,
        padding: this.config.padding ? this.config.padding : '6px 9px',
        status: this.config.status,
        statusArray: this.config.statusArray
      };

      this.labeling(this._el);
    });
  }

  cutHex(hex: string) {
    if (this.config.statusArray) {
      if (this.config.status) {
        this.config.color = this.config.statusArray.find(color => color.id === this.config.status).labelColor;
      } else {
        this.config.statusArray.forEach((color, index) => {
          color.someLabel = color.someLabel.replace(/(\(|\)|\||\?)/g, specialChar => {
            return `\\${specialChar}`;
          });
          if ((<string>this._el.nativeElement.textContent).match(color.someLabel)) {
            this.config.color = this.config.statusArray[index].labelColor;
          }
        });
      } hex = this.config.color;
    } return hex.charAt(0) === '#' ? hex.substr(1, 6) : hex;
  }

  rgb(hex: string) {
    const filteredHex = this.cutHex(hex);
    const R = parseInt(filteredHex.substr(0, 2), 16);
    const G = parseInt(filteredHex.substr(2, 2), 16);
    const B = parseInt(filteredHex.substr(4, 2), 16);
    const A = this.config.opacity;
    return `rgba(${R}, ${G}, ${B}, ${A})`;
  }

  labeling(el: ElementRef) {
    el.nativeElement.style.backgroundColor = this.rgb(this.config.color);
    el.nativeElement.style.borderRadius = this.config.isCircle ? '50%' : `${this.config.borderRadius}px`;
    el.nativeElement.style.color = this.config.color;
    el.nativeElement.style.fontFamily = this.config.fontFamily;
    el.nativeElement.style.fontSize = `${this.config.fontSize}px`;
    el.nativeElement.style.padding = this.config.padding;
  }
}
