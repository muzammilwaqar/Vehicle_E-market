import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../../posts/post.model';
import { AuthSignupData } from '../auth-signup-data.model';
import { PostsService } from '../../posts/posts.service';
import {Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Chart } from '../../../../node_modules/chart.js';

@Component(
{
  selector: 'app-admin',
  templateUrl:'./admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit, OnDestroy
{

users: AuthSignupData[] = [];
unverifiedUsers: AuthSignupData[] = [];
verifiedUsers: AuthSignupData[] = [];
isloading =false;
totalUnverifiedUsers = 0;
unverifiedUsersPerPage = 5;
currentPage = 1;
pageSizeOptions = [1,2,5,10];
userId :string;
private postsSub: Subscription;
private authServiceSub : Subscription;
private alluser: Subscription;
private allunverifiedUsers: Subscription;
private allverifiedUser: Subscription;

userIsAuthenticated =false;
accountStatus:string;
verified:boolean ;
allusercount:number;
allunverifiedUserCount:number;
allverifiedUserCount:number;
allpostscount:number;
allposts:Post[]=[];
totalPosts = 0;
allusers:any;
verifieduser:any;
unverified:any;
stringalluser:number;
stringverified:number;
stringunverified:number;
Linechart =[];
piedata=[];
pieoptions=["All Users","UnVerified","verified"];
/*pie chart data */
allcontracts:any=[];
finalizedcontracts:number;
pendingcontracts:any;
constructor(public authService: AuthService,public postsService: PostsService)
{
  this.authService.getallcontracts().subscribe(result => 
    {
      console.log("all contract result : "+ result)
      let q= Object.entries(result);
      this.finalizedcontracts = q.length;
      for(let i=0; i<q.length;i++)
            {
              let r = Object.entries(q[i][1]);
              let s = Object.entries(r[1][1]);
               this.allcontracts.push(s); 
            } 

      console.log("total contracts:" +q.length);
      //this.allcontract  =result;
    });

    this.authService.getpendingcontracts().subscribe(result => 
      {
        this.pendingcontracts = result;
      });
}


ngOnInit()
  {
    this.isloading=true;
    this.users = this.authService.getallUsers();
    this.allusercount = this.users.length;
    this.unverifiedUsers = this.authService.getUnverifiedUsers();
    this.allunverifiedUserCount = this.unverifiedUsers.length;
    this.verifiedUsers = this.authService.getVerifiedUsers();
    this.allverifiedUserCount=this.verifiedUsers.length;
    this.postsService.getPosts(this.unverifiedUsersPerPage,this.currentPage);
    this.postsSub = this.postsService.getPostUpdate()
    .subscribe((postData: { posts: Post[], postCount: number }) => {
      this.isloading = false;
      this.totalPosts = postData.postCount;
      this.allposts = postData.posts;
    });
    this.isloading=false;

    this.authService.getallusercount().subscribe(reslt => 
      {
        this.allusers = reslt;
        console.log(this.allusers)
        this.stringalluser = this.allusers;
        this.piedata.push(reslt);
      });

    this.authService.getverifiedusercount().subscribe(reslt => 
      {
        this.verifieduser = reslt;
        this.piedata.push(reslt);
      });


    this.authService.getunverifiedusercount().subscribe(reslt => 
      {
        this.unverified = reslt;
        this.piedata.push(reslt);
      });

      /*this.authService. getallcontracts().subscribe(result => 
        {
          let q= Object.entries(result);
         
           for(let i=0; i<q.length;i++)
            {
              let r = Object.entries(q[i][1]);
              let s = Object.entries(r[1][1]);
               this.buyercontractslist.push(s); 
            }
        });*/



    /*line chart check*/

    this.Linechart = new Chart('linechart',
    {
      type: 'line',
      data:
      {
        labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets:
        [{
          label:'Number of Ads in Months',
          data: [8,7,6,22,7,3,5,11,9,0,17],
          fill:false,
          lineTesion:0.3,
          borderColor:"red",
          borderWidth:1
        }]
      },
      options:
      {
        title:
        {text:"Line Chart",
        display:false
      },
      scales:
      {
        yAxis:
        [{
          ticks:
          {
            beginAtZero:true
          }
        }]
      }
    }});

    /*line chart check*/

    /*chart check
    stat*/


    var myChart = new Chart("myChart", {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    

    /*pie chart*/
   
  var piechart = new Chart("pieChart", {
    type: 'doughnut',
    data: {
        labels: ['All Users', 'Unverified Users', 'Verified Users'],
        datasets: [{
            label: '# of Users',
            data: [this.stringalluser,this.verifieduser, this.unverified],
            
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
  });
}


onChangedPage(pageData: PageEvent)
{
  this.currentPage = pageData.pageIndex +1;
  this.unverifiedUsersPerPage = pageData.pageSize;
  this.authService.getUnverifiedUsers();
}

ngOnDestroy()
{}

onDelete(cnicNumber: number)
{
  this.isloading = true;
  this.authService.deleteUser(cnicNumber);
  this.isloading=false;
}

onApprove(cnicNumber:number)
{
  this.isloading=true;
  this.authService.approveUser(cnicNumber);
  this.isloading=false;
}
onLogout()
    {
      this.authService.logout();
    }
}
