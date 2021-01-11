import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { mimeType } from '../../posts/post-create/mime-type.validator';
import { AuthSignupData } from '../auth-signup-data.model';
import { PageEvent } from '@angular/material/paginator';
import { PostsService } from 'src/app/posts/posts.service';
import { Post } from 'src/app/posts/post.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-other-userprofile',
templateUrl:'./Other-UserProfile.component.html',
styleUrls: ['./Other-UserProfile.component.css']
})

export class OtherUserProfileComponent implements OnInit
{
  viewUserId:string;
  userdetails: any;
  allposts:any=[];
  allreviews:any=[];
  userIsAuthenticated =false;
  private authListenerSubs: Subscription;
  adminstatus:string;
  approve:boolean;
  loggedinuserId:string;


  constructor(public authService: AuthService,public route: ActivatedRoute,public postsService: PostsService,public router: Router,)
  {
    this.loggedinuserId = localStorage.getItem('userId');
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
   this.viewUserId = this.route.snapshot.paramMap.get('otheruserid');
   console.log("View User Id : "+this.viewUserId);
  }

  ngOnInit()
  {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated =>
      {
        this.userIsAuthenticated = isAuthenticated;
      })

    this.authService.useraccountdetails(this.viewUserId).subscribe(data =>
      {

        let dataincome= data;
      this.userdetails = data;
      //this.userId = dataincome.user._id;
      //console.log(this.userId)
      if(this.userdetails.profileimage == "dummy")
      {
        this.userdetails.profileimage = "../../../assets/images/avatar.svg";
      }
        //this.userdetails= dataincome;
        let p= Object.entries(data);

      });
      this.authService.getuserposts(this.viewUserId).subscribe(data =>
        {
          let alluserposts = data;
          this.allposts = alluserposts;
         // console.log(this.allposts);
        });

        this.authService.getReviews(this.viewUserId).subscribe(data =>
          {
            let alluserreviews = data;
            this.allreviews = alluserreviews;
          })
  }


  singlepost(postid:string)
  {
    this.router.navigate(["/post", postid]);
  }


  onreview(userid:string)
  {
    this.router.navigate(["/review",userid]);
  }

  ngOnDestroy()
  {

  }

  onLogout()
  {
    this.authService.logout();
  }

}
