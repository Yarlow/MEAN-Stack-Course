import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}>  => {
  const file = control.value as File
  const fileReader = new FileReader()
  const frObs = new Observable((observer: Observer<{[key: string]: any}>) => {
    fileReader.addEventListener("loadend", () => { // This callback will run AFTER filereader.readAsArrayBuffer     Observables are siiiiiiiiiick
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4) // Uint8Array: array of 8 bit unsigned integers... Gets subarray that will be used for mime type.
      let header = ""                                                             // also mime types isn't the same as extension. can always change the extension of files.
      let isValid = false
      for (let i = 0; i < arr.length; i++ ){
        header += arr[i].toString(16) //making it a string of hex
      }
      switch (header) {
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }

        if (isValid) {
          observer.next(null)     // passing null if valid, st observer doesn't throw an error.
        } else {
          observer.next({invalidMimeType: true}) // basically we make our own error
        }
        observer.complete()
    })
    fileReader.readAsArrayBuffer(file)
  })
  return frObs

}
