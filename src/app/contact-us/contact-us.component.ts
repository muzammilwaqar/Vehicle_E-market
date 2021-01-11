import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component(
  {
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
  })

  export class ContactUsComponent
  {
    contactform:FormGroup;
    userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  accountStatus :any;
  userandadminstatus:boolean;
  status :string;
  authorizedStatus:boolean;
  isloading =false;
  adminstatus:string;
  approve:boolean;
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit()
  {
    this.contactform = new FormGroup(
      {
        email: new FormControl(null, {validators:[Validators.required, Validators.email]}),
        subject: new FormControl(null, {validators:[Validators.required]}),
        message: new FormControl(null, {validators:[Validators.required]}),
      })

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
    this.userIsAuthenticated = isAuthenticated;
    this.accountStatus = this.authService.getcurrentuserstatus();

    //this.authorizedStatus =
     //console.log(this.authService.getcurrentuserauthorizestatus()+ " - header");
   if(this.accountStatus == "user")
   {
     this.userandadminstatus = true;
   }
   else
   {
     this.userandadminstatus = false;
   }
  });




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

  ngOnDestroy()
  {
    this.authListenerSubs.unsubscribe();
  }

  onLogout()
  {
    this.authService.logout();
  }


  onsend()
  {
    if(this.contactform.invalid)
    {
      //console.log("onsignup invalid failed");
      return;
    }
    else
    {
      this.isloading = true;
      this.authService.sendmail
      (
        this.contactform.value.email,
        this.contactform.value.subject,
        this.contactform.value.message
      );
        this.isloading = true;
        this.contactform.reset();
       this.router.navigate(['/contactus'])
      .then(() => {
      window.location.reload();
      this.authService.getallUsers();
      });
    }

  }
}
