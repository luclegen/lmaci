import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  NotNegativeNumberRegex = /^\d*[0-9]\d*$/;
  
  usernameRegex = /^(?=[a-zA-Z0-9._]{1,20}$)/;
  codeRegex = /^\d{6}$/;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobileNumberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  
  constructor() { }

  //#region Style

  setPositionOnlyForm() {
    const onlyFormContainer = document.getElementById('only-form-container') as HTMLElement;
    const vpHeight = document.documentElement.clientHeight;

    onlyFormContainer.style.marginTop = ((vpHeight - onlyFormContainer.clientHeight)/2 - 60 > 10 ? (vpHeight - onlyFormContainer.clientHeight)/2 - 60 : 10) + 'px';
    onlyFormContainer.style.marginBottom = (vpHeight - onlyFormContainer.clientHeight - ((vpHeight - onlyFormContainer.clientHeight)/2) > 10 ? vpHeight - onlyFormContainer.clientHeight - ((vpHeight - onlyFormContainer.clientHeight)/2) : 10) + 'px';
  }

  //#endregion Style

  //#region Converter

  toHTMLName(name: string) {
    let nameOut = name.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
    return nameOut[0].toLowerCase() + nameOut.slice(1);
  }

  base64ToBlob(base64: string, type: string) {
    const byteString = window.atob(base64.replace(new RegExp('^data:image\/' + type + ';base64,'), ""));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) int8Array[i] = byteString.charCodeAt(i);
    const blob = new Blob([ int8Array ], { type: 'image/' + type });
    return blob;
  }
  
  toName(name: string) {
    return name.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  //#endregion Converter

  //#region Math

  sum(arr, init = 0) {
    return arr.reduce((t, e) => t + e, init);
  }

  average(arr) {
    return this.sum(arr) / arr.length;
  }

  round(num, digit = 0) {
    return Math.round(num * 10 ** digit) / 10 ** digit;
  }

  sort(arr = [], prop = '-property') {
    return arr.sort((a, b) => ((isNaN(a[prop.slice(/-/.test(prop) ? 1 : 0)] && b[prop.slice(/-/.test(prop) ? 1 : 0)]) ? a[prop.slice(/-/.test(prop) ? 1 : 0)].toLowerCase() < b[prop.slice(/-/.test(prop) ? 1 : 0)].toLowerCase() : a[prop.slice(/-/.test(prop) ? 1 : 0)] < b[prop.slice(/-/.test(prop) ? 1 : 0)]) ? -1 : 1) * (/-/.test(prop) ? -1 : 1));
  }

  //#endregion Math

  //#region Formatter

  USDcurrency(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(num);
  }
  
  //#endregion Formatter

  //#region Checker

  isBase64(url, type) {
    return (new RegExp('data:image/' + type + ';base64')).test(url);
  }

  //#endregion Checker

}
