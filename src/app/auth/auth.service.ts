import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { AuthLoginData } from './auth-login-data.model';
import { AuthSignupData } from './auth-signup-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import {PostsService} from '../posts/posts.service'
import { stringify } from '@angular/compiler/src/util';
const BACKEND_URL = environment.apiUrl +"/user/";
const FABRIC_URL = "http://localhost:8000/api/";
export interface message {
    cnicNumber: number;
    Creatorid: any;
    message: string;
  }


@Injectable({providedIn: "root"})

export class AuthService
{
  private unverifiedUsers: AuthSignupData[] = [];
  private verifiedUsers: AuthSignupData[] = [];
  private allUsers: AuthSignupData[] = [];
  private alluserchats=[];
  private userdet: AuthSignupData[]=[];
  private userdata:AuthSignupData;
  private userstatus:AuthSignupData;
  private unverifiedUsersUpdated= new Subject<{unverifiedUsers: AuthSignupData[],unverifiedUsersCount:number}>();
  private verifiedUsersUpdated= new Subject<{verifiedUsers: AuthSignupData[],verifiedUsersCount:number}>();
  private allUpdated= new Subject<{allUsers: AuthSignupData[],allUsersCount:number}>();
  private token :string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer :any;
  private userId: string;
  private temp =  new Subject<string>();
  private currentUser:number;
  private currentUseraccountStatus:string;
  private currentUserauthorizeStatus:boolean;
  private accountstatus=  new Subject<string>();
  //private accountstatus: string;
  private userDeatils: AuthSignupData;
  private portid1:number;
  private portid2:number;
  private port:number;
  private test : string[] =[];
  private newpassword:string;
  private usersUpdated = new Subject<{ users: AuthSignupData[], userCount: number }>();
  private message:string;
  private curretnuserdetails:any;
  private userchat=[];
  constructor(private http : HttpClient, private router: Router, private postService:PostsService){}




  createUser(fullName:string, email:string, password:string, phoneNumber:string, fullAddress:string, cnicNumber:string,dob:string,genderStatus:string ,/*accountStatus:string,*/ image:File)
  {
    const prof='';
    const authData = new FormData();
    authData.append("fullName",fullName);
    authData.append("email",email);
    authData.append("password",password);
    authData.append("phoneNumber",phoneNumber);
    authData.append("fullAddress",fullAddress);
    authData.append("cnicNumber",cnicNumber);
    authData.append("dob",dob);
    authData.append("genderStatus",genderStatus);
    authData.append("image",image);
    authData.append("profileimage",prof);
   // const avialblecheck = this.http.get(BACKEND_URL+"userdetails",cnicNumber)

    this.http.post<{message :string, user:AuthSignupData }>
      (BACKEND_URL+"signup",authData)
      .subscribe((responseData)=>{

       this.router.navigate(["/"]);
  },error => {
    this.authStatusListener.next(false);
  }
  );
  this.router.navigate(["/"]);

  }




login(cnicNumber: number, password: string)
  {
    const authData: AuthLoginData = {cnicNumber: cnicNumber, password:password};
    this.http.post<{token: string, expiresIn:number ,userId:string, accountStatus:string, authorizedStatus:Boolean}>(BACKEND_URL+"login",authData)
      .subscribe(response =>
        {
          localStorage.setItem("loggedinusercnic",cnicNumber.toString());
          const token = response.token;
          this.token =token;
          if(token)
          {

            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            //this.accountstatus = response.accountStatus;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration *1000);
            this.saveAuthData(token,expirationDate,this.userId);
            if(response.accountStatus =='user')
            {
              this.router.navigate(["/"]);
            }
            else if(response.accountStatus =='admin')
            {
              this.router.navigate(["/auth/admin"]);
              //console.log(response.accountStatus);
            }

          }
        }, error => {
              this.authStatusListener.next(false);
        });
        this.currentUser = cnicNumber;

        this.getcurrentuserstatus();
        //this.forgotpassword(3710558105933,"0ce8d34a082854ea18b83eafac46cc38b532d59aed0d18c85d50ec4e8d517273");
        //this.currentUserauthorizeStatus =
        //this.getcurrentuserauthstatus();
       // this.createport();
       // this.getuserDeatils();
  }
/*
  private setcnicNumber(cnic:number)
  {
    localStorage.setItem('cnicNumber',cnic);
  }*/

  autoAuthUser()
  {
    const authInformation = this.getAuthData();
    if(!authInformation)
    {
      return;
    }
    const now = new Date();
    const expiresIn =authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0)
    {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId =authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }


  logout()
  {
    this.token =null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId =null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration:number)
  {
    this.tokenTimer= setTimeout(() => {
      this.logout();
    },duration * 3000);
  }

  private saveAuthData(token:string, expirationDate: Date, userId:string)
  {
    localStorage.setItem('token',token);
    localStorage.setItem("expiration",expirationDate.toISOString());
    localStorage.setItem("userId",userId);
  }

  private clearAuthData()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('postsearched');
    localStorage.removeItem('adminstatus');
  }

  private getAuthData()
  {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate)
    {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  getallUsers()
  {

    //const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ users:any }>(BACKEND_URL+"/allusers")
     .subscribe(response =>
      {
        var i;
        for (i = 0; i < response.users.length; i++)
        {
          this.allUsers[i] = response.users[i];
        }

      })

      return this.allUsers;
      //return this.unverifiedUsers;
  }

  getUnverifiedUsers()
  {

    //const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ users:any }>(BACKEND_URL+"/unverifiedusers")
     .subscribe(response =>
      {
        var i;
        for (i = 0; i < response.users.length; i++)
        {
          this.unverifiedUsers[i] = response.users[i];
        }

      })

      return this.unverifiedUsers;
      //return this.unverifiedUsers;
  }

  //verified users get
  getVerifiedUsers()
  {
    this.http.get<{ users:any }>(BACKEND_URL+"/verifiedusers")
    .subscribe(response =>
      {
        var i;
        for (i = 0; i < response.users.length; i++)
        {
          this.verifiedUsers[i] = response.users[i];
        }
      })

      return this.verifiedUsers;
  }

getuserDeatils()
{

//console.log(BACKEND_URL+"userdetails");

  return  this.http.get<{ user:any }>(BACKEND_URL+"userdetails")
}

getuserStats()
{

//console.log(BACKEND_URL+"userdetails");

  return  this.http.get<any>(BACKEND_URL+"userstats")
}

getcurrentuserdetails()
{
  return this.curretnuserdetails;
}


  verifieduserdata(verifieduser:any)
  {
    this.unverifiedUsers = verifieduser;
  }

  getverifiedUsersupdate()
  {
    return  this.verifiedUsersUpdated.asObservable();
  }

  unverifieduserdata(unverifieduser:any)
  {
    this.unverifiedUsers = unverifieduser;
  }

  getUnverifiedUsersupdate()
  {
    return  this.unverifiedUsersUpdated.asObservable();
  }

  getUsersDeatils()
  {
    return  this.userDeatils;
  }


  userProfileDetails()
  {
    const user = this.getuserDeatils();

  }

  getIsAuth()
  {
    return this.isAuthenticated;
  }

  getUserId()
  {
    return this.userId;
  }

  getUsercnic()
  {
    return this.currentUser;
  }


  getToken()
  {
    return this.token;
  }

  getAuthStatusListener()
  {
    return this.authStatusListener.asObservable();
  }


  approveUser(cnicNumber:number)
  {
    this.http.post(BACKEND_URL +"approve",{cnicNumber}).subscribe(res =>
      {
        console.log(res);
        this.router.navigate(["auth/unverified"]);
      });
  }

  disableUser(cnicNumber:number)
  {
    this.http.post(BACKEND_URL +"disable",{cnicNumber}).subscribe(res =>
      {
        console.log(res);
        this.router.navigate(["auth/verified"]);
      });
  }


  deleteUser(cnicNumber :number)
  {
   // console.log("auth service reached");
    this.http.post(BACKEND_URL +"deleteuser",{cnicNumber}).subscribe(res =>
      {
        console.log(res);
        this.router.navigate(["auth/admin"]);
      });
  }


  deleteAccount(id:string)
  {
   // console.log("auth service reached");
   const userId = localStorage.getItem('userId');
    this.http.post(BACKEND_URL +"deleteaccount/"+userId,id).subscribe(res =>
      {
        //console.log(res);
        //this.router.navigate();
      });
  }

  getcurrentuserstatus()
  {
    const currentuserId = localStorage.getItem('userId');
    return this.http.get(BACKEND_URL+"accstatus/"+currentuserId);
    //return  this.http.get(BACKEND_URL+"accstatus"+currentuserId);
  }

  getcurrentuserauthstatus()
  {
    this.http.get<{user:any}>(BACKEND_URL+"/userdetails"+this.currentUser).subscribe(use =>
      {
        console.log(use + "curretn status" );
      });
  }

  getcurrentuserauthorizestatus()
  {
   return this.currentUserauthorizeStatus;
  }


  sendmail(email:string, subject:string, message:string)
  {
    const mailData =new FormData();
    mailData.append("email",email);
    mailData.append("subject",subject);
    mailData.append("message",message);
   // console.log(mailData);
    /////console.log(email);
  //  console.log(subject);
   // console.log(message);
    let mail =
    {
      email: email,
      subject: subject,
      message: message
    };
    this.http.post(BACKEND_URL +"mail",mail).subscribe(data =>
      {
        let res:any =data;
        //console.log(res);
        this.router.navigate(["/contactus"]);
      });


    //this.router.navigate(["/contactus"]);
    }

  forgotpassword(cnicNumber: number, privatekey: string)
    {
    const authData = {cnicNumber, privatekey};
      //return this.http.put(BACKEND_URL +"forgotpassword",authData);*/
        /*.subscribe(response =>
          {
            console.log(response);
          })*/
          this.http.post<{password:string}>(BACKEND_URL+"login",authData)
          .subscribe(response =>
            {
              //console.log(response);
              //console.log(response.password);
              this.router.navigate(["/auth/login"]);
            })
            this.router.navigate(["/auth/login"]);
    }


    edituserdetails(cnicNumber:number, email:string, password:string, phoneNumber:string, fullAddress:string)
    {
      const authData = {cnicNumber: cnicNumber, password:password,email:email,phoneNumber:phoneNumber,fullAddress:fullAddress};
      console.log(authData);
      //authData.append("profileimage", image);

      this.http.post(BACKEND_URL+"updateuserdetails",authData).subscribe(response =>
        {
          console.log(response);
        });
      this.router.navigate(["/userprofile"]);
    }



    getuserchats()
    {
      const userId = localStorage.getItem('userId');
      //console.log(userId);
      return this.http.get(BACKEND_URL+"getChatBox/"+userId);
    }

    getchats(chatuserid:string)
    {
      const currentuserId = localStorage.getItem('userId');
      //console.log(currentuserId);
      const data = {currentuserid:currentuserId, chatuserid:chatuserid};
      //console.log(data);
     return  this.http.post(BACKEND_URL+"inboxmessage/",data);
    }

    createContract(postID:string, BuyerName : string ,BuyerCNIC : string , buyerid:string, BuyerPK : string  ,  SellerName : string  ,  SellerCNIC : string  , sellerid:string,
      make : string  ,  model : string  , registrationnumber : string ,  registrationcity : string  ,  price : string  ,  enginetype : string  ,
      enginecapacity : string  , transmission : string  ,  assembly : string  ,   exteriorcolor : string  ,  image:File)
      {
        //console.log("in auth service method start")
        const contractData = new FormData();
        contractData.append("postID",postID);
        
          contractData.append("BuyerName",BuyerName);
          contractData.append("BuyerCNIC",BuyerCNIC);
          contractData.append("buyerid",buyerid);
          contractData.append("BuyerPK",BuyerPK);
          contractData.append("SellerName",SellerName);
          contractData.append("SellerCNIC",SellerCNIC);
          contractData.append("sellerid",sellerid);
          contractData.append("make",make);
          contractData.append("model",model);
          contractData.append("registrationnumber",registrationnumber);
          contractData.append("registrationcity",registrationcity);
          contractData.append("price",price);
          contractData.append("enginetype",enginetype);
          contractData.append("enginecapacity",enginecapacity);
          contractData.append("transmission",transmission);
          contractData.append("assembly",assembly);

          contractData.append("exteriorcolor",exteriorcolor);
          contractData.append("image",image);

          let q= Object.entries(contractData);
           console.log("contract data" + q);

        this.http.post(BACKEND_URL+"createcontract",contractData)
          .subscribe((responseData)=>{

              this.router.navigate(["/inbox"]);
          },error => {
            let p= Object.entries(error);
            console.log("error"+p);
            this.authStatusListener.next(false);
          }
          );

      }

      resetpassword(cnicNumber: number, password: string)
      {
        const authData = {cnicNumber, password};
        this.http.put(BACKEND_URL +"reset",authData)
          .subscribe(response =>
            {
              console.log(response);
            })
      }


      useraccountdetails(id:string)
      {
        console.log("auth user accoutn id:"+id);
        //return this.http.get(BACKEND_URL+"getChatBox/"+userId);
        return this.http.get(BACKEND_URL+"accountdetails/"+id);
      }

      checkKey(key:string)
      {
        return this.http.get(BACKEND_URL+"key/"+key);
      }

      getallbuyercontracts(cnicNumber:string)
      {
        return this.http.get(BACKEND_URL+"buyercontract/"+cnicNumber);
      }

      getallsellercontracts(cnicNumber:string)
      {
        return this.http.get(BACKEND_URL+"sellercontract/"+cnicNumber);
      }

      getcontractdetails(contractid:string)
      {
        return this.http.get(BACKEND_URL+"contractdetails/"+contractid);
      }


      deletecontact(contractid:string)
      {
        console.log("auth service: line 544:"+contractid);
        this.http.post(BACKEND_URL+"deletecontract/"+contractid,contractid).subscribe(() =>
        {
          alert("Item has been Deleted");
          this.router.navigate(["/userprofile"]);
        });
      }

      deletecontactandreview(contractid:string,reviewid:string)
      {
        //console.log("auth service: line 544:"+contractid);
        this.http.post(BACKEND_URL+"deletecontract/"+contractid,contractid).subscribe(() =>
        {
          alert("Item has been Deleted");
          //this.router.navigate(["/review",reviewid]);
        });
      }




  createAdmin(fullName:string, email:string, password:string, phoneNumber:string, fullAddress:string, cnicNumber:string,dob:string,genderStatus:string)
  {

    const authData = new FormData();
    authData.append("fullName",fullName);
    authData.append("email",email);
    authData.append("password",password);
    authData.append("phoneNumber",phoneNumber);
    authData.append("fullAddress",fullAddress);
    authData.append("cnicNumber",cnicNumber);
    authData.append("dob",dob);
    //authData.append("image",image);
    authData.append("genderStatus",genderStatus);
   // const avialblecheck = this.http.get(BACKEND_URL+"userdetails",cnicNumber)
    this.http.post<{message :string, user:AuthSignupData }>
      (BACKEND_URL+"createadmin",authData)
      .subscribe((responseData)=>{

       this.router.navigate(["/auth/admin"]);
  },error => {
    this.authStatusListener.next(false);
    alert(error.message);
  }
  );
  this.router.navigate(["/auth/admin"]);

  }

  updateprofilepic(image:File)
  {
    const currentuserId = localStorage.getItem('userId');
    const updateData = new FormData();
    updateData.append("image",image);
    console.log("auth servoce file:" + image);
    updateData.append("id",currentuserId);
    this.http.post(BACKEND_URL+"updateprofileimage",updateData)
          .subscribe((responseData)=>{
              this.router.navigate(["/userprofile"]);
          },error => {
            let p= Object.entries(error);
            console.log("error"+p);
            this.authStatusListener.next(false);
          }
          );
  }

  createReview(subject:string, rating:string, review:string, reviewed:string)
  {
    const reviewer = localStorage.getItem('userId');
    console.log("inside auth service");
    console.log("Subject : "+subject);
    console.log("Rating : "+rating);
    console.log("Review : "+review);
    console.log("Reviewed : "+reviewed);
    console.log("Reviewer : "+reviewer);

    const reviewData = new FormData();
    reviewData.append("subject",subject);
    reviewData.append("review",review);
    reviewData.append("rating",rating);
    reviewData.append("reviewed",reviewed);
    reviewData.append("reviewer ",reviewer);
    let q= Object.entries(reviewData);
    console.log("final data" + q);

    this.http.post(BACKEND_URL+"createreview/"+subject+"/"+rating+"/"+review+"/"+reviewed+"/"+reviewer,reviewData)
          .subscribe((responseData)=>{

              this.router.navigate(["/"]);
          },error => {
            //let p= Object.entries(error);
            //console.log("error"+p);
            this.authStatusListener.next(false);
          }
          );
  }


  
  
  deleteChat(chatuserid:string)
  {
    const currentuserId = localStorage.getItem('userId');
      //console.log(currentuserId);
      const data = {currentuserid:currentuserId, chatuserid:chatuserid};
    this.http.post(BACKEND_URL+"deleteChat/",data).subscribe(() =>
        {
          alert("Item has been Deleted");
          this.router.navigate(["/inbox"]);
        });
  }

     







  finalizeContract(contractID : string, sellerFullName : string  , sellerCNIC : string  ,  sellerSecretKey : string,
    buyerFullName : string ,buyerCNIC : string ,  buyerSecretKey : string  ,carRegistrationNumber : string ,   price : string  , 
     carMake : string  ,  carModel : string  , registrationCity : string  , engineType : string  , engineCapacity : string  , transmission : string,
    color : string  ,      image:string )
  {
    const contract = "5";
    const data = {"contractID":"contract10",
                  "sellerFullName":sellerFullName,
                  "sellerCNIC":sellerCNIC,
                  "sellerSecretKey":sellerSecretKey,
                  "buyerFullName":buyerFullName,
                  "buyerCNIC":buyerCNIC,
                  "buyerSecretKey":buyerSecretKey,
                  "carRegistrationNumber":carRegistrationNumber,
                  "price":price,
                  "carMake":carMake,
                  "carModel":carModel,
                  "registrationCity":registrationCity,
                  "engineType":engineType,
                  "engineCapacity":engineCapacity,
                  "transmission":transmission,
                  "color":color,
                  "image":image
                  };
    const contractData = new FormData();
    
    var object = {};
    contractData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);
    console.log(data);

    this.http.post(FABRIC_URL+"addContract",data)
          .subscribe((responseData)=>{

              this.router.navigate(["/userprofile"]);
          },error => {
            let p= Object.entries(error);
            //console.log("error"+p);
            this.authStatusListener.next(false);
          }
          );


      
  }


  getReviews(userid:string)
  {
    return this.http.get(BACKEND_URL+"getreviews/"+userid);
  }

  getuserposts(userId:string)
  {
    console.log("auth"+ userId);
    return this.http.get(BACKEND_URL+"userposts/"+userId);
  }


  getcontractbysellerfullname(fullname:string)
  {
    return this.http.get(FABRIC_URL+"queryContractBySellerName?sellerFullName="+fullname);
  }

  getcontractbybuyerfullname(fullname:string)
  {
    return this.http.get(FABRIC_URL+"queryContractByBuyerName?buyerFullName="+fullname);
  }
  
  getcontractbysellercnic(cnicNumber:string)
  {
    return this.http.get(FABRIC_URL+"queryContractBySellerCNIC?sellerCNIC="+cnicNumber);
  }

  getcontractbybuyercnic(cnicNumber:string)
  {
    return this.http.get(FABRIC_URL+"queryContractByBuyerCNIC?buyerCNIC="+cnicNumber);
  }

  getcontractbycarregistrationnumber(carregistration:string)
  {
    return this.http.get(FABRIC_URL+"queryContractByCarRegistrationNumber?carRegistrationNumber="+carregistration);
  }

  getallcontracts()
  {
    return this.http.get(FABRIC_URL+"queryAllContracts");
  }


  getallusercount()
  {
    return this.http.get(BACKEND_URL+"alluserscount");
  }

  getunverifiedusercount()
  {
    return this.http.get(BACKEND_URL+"unverifieduserscount");
  }

  getverifiedusercount()
  {
    return this.http.get(BACKEND_URL+"verifieduserscount");
  }

  getpendingcontracts()
  {
    return this.http.get(BACKEND_URL+"pendingcontracts");
  }

  getauthorizationstatus()
  {
    const currentuserId = localStorage.getItem('userId');
    return this.http.get(BACKEND_URL+"getauthorizedstatus/"+currentuserId);
  }
   //not yet fixed /completed
  /*
  -
  -
  `
  `
  `
  `
  `
  `
  `
  `
  `
  ``
  `
  `
  `
  `
  `
  `
  */


     //resetpassword(cnicNumber:string,privatekey:string)



}
//


