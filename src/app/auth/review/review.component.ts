import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//import { SSL_OP_NO_TLSv1_1 } from 'constants';
//import { Subscription } from 'rxjs';
//import { PostsService } from 'src/app/posts/posts.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-reviews',
  templateUrl:'./review.component.html',
  styleUrls: ['./review.component.css']
})

export class ReviewComponent
{
  loggedInUser:string;
  reviewUser:string;
  reviewForm:FormGroup;
  isloading =false;
  constructor(public authService: AuthService,public route: ActivatedRoute,)
  {
    this.reviewUser= this.route.snapshot.paramMap.get('reviewuserid');
    //this.reviewUser = localStorage.getItem('reviewuserid');
    //this.loggedInUser = localStorage.getItem('Id');
    console.log("review" + this.reviewUser);
    //console.log("logged in: "+ this.loggedInUser);
  }

  ngOnInit()
  {
    this.reviewForm = new FormGroup(
      {
          subject : new FormControl(null, {validators:[Validators.required]}),
          review: new FormControl(null,{validators:[ Validators.required]}),
          rating: new FormControl(null, {validators:[Validators.required]}),
          //rating: new FormControl(null,{validators:[ Validators.required]})
      });
  }

  onreviewcreate()
  {
    if(this.reviewForm.invalid)
    {
      alert("Cannot Register Review. Error Check Again")
    }
    else
    {
      console.log("inside review composnent .ts");
      this.authService.createReview
      (
        this.reviewForm.value.subject,
        this.reviewForm.value.rating,
        this.reviewForm.value.review,
        this.reviewUser
      );
    }
  }

}
