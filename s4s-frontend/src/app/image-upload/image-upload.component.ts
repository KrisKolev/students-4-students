import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FileUploader} from "ng2-file-upload";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  @Input('hideUpload') hideUpload: boolean;

  uploadForm: FormGroup;

  public uploader:FileUploader = new FileUploader({
    isHTML5: true
  });
  title: string = 'Angular File Upload';
  constructor(private fb: FormBuilder, private http: HttpClient ) { }

  /*uploadFile(data: FormData): Observable<any> {
    return this.http.post('http://localhost:8080/upload', data);
  }*/

  ngOnInit() {
    this.uploadForm = this.fb.group({
      document: [null, null]
    });
  }

  images : string[] = [];
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  get formValue(){
    return this.myForm.controls;
  }

  onFileChange(event:any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          // Push Base64 string
          this.images.push(event.target.result);
          this.patchValues();
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  // Patch form Values
  patchValues(){
    this.myForm.patchValue({
      fileSource: this.images
    });
  }

  // Remove Image
  removeImage(url:any){
    console.log(this.images,url);
    this.images = this.images.filter(img => (img != url));
    this.patchValues();
  }

  // Submit Form Data
  submit() {
    this.http.post('http://localhost:8005/upload.php', this.myForm.value)
        .subscribe(res => {
          console.log(res);
          alert('Uploaded Successfully.');
        })


  }
}
