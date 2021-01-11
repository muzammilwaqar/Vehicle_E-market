import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//import { SSL_OP_NO_TLSv1_1 } from 'constants';
import { Subscription } from 'rxjs';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';
import { Post } from 'src/app/posts/post.model';
import { PostsService } from 'src/app/posts/posts.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-smartcontract',
  templateUrl:'./smart-contract.component.html',
  styleUrls: ['./smart-contract.component.css']
})

export class SmartContractComponent
{
  isloading =false;
  private authStatusSub: Subscription;
  contractform : FormGroup;
  imagePreview : string;
  sellerid:string;
  buyerid:string;
  postid:string;
  buyerName:string;
  sellerName:string;
  buyerCNIC:string;
  sellerCNIC:string;
  userdetails: any;
  buyerdetails: any;
  post:Post;
  postList:any=[];
  features=[];
  sellerdetails: any;

  //car data
  make:string;
  model:string;
  registrationcity:string;
  enginetype:string;
  enginecapacity:string;
  transmission:string;
  assembly:string;
  feature:string;
  color:string;

  constructor(public authService: AuthService,public route: ActivatedRoute, private _formBuilder: FormBuilder,public postsService: PostsService,)
  {
    this.sellerid = localStorage.getItem('sellerid');
    this.buyerid =  localStorage.getItem('userId');
    this.postid = localStorage.getItem('sellerpostid');
    //console.log("seller id"+this.sellerid);
    //console.log("Buyer Id"+this.buyerid);
    //console.log("Post Id "+this.postid);
    //localStorage.removeItem('sellerid');
    //localStorage.removeItem('sellerpostid');

    //Buyer Details
    this.authService.getuserDeatils().subscribe(data =>{
      let dataincome= data;
      this.buyerdetails = dataincome.user;
      this.buyerName= this.buyerdetails.fullName;
      this.buyerCNIC = this.buyerdetails.cnicNumber;
      this.buyerid = dataincome.user._id;

        },err=>{
          console.log(err);

        });


      //Seller Details
      this.authService.useraccountdetails(this.sellerid).subscribe(data =>{

        let a = Object.entries(data);
        let sellern = a[1];
        let sellerc = a[6];
        this.sellerName = sellern[1];
        this.sellerCNIC = sellerc[1];
        var resultArray = Object.keys(data).map(function(personNamedIndex){
          let person = data[personNamedIndex];
          return person;
         })
        this.sellerdetails = resultArray;
        },err=>{
          console.log(err);
        });

       //post Details

       this.postsService.getsinglepost(this.postid).subscribe(data=>{
        this.postList = data;

       let p= Object.entries(data);
       console.log("p object enteries on smart contract 10 "+p[10][1]);
       console.log("p object enteries on smart contract 11 "+p[11][1]);
       console.log("p object enteries on smart contract 12 "+p[12][1]);
       console.log("p object enteries on smart contract 13 "+p[13][1]);
       console.log("p object enteries on smart contract 14 "+p[14][1]);
       console.log("p object enteries on smart contract 15 "+p[15][1]);
       console.log("p object enteries on smart contract 16 "+p[16][1]);
       
       //console.log("data: "+p);
       this.make=p[2][1];
       this.model=p[3][1];
       this.registrationcity=p[4][1];
       this.color=p[6][1];
       this.enginetype=p[13][1];
       this.enginecapacity=p[14][1];
       this.transmission=p[15][1];
       this.assembly=p[16][1];
       this.feature=p[14][1];



       //console.log("Make"+this.make);

        var str = this.postList.features;
        var seprate = str.split(',');
        for(let i=0; i<seprate.length; i++)
        {
          this.features[i] = seprate[i];
        }


      },err=>{
        console.log(err);
      });
     // console.log("post: "+this.postList);
      //.log("features: "+this.features);
  }

  ngOnInit()
  {


  this.authStatusSub =  this.authService.getAuthStatusListener().
  subscribe(authStatus => {
    this.isloading = false;
  });
  this.contractform = new FormGroup(
    {

      BuyerPK : new FormControl(null, {validators:[Validators.required]}),

      registrationnumber : new FormControl(null,{validators:[ Validators.required ]}),
      //registrationcity : new FormControl(null,{validators:[ Validators.required ]}),
      price : new FormControl(null,{validators:[ Validators.required ]}),

      image : new FormControl(null,{validators: [Validators.required], asyncValidators :[mimeType]})
    });


  }


  oncreatecontract()
  {
    //console.log("smart contract ts file create function");
    if(this.contractform.invalid)
    {
      //console.log("creation contract failed");
      return;
    }
    else
    {
      //check if the key is authentic
      this.authService.checkKey(this.contractform.value.BuyerPK).subscribe(result =>
        {

          if(result == true)
          {
            console.log("inside "+result);
            this.isloading = true;
            this.authService.createContract
            (
              this.postid,
              this.buyerName,
              this.buyerCNIC ,
              this.buyerid ,
              this.contractform.value.BuyerPK ,
              this.sellerName ,
              this.sellerCNIC ,
              this.sellerid,
              //this.contractform.value.SellerPK ,
              this.make,
              this.model ,
              this.contractform.value.registrationnumber ,
              this.registrationcity ,
              this.contractform.value.price ,
              this.enginetype ,
              this.enginecapacity ,
              this.transmission ,
              this.assembly ,
              //this.features ,
              this.color ,
              this.contractform.value.image
              );
          }
          else
          {
            alert("Secret Key Error Try Again");
            console.log("inside: "+result);
          }
          this.isloading =false;
          this.contractform.reset();
          localStorage.removeItem('sellerid');
          localStorage.removeItem('sellerpostid');
        });

    //this.authService.createUser(form.value.fullName, form.value.email, form.value.password, form.value.phoneNumber, form.value.fullAddress, form.value.cnicNumber );


    }

  }

  //on image picked
  onImagePicked(event : Event)
  {
    const file = (event.target as HTMLInputElement).files[0];
    this.contractform.patchValue({image: file});
    this.contractform.get('image').updateValueAndValidity();
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


  ngOnDestroy()
  {
    this.authStatusSub.unsubscribe();
  }



}
