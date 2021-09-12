import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = ''
  enteredContent = ''
  isLoading = false // to control the spinner
  post: Post    // for edditing a post
  form: FormGroup
  imagePreview: string
  private mode = 'create'
  private postId :string

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.form = new FormGroup({
        'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        'content': new FormControl(null, {validators: [Validators.required]}),
        'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
      })
      if (paramMap.has('postId')) {
        console.log("HAS IT BITCH")
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false
          this.post = {id: postData._id, title: postData.title, content: postData.content }
          this.form.setValue({ 'title': this.post.title, 'content': this.post.content})
        })
      } else {
        console.log("NO TIENE")
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onSavePost() {
    if (this.form.invalid){
      return;
    }
    this.isLoading = true // don't realy need to set it to false bc we navigate away (bc of post.service... then it is set to false when component is loaded)
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content)
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content)
    }

    this.form.reset();
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0]          // neat.. It doesn't know our event target is an input. Until we do some type cast
    this.form.patchValue({image: file})
    this.form.get('image').updateValueAndValidity()   // We didn't bind our image form object to our html code. So this rechecks validity since it isn't checked when submitted.
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }

}
