import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription } from 'rxjs'

import { Post } from '../post.model';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First post', content: 'This is the first post\'s content'},
  //   {title: 'Second post', content: 'This is the Second post\'s content'},
  //   {title: 'Third post', content: 'This is the Third post\'s content'},
  // ]

  isLoading = false
  posts: Post[] = []
  private postsSub: Subscription

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts()
    this.isLoading = true
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false
      this.posts = posts
    })
  }

  ngOnDestroy() : void {
    this.postsSub.unsubscribe()
  }

  onDelete(id: string){
    this.postsService.deletePost(id)
  }

}
