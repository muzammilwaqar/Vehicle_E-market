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
//import { runInThisContext } from 'vm';

export interface userData
{
  fullName:string;
  email: string;

  phoneNumber:string;
  fullAddress:string;
  cnicNumber:number;
  dob:Date;
  genderStatus:string;
  //accountStatus:string;
  imagePath:string;
}


@Component({
  selector: 'app-userprofile',
templateUrl:'./user-profile.component.html',
styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit
{
  isloading =false;
  private authStatusSub: Subscription;
  signupform : FormGroup;
  userId :string;
  private authServiceSub : Subscription;
  userIsAuthenticated =false;
  currentusercnic:number;
  userdf:userData;
  usercnic:string;
  form : FormGroup;
  imagePreview : string;
  fullName:string;
  fullAddress: string;
  email: string;
  cnicNumber: string;
  dob:Date;
  phoneNumber:string;
  genderStatus:string;
  accountStatus:any;
  authorizedStatus:boolean;
  try:any[];
  private authListenerSubs: Subscription;
  userdetails: any
  userandadminstatus:boolean;
  totalUnverifiedUsers = 0;
  allposts:any=[];
  currentPage = 1;
  fabricsellercontract:any=[];
  fabricbuyercontract:any=[];
  pageSizeOptions = [1,2,5,10];
  barChartData: any;
  barChartLabels: any;
  barChartType = 'bar';
  chartReady = false;
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  userPosts: any;
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true,
              userCallback: function(label, index, labels) {
                  // when the floored value is the same as the value we have a whole number
                  if (Math.floor(label) === label) {
                      return label;
                  }

              },
          }
      }],
  },
  };
  verified:boolean ;
  sellercontract:any=[];
  buyercontract:any=[];
  adminstatus:string;
  approve:boolean;
  loggedinuserId:string;
  currentuser:string;
  sellercontractslist:any=[];
  buyercontractslist:any=[];

  constructor(public authService: AuthService, public postsService: PostsService,public router: Router,public dialog: MatDialog,private _snackBar: MatSnackBar)
  {
        this.authService.getuserDeatils().subscribe(data =>
          {
          let dataincome= data;
          this.userdetails = dataincome.user;
          this.userId = dataincome.user._id;
          console.log(this.userId)
          if(this.userdetails.profileimage == "dummy")
          {
            this.userdetails.profileimage = "../../../assets/images/avatar.svg";
          }
          this.authService.getuserposts(this.userId).subscribe(data =>
            {
              let alluserposts = data;
              this.allposts = alluserposts;
              //console.log("This.all posts inside: "+data);
            });
            this.authService.getcontractbybuyercnic(this.userdetails.cnicNumber).subscribe(result => 
              {
                let q= Object.entries(result);
               
                  for(let i=0; i<q.length;i++)
                  {
                    let r = Object.entries(q[i][1]);
                    let s = Object.entries(r[1][1]);
                     this.buyercontractslist.push(s); 
                   
                  }
                  
              });
           
              this.authService.getcontractbysellercnic(this.userdetails.cnicNumber).subscribe(result => 
                {
                
                  let q= Object.entries(result);
               
                  for(let i=0; i<q.length;i++)
                  {
                    let r = Object.entries(q[i][1]);
                    let s = Object.entries(r[1][1]);
                     this.sellercontractslist.push(s); 
                     console.log("seller blockchain"+this.sellercontractslist);
                  }
                 
                });
          //console.log(this.userdetails);
      },err=>{
        console.log(err);

      });

      


  this.authService.getuserStats().subscribe(data =>{
 //console.log("issssdata", data);
 this.userPosts = data.userPosts;
 let values = []; 
 let labels = [];
 data.barData.forEach((elem) => {
   if(elem._id !== null) {
    values.push(elem.count);
    labels.push(this.months[elem._id]);
   }  
 });
 values.push(0);
 
 this.barChartData = [{data: values, label: 'No.of Posts'}];
 this.barChartLabels = labels;
 this.chartReady = this.userPosts > 0 ?  true :  false;
},err=>{
console.log(err);

});

      this.cnicNumber = localStorage.getItem("loggedinusercnic");
     
        this.authService.getallbuyercontracts(this.cnicNumber ).subscribe(result =>
        {
          this.buyercontract=result;
          let q= Object.entries(result);
          
       
        });
      this.authService.getallsellercontracts(this.cnicNumber).subscribe(result =>
        {
          this.sellercontract=result;
          let p= Object.entries(result);
          console.log("detaols ; ",this.sellercontract)
          //console.log("Seller contract: "+p);
        });
        //console.log("Buyer contract: "+this.buyercontract);
        //console.log("Seller contract: "+this.sellercontract);

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

  this.loggedinuserId = localStorage.getItem('userId');
  this.adminstatus = localStorage.getItem("adminstatus");
  if(this.adminstatus == 'true')
  {
   // console.log("set true");
    this.approve = true;
  }
  else
  {
    this.approve = false;
  }
  


  this.isloading=true;

  // console.log( this.authService.getcurrentuserdetails());
  this.isloading=false;



}
singlepost(postid:string)
{
  this.router.navigate(["/post", postid]);
}

ngOnDestroy()
{}

onedit()
{
  this.router.navigate(["/editprofile"]);
}

onLogout()
{
  this.authService.logout();
}
onuserDelete(id:string)
{

  var check = this.getConfirmation();
  if(check == true)
  {
    this.authService.deleteAccount(id);
    this.authService.logout();
  }

}

onpostDelete(postId: string) {

  var check = this.getConfirmation();
  if(check == true)
  {
    this.isloading = true;
    this.postsService.deletepost(postId).subscribe(() => {
      alert("Item has been Deleted");
      this.router.navigate(["/userprofile"]);
    });
    this.isloading = false;
    this.router.navigate(["/userprofile"]);
  }
  this.router.navigate(["/userprofile"]);
}

onaccept(contractid:string)
{
  this.router.navigate(["/sellcontract",contractid]);
}

onreject(contractid:string)
{
  console.log("user-profile line:194: "+contractid);
  var check = this.getConfirmation();
  if(check == true)
  {
    //alert("check stable");
    this.authService.deletecontact(contractid);
 }


}

openSnackBar() {
    this._snackBar.open("Item has Been", "Deleted", {
      duration: 50,
    });
    this.router.navigate(["/userprofile"]);
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

oneditpic()
{
  this.router.navigate(["/profilepic"]);
}

onimageopen(imageurl:string)
{
  
}
openDialog(imageurl:string) 
{
  localStorage.removeItem("imageurl");
  localStorage.setItem("imageurl",imageurl);
  this.dialog.open(DialogElementsExampleDialog);

}

}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'image-preview.html',
})
export class DialogElementsExampleDialog 
{
   url:String;

   constructor()
   {
     this.url = localStorage.getItem("imageurl");
   }
}