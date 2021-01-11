import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { SearchComponent } from '../../search/search.component';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { SearchService } from 'src/app/search/search.service';

export interface Tile {
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
 



export class PostListComponent implements OnInit, OnDestroy {
  count = 0;
  posts: Post[] = [];
  curretnusercnicNumber: number;
  isloading = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [ 15, 20, 25];
  userId: string;
  private postsSub: Subscription;
  private authServiceSub: Subscription;
  userIsAuthenticated = false;
  authorizedStatus:boolean;
  searchform : FormGroup;
  selectedBrand: any = '';
  selectedCity: any = '';
  selectedColour: any = '';
  selectedPrice: string = '';
  brands = [{ name: 'Audi', value: 'Audi' }, { name: 'BMW', value: 'BMW' }, { name: 'Lexus', value: 'Lexus' }, { name: 'Mercedes', value: 'Mercedes Benz' }, { name: 'Toyota', value: 'Toyota' }, { name: 'Honda', value: 'Honda' }, { name: 'Suzuki', value: 'Suzuki' }, { name: 'Kia', value: 'Kia' }];
  model: string = '';

  colours = [{ name: 'Any Colour', value: '' }, { name: 'White', value: 'white' }, { name: 'Black', value: 'black' }, { name: 'Silver', value: 'silver' }];
  cities = [{ name: 'Any City', value: '' }, { name: 'Karachi', value: 'khi' }, { name: 'Islamabad', value: 'isb' }];
  prices = [{ name: '< 500000', value: '' }, { name: '500000 - 1000000', value: 'khi' }, { name: '1000000 - 1500000', value: 'isb' }, { name: '1500000 - 2000000', value: 'isb' }, { name: '2000000 - 3000000', value: 'isb' }, { name: '3000000 - 4000000', value: 'isb' }, { name: '4000000 - 5000000', value: 'isb' }, { name: '> 5000000', value: 'isb' }];

  constructor(public postsService: PostsService, private authService: AuthService,private router: Router, private searchService: SearchService, private dataService: DataService) { }

  tiles: Tile[] = [
    {cols: 1, rows: 2},
    { cols: 3, rows: 1,},
    { cols: 1, rows: 1,},
    { cols: 2, rows: 1,},
  ];


  ngOnInit() {

    this.searchform= new FormGroup(
      {
      //basic car info
        make : new FormControl(null),
        model: new FormControl(null),
        price: new FormControl(null),

      }
    );


    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isloading = true;
    this.userId = this.authService.getUserId();
    this.authorizedStatus = this.authService.getcurrentuserauthorizestatus();
    this.postsSub = this.postsService.getPostUpdate()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isloading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authServiceSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
    this.count = this.posts.length % 3;
    this.curretnusercnicNumber = this.authService.getUsercnic();
    //console.log(this.count);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isloading = true;
    this.postsService.deletepost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isloading = false;

    });
  }

  singlepostview(postid:string)
  {
    this.router.navigate(["/post",postid]);
      }

  onLogout()
  {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authServiceSub.unsubscribe();
  }

  onchat(creatorid: any)
  {
   //this.authService.createport(creatorid);

   this.postsService.setCreatorId(creatorid);
   this.router.navigate(["/chat",creatorid]);
   //this.authService.startchat(creatorid);
  }


  searchByCond(condition:string, value:string) {
    // console.log("type", condition);
    // console.log("value", value);
     this.searchService.searchByCond({[condition]: value}).subscribe(postData => {
       console.log("postreturndata", postData);
       this.dataService.setData(postData);
       this.router.navigate(["/search"]);
     });
   }
 
   clickcheck() {
 
   }
   searching() {
     let price = null;
     if (this.selectedPrice !== '') {
       if (this.selectedPrice.includes('>')) {
         price = Object.assign({ min: 5000000 }, price);
         price = Object.assign({ max: null }, price);
       } else if (this.selectedPrice.includes('<')) {
         price = Object.assign({ min: 0 }, price);
         price = Object.assign({ max: 500000 }, price);
       } else {
         price = Object.assign({ min: Number(this.selectedPrice.split('-')[0].trim()) }, price);
         price = Object.assign({ max: Number(this.selectedPrice.split('-')[1].trim()) }, price);
       }
     }
     const data = {
       make: this.selectedBrand === '' ? null : this.selectedBrand,
       city: this.selectedCity === '' ? null : this.selectedCity,
       exteriorcolor: this.selectedColour === '' ? null : this.selectedColour,
       price,
       model: this.model === '' ? null : this.model
     };
     if ((Object.values(data)).every(e => e === null)) {
       //console.log("pai g khali jae sb khuda da wasta ae select krlo kuch");
       return;
     } else {
      // console.log('data', data);
       this.searchService.search(data).subscribe(postData => {
       //  console.log("postreturndata", postData);
         this.dataService.setData(postData);
         //localStorage.removeItem('searchedposts');
         //localStorage.setItem('searchedposts',postData);
         window.location.reload();
         //this.router.navigate(["/search"]);
       });
     }
   };
 
   onKey(event) { this.model = event.target.value; }

  //end
}
