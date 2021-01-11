import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sharedData: any[];
  private postId : any;


  setData(data) {
    this.sharedData = data.posts;
  }

  getData() {
    return this.sharedData ;
  }

  setSingleData(postId) {
    this.postId = postId;
  }

  getSingleData() {
    return this.postId;
  }
  constructor() { }
}
