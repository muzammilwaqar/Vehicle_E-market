import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component(
  {
    selector: 'app-',
    templateUrl: './single-blog.component.html',
    styleUrls: ['./single-blog.component.css']
  })

  export class SingleBlogComponent implements OnInit, OnDestroy
  {
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;
    constructor(private authService: AuthService){}
    accountStatus :any;
    userandadminstatus:boolean;
    status :string;
    authorizedStatus:boolean;

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
