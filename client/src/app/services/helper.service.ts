import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  positiveNumberRegex = /^\d*[1-9]\d*$/;
  NotNegativeNumberRegex = /^\d*[0-9]\d*$/;
  
  usernameRegex = /^(?=[a-zA-Z0-9._]{1,20}$)/;
  codeRegex = /^\d{6}$/;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobileNumberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  
  constructor() { }

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

}
