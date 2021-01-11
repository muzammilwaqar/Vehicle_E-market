import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';

@Component({
  selector: 'app-userprofilepic',
templateUrl:'./edit-profilepic.component.html',
styleUrls: ['./edit-profilepic.component.css']
})

export class UserProfilePicComponent
{
  isloading =false;
  private authStatusSub: Subscription;
  signupform : FormGroup;
  userId :string;
  private authServiceSub : Subscription;
  userIsAuthenticated =false;
  currentusercnic:number;
  private authListenerSubs: Subscription;
  accountStatus:any;
  userandadminstatus:boolean;
  picform : FormGroup;
  imagePreview : string;


  constructor(public authService:AuthService,public router: Router)
  {

  }

  ngOnInit()
  {

      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.accountStatus = this.authService.getcurrentuserstatus();
        //console.log(this.userdetails);
      if(this.accountStatus == "user")
      {
        this.userandadminstatus = true;
      }
      else
      {
        this.userandadminstatus = false;
      }
      });
      this.isloading=true;
      this.isloading=false;

      this.picform = new FormGroup(
        {
          image : new FormControl(null,{validators: [Validators.required], asyncValidators :[mimeType]})
        });
  }

 //on image picked
 onImagePicked(event : Event)
 {
   const file = (event.target as HTMLInputElement).files[0];
   this.picform.patchValue({image: file});
   this.picform.get('image').updateValueAndValidity();
   const reader = new FileReader();
   //console.log(file);
   //console.log(this.contractform);
   reader.onload = () =>
   {
     this.imagePreview = reader.result as string;
   };
   reader.readAsDataURL(file);
   //reader.onload and reader.readAsDataURL works asynchronusly
 }
 //end of on image picked


  oneditsave()
  {
    if(this.picform.invalid)
    {
      return;
    }
    console.log("ts file:" + this.picform.value.image);
    this.isloading = true;
    this.authService.updateprofilepic(this.picform.value.image);
    this.isloading = false;
    this.router.navigate(["/userprofile"]);
  }

}
