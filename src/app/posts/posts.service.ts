import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

import { Post } from './post.model'
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts') // posts: any, because posts: Post[] give err bc _id does not exist for type Post.. Just make _id in the schema. seems easier and more consistent.
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      })) // to convert backend respons from _id to id
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts
        this.postsUpdated.next([...this.posts])
      })
    // return [...this.posts] // spread operator
  }

  addPost(title: string, content: string){
    const post: Post = {id: null, title: title, content: content}
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const postId = responseData.postId
        post.id = postId
        this.posts.push(post)
        this.router.navigate(["/"])
        this.postsUpdated.next([...this.posts]);
      })
  }

  updatePost(id: string, title: string, content: string){
    const post: Post = {id: id, title: title, content: content}
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts]
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id)
        updatedPosts[oldPostIndex] = post
        this.posts = updatedPosts
        this.router.navigate(["/"]) // navigate doesn't like being below the .next on the line below
        this.postsUpdated.next([...this.posts]) // these past few lines aren't super necessary in our case because we always get the latests posts from the server
                                                // when the posts-list is initiated.
      })
  }

  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() =>{
        const updatedPosts = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
      })
  }

  getPost(id: string){
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id)
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable()
  }


}
