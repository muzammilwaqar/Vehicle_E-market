import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import * as io from 'socket.io-client';
import { PostsService } from 'src/app/posts/posts.service';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-chat-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})


export class InboxComponent
{
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  accountStatus: any;
  userandadminstatus: boolean;
  status: string;
  authorizedStatus: boolean;
  //users=[];
  users:any;
  adminstatus:string;
  approve:boolean;


  constructor(private authService: AuthService, private router:Router)
  {
    this.authService.getuserchats().subscribe(userchat =>
      {
        let temp =userchat;
        this.users = temp;

        //console.log("users"+this.users);
      });
  }

  ngOnInit()
  {
    // document.getElementById('car_search_form').submit(this.searching());
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.accountStatus = this.authService.getcurrentuserstatus();

      //this.authorizedStatus =
      //console.log(this.authService.getcurrentuserauthorizestatus()+ " - header");
      if (this.accountStatus == "user") {
        this.userandadminstatus = true;
      }
      else {
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

  onchat(userid:string)
  {
    this.authService.getchats(userid);
    this.router.navigate(["/chat",userid]);

  }

  ondelete(userid:string)
  {
    var check = this.getConfirmation();
    if(check == true)
    {
      this.authService.deleteChat(userid);
      this.authService.logout();
    }

  }

  getConfirmation() {
    var retVal = confirm("Do you want to Delete it? ?");
    if( retVal == true )
     {
       //document.write ("User wants to continue!");
       return true;
    } else {
       //document.write ("User does not want to continue!");
       return false;
    }
  }

  onLogout() {
    this.authService.logout();
  }

  onview(otherUSerId:string)
  {
    this.router.navigate(["/user",otherUSerId]);
  }

}