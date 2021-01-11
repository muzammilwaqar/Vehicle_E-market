import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}


@Component(
  {
    selector: 'app-singlepost',
    templateUrl: './single-post.component.html',
    styleUrls: ['./single-post.component.css']
  })

export class SinglePostComponent
{
  post: Post[];
  isloading = false;
  userId: string;
  private postsSub: Subscription;
  private authServiceSub: Subscription;
  userIsAuthenticated = false;
  carmake:string;
  City:string;
  regcity:string;
  images:string;
  carmileage:String;
  carcolor:String;
  enginetype:string;
  enginecapacity:string;
  adminstatus:string;
  approve:boolean;
  mobilenumber:number;
  postId:string
  postList:any=[];
  userdetails: any;
  features=[];
  creatorName:string;
  creatorId:string;
  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  constructor(public postsService: PostsService, private authService: AuthService,private route:ActivatedRoute,public router: Router,public dialog: MatDialog)
  {

    this.postId =  this.route.snapshot.paramMap.get('id');
    this.postsService.getsinglepost(this.postId).subscribe(data=>{

      this.postList = data;

      var str = this.postList.features;

      var seprate = str.split(',');
      for(let i=0; i<seprate.length; i++)
      { 
        this.features[i] = seprate[i];
      }

      console.log("cingle psot creator: "+this.postList.creator );
      this.authService.useraccountdetails(this.postList.creator).subscribe(data =>
      {


        //this.userdetails= dataincome;
        let p= Object.entries(data);
        //console.log("data:" +data );
        //console.log("data income:" +dataincome );
        this.creatorId = p[0][1];
        this.creatorName = p[1][1];
        //console.log("user details:" + p[1][1]);
      });

    },err=>{
      console.log(err);
    });
  }

  ngOnInit()
  {

this.userIsAuthenticated = this.authService.getIsAuth();
    this.adminstatus = localStorage.getItem("adminstatus");
    if(this.adminstatus == 'true')
    {
      console.log("set true");
      this.approve = true;
    }
    else
    {
      this.approve = false;
    }


  }


  userprofile(otherUserId:string)
  {
    localStorage.setItem('postcreator',this.creatorId);
    this.router.navigate(['/user',otherUserId]);
  }

  onchat(creatorid: any)
  {
   //this.authService.createport(creatorid);

   this.postsService.setCreatorId(creatorid);
   this.router.navigate(["/chat",creatorid]);
   //this.authService.startchat(creatorid);
  }
  onLogout()
  {
    this.authService.logout();
  }


  openDialogforimages() 
  {
    localStorage.removeItem("imagePath");
    localStorage.removeItem("imagePath1");
    localStorage.removeItem("imagePath2");
    localStorage.setItem("imagePath",this.postList.imagePath);
    localStorage.setItem("imagePath1",this.postList.imagePath1);
    localStorage.setItem("imagePath2",this.postList.imagePath2);
    this.dialog.open(ImagesDialog);
  
  }

  openview
  
  }

  @Component({
    selector: 'dialog-elements-example-dialog',
    templateUrl: 'images.html',
  })
  export class ImagesDialog 
  {
     url:String;
    imagepath:string;
    imagepath1:string;
    imagepath2:string;
    
  
     constructor()
     {
        this.imagepath = localStorage.getItem("imagePath");
        this.imagepath1 = localStorage.getItem("imagePath1");
        this.imagepath2 = localStorage.getItem("imagePath2");
     }

     
  }

  
