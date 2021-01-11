import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import * as io from 'socket.io-client';
import { PostsService } from 'src/app/posts/posts.service';
import { AuthService } from '../auth.service';



const SOCKET_ENDPOINT = 'localhost:5000';


@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css']
})


export class ChatInboxComponent implements OnInit {
  socket;
  message: string;
  usertoken:string;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  accountStatus :any;
  userandadminstatus:boolean;
 fromId: string
  chat;
  chatUserId:string
  messageList:any=[];
  userads=[];
  allposts:any=[];
  adminstatus:string;
  approve:boolean;
   currentuserId:string;

  constructor(public authService: AuthService, public postService:PostsService, private route:ActivatedRoute, private router: Router) {
    this.usertoken =this.authService.getToken();
    this.currentuserId = localStorage.getItem('userId');
    this.chatUserId =  this.route.snapshot.paramMap.get('id');
    //console.log("CHAT ID: ", this.chatUserId);
    this.authService.getchats(this.chatUserId).subscribe(data=>{

      this.messageList = data;

      console.log("chhhaat data: ", this.messageList)

      this.authService.getuserposts(this.chatUserId).subscribe(data =>
        {
          let alluserposts = data;
          this.allposts = alluserposts;
          console.log(this.allposts);
        });

    },err=>{

    });

    //this.chatUserId

  
    //console.log(this.userdetails);


  }

  ngOnInit()
  {
    this.setupSocketConnection();
    this.usertoken =this.authService.getToken();
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

  /*setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);
 }*/


 setupSocketConnection() {



  this.socket = io(SOCKET_ENDPOINT, {

    transports: ['polling'],
    transportOptions: {
      polling: {
         extraHeaders: {
            'authorization': this.usertoken
      }
     }
  }});



  this.socket.on('recieveChatMessage', (data) => {
  if (data) {

    this.fromId = data.from_id;
   // console.log("formid on socket on : ",this.fromId );



   const element = document.createElement('li');
   element.innerHTML = data.message;

   element.style.background = ':#0074F7';

  element.style.color="white"

  element.style.fontSize="14px"

  element.style.padding =  '15px 30px';

  element.style.margin = '10px';

  element.style.borderRadius = "20px 20px 20px 20px";

  element.style.textAlign = 'left';
   document.getElementById('message-list').appendChild(element);
   }
 });


}


SendMessage() {
   this.socket.emit('sendMessage', {message: this.message, to_id:this.postService.getCreatorId()? this.postService.getCreatorId() : this.chatUserId});

 
  var element = document.createElement("li");
  //console.log("form id "+this.fromId);
  element.innerHTML = this.message;

  element.style.background = '#00C0F7';

  element.style.color="white"

  element.style.fontSize="14px"

  element.style.padding =  '15px 30px';

  element.style.margin = '10px';

  element.style.borderRadius = "20px 20px 20px 20px";

  element.style.textAlign = 'right';

  document.getElementById('message-list').appendChild(element);

  this.message = '';

}


onLogout()
{
  this.authService.logout();
}

inititatecontract(postid:string)
{
  localStorage.setItem('sellerid',this.chatUserId);
  //localStorage.getItem('userId');
  localStorage.setItem('sellerpostid',postid);
  this.router.navigate(['/smartcontract']);
}

//this.chatUserId
singlepost(postid:string)
{
  //console.log(postid);
  this.router.navigate(["/post",postid ]);
}


}