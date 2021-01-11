import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/search";

@Injectable({ providedIn: 'root' })

export class SearchService {
  constructor(private http: HttpClient, private router: Router) { }
  search(searchData: any) {
    console.log("Search Text in service:", searchData);
    return this.http.post<any>(BACKEND_URL, searchData);
  }
  searchByCond(searchData: any) {
    console.log("Search Text in service:", searchData);
    return this.http.post<any>(BACKEND_URL + 'PostByCond', searchData);
  }

  searchAll() {
    console.log("Search Text in service:");
    return this.http.get<any>(BACKEND_URL + 'All');
  }

  singleSearch(searchId: any) {
    console.log("Search Id in service:", searchId);
    console.log("url",BACKEND_URL + 'Post');
    return this.http.post<any>(BACKEND_URL + 'Post', {searchId});
  }
}
