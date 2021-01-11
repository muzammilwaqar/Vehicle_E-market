import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component(
  {
    selector: 'app-faq',
    templateUrl: './FAQ.component.html',
    styleUrls: ['./FAQ.component.css']
  })

  export class FAQComponent
  {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService){}
  accountStatus :any;
  userandadminstatus:boolean;
  status :string;
  authorizedStatus:boolean;
  adminstatus:string;
  approve:boolean;
  ngOnInit()
  {
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
  }
