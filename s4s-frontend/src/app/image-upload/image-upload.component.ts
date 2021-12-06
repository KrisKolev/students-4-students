import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FileUploader} from "ng2-file-upload";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
/**
 * Defines the modular image upload component to select files and prepared them for upload.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class ImageUploadComponent implements OnInit {

  /**
   * The selected images
   */
  @Output()  filesUpdated = new EventEmitter();

  /**
   * Form for the upload objects.
   */
  uploadForm: FormGroup;
  /**
   * Selected images
   */
  images : string[] = [];
  /**
   * Form for the input images
   */
  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  /**
   * Selected files.
   */
  files:File[]= [];

  /**
   * File uploader object to work with system files.
   */
  public uploader:FileUploader = new FileUploader({
    isHTML5: true
  });

  /**
   * Constructor of the component.
   * @param fb
   * @param http
   */
  constructor(private fb: FormBuilder, private http: HttpClient ) { }

  /**
   * Initializes the component
   */
  ngOnInit() {
    this.uploadForm = this.fb.group({
      document: [null, null]
    });
  }

  /**
   * Returns the controls value.
   */
  get formValue(){
    return this.myForm.controls;
  }

  /**
   * Handles the change of the selected files.
   * @param event
   */
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
        this.files.push(event.target.files[i])
      }
      this.filesUpdated.emit(this.files);
    }
  }

  /**
   * Patches the values in the UI.
   */
  patchValues(){
    this.myForm.patchValue({
      fileSource: this.images
    });
  }

  /**
   * Removes an image by its url.
   * @param url
   */
  removeImage(url:any){

    try {
      var index = this.images.findIndex(x=>x == url);
      this.images = this.images.filter(img => (img != url));
      this.files.splice(index,1);
    }catch (e) {
      console.log(e)
    }

    this.patchValues();
  }
}
