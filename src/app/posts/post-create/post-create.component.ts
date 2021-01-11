import { Component, EventEmitter, Output, OnInit, OnDestroy,ElementRef, ViewChild } from '@angular/core';
//import { templateJitUrl } from '@angular/compiler';
import { Post } from '../post.model'
import { FormGroup,FormArray, FormControl, Validators , FormBuilder} from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

 
interface genericarray {
  value: string;
  viewValue: string;
}

export interface Fruit {
  name: string;
} 

@Component(
{
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy
{
  enteredContent='';
  enteredTitle='';
  private mode ='create';
  private postId : string;
  post :Post
  isloading = false;
  form : FormGroup;
  imagePreview : string;
  images=[];
  urls: string [] = [];
  private authStatusSub : Subscription;
  //@Output() postCreated= new EventEmitter<Post>();
  newPost='';
  //authorizedStatus:boolean;
  authorizedStatus:any;
  enginetype : genericarray[] =[{value:'CNG',viewValue:'CNG'},{value:'Diesel',viewValue:'Diesel'},{value:'Hybrid',viewValue:'Hybrid'},{value:'Petrol',viewValue:'Petrol'}];
  transmission : genericarray[] = [{value:'Manual',viewValue:'Manual'},{value:'Automatic',viewValue:'Automatic'}];
  cities :genericarray[]=[{value:'Islamabad',viewValue:'Islamabad'},{value:'Rawalpindi',viewValue:'Rawalpindi'},{value:'Lahore',viewValue:'Lahore'},{value:'Karachi',viewValue:'Karachi'},{value:'Gujranwala',viewValue:'Gujranwala'},{value:'Sakrdu',viewValue:'Sakrdu'},{value:'Hunza',viewValue:'Hunza'},{value:'Pindigheb',viewValue:'Pindigheb'},{value:'Faislabad',viewValue:'Faislabad'},];
  assembly: genericarray[] = [{value: 'local', viewValue: 'Local'},{value: 'imported', viewValue: 'Imported'}];
  make: genericarray[] = [{value: 'Toyota', viewValue: 'Toyota'},{value: 'Suzuki', viewValue: 'Suzuki'},{value: 'Honda', viewValue: 'Honda'},{value: 'BMW', viewValue: 'BMW'},{value: 'Audi', viewValue: 'Audi'}];
  exteriorcolor: genericarray[] = [{value: 'Red', viewValue: 'Red'},{value: 'White', viewValue: 'White'},{value: 'Black', viewValue: 'Black'},{value: 'Silver', viewValue: 'Silver'},{value: 'Blue', viewValue: 'Blue'},{value: 'Green', viewValue: 'Green'},{value: 'Yellow', viewValue: 'Yellow'}];
  allimages:string;
try:any=[];
userIsAuthenticated = false;
sendimg:any=[];
  allfeatures : string[] =['ABS','Air Bags','Air Conditioning','Alloy Rims','AM/FM Radio','CD Player','Cassette Player','Cool Box','Cruise Control',
  'Climate Control','DVD Player','Front Speakers',
  'Front Camera','Heated Seats','Immobilizer Key',
  'Keyless Entry','Navigation System','Power Locks','Power Mirrors','Power Steering','Power Windows',
  'Rear Seat Entertainment','Rear AC Vents','Rear speakers','Rear Camera','Sun Roof',
  'Steering Switches','USB and Auxillary Cable'];

  features: string[] = [];

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  featureCtrl = new FormControl(null,{validators:[ Validators.required ]});
  filteredFeatures: Observable<string[]>;
   a:string;

 @ViewChild('featureInput') featureInput: ElementRef<HTMLInputElement>;
 @ViewChild('auto') matAutocomplete: MatAutocomplete;

  imagesPath:string[]=[];
  imagesPreviewPath:string[]=[];
  imagespathf:string;
  paths:any[];
  paths2:any[];
  image1:string;
  image2:string;
  image3:string;
  image1any:any;
  image2any:any;
  image3any:any;
  imagePath:string;
  allimagesanytry:any=[];
  constructor(public postsService: PostsService,public route: ActivatedRoute,private authService: AuthService ,private formBuilder: FormBuilder,private router:Router )
  {
    this.filteredFeatures = this.featureCtrl.valueChanges.pipe(
      startWith(null),
      map((feature: string | null) => feature ? this._filter(feature) : this.allfeatures.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our feature
    if ((value || '').trim()) {
      this.features.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.featureCtrl.setValue(null);
  }

  remove(feature: string): void {
    const index = this.features.indexOf(feature);

    if (index >= 0) {
      this.features.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.features.push(event.option.viewValue);
    this.featureInput.nativeElement.value = '';
    this.featureCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allfeatures.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }


  //this ngonit method contains paramap observable so that only url changes but loaded single component and works differently on both links/urls

 // ng oninit starts
  ngOnInit()
  {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.userIsAuthenticated == true)
    {
      this.authService.getauthorizationstatus().subscribe(res => 
        {
          
          let a=res;
          this.authorizedStatus = a;
          if(res = false || a != true)
          {
            this.router.navigate(["/notauth"])
          }
          //console.log("auth status:" , this.authorizedStatus )
        })
    }
   
 

    //this.authorizedStatus = this.authService.getcurrentuserauthorizestatus();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isloading=false;
      }
    );
    this.form= new FormGroup(
      {
      //basic car info
         city : new FormControl(null,{validators:[ Validators.required ]}),
         make : new FormControl(null,{validators:[ Validators.required ]}),
         model : new FormControl(null,{validators:[ Validators.required ]}),
         registrationcity : new FormControl(null,{validators:[ Validators.required ]}),
         mileage : new FormControl(null,{validators:[ Validators.required ]}),
         //engine : new FormControl(null,{validators:[ Validators.required ]}),
         exteriorcolor : new FormControl(null,{validators:[ Validators.required ]}),
         description : new FormControl(null,{validators:[ Validators.required ]}),

        //price info
        price : new FormControl(null,{validators:[ Validators.required ]}),

        //images
        image : new FormControl(null,{validators: [Validators.required], asyncValidators :[mimeType]  }),

        //additional information
        enginetype : new FormControl(null,{validators:[ Validators.required ]}),
        enginecapacity : new FormControl(null,{validators:[ Validators.required ]}),
        transmission : new FormControl(null,{validators:[ Validators.required ]}),
        assembly : new FormControl(null,{validators:[ Validators.required ]}),
        features : new FormControl(null,{validators:[ Validators.required ]}),

        //contact information
        mobilenumber: new FormControl(null, {validators:[Validators.required, Validators.minLength(11),Validators.maxLength(11)]})

      }
    );
    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if(paramMap.has('postId'))
      {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isloading = true;
        this.postsService.getPost(this.postId).subscribe(postData =>
          {
              //Progress spinner here
          this.isloading = false;
          this.post =
          {
             id: postData._id,
             city:postData.city,
             make: postData.make,
             model:postData.model,
             registrationcity: postData.registrationcity,
             exteriorcolor: postData.exteriorcolor,
             mileage: postData.mileage,
             description: postData.description,
             price: postData.price.toString(),
             imagePath: postData.imagePath,
             enginetype: postData.enginetype,
             enginecapacity: postData.enginecapacity,
             transmission:postData.transmission,
             assembly: postData.assembly,
             features: postData.features,
             mobilenumber: postData.mobilenumber.toString(),
             creator: postData.creator
          };
          this.form.setValue(
            {
              city:this.post.city,
              make: this.post.make,
              model:this.post.model,
              registrationcity: this.post.registrationcity,
              exteriorcolor: this.post.exteriorcolor,
              mileage: this.post.mileage,
              description: this.post.description,
              price: this.post.price,
              image: this.post.imagePath,
              enginetype: this.post.enginetype,
              enginecapacity: this.post.enginecapacity,
              transmission:this.post.transmission,
              assembly: this.post.assembly,
              features: this.post.features,
              mobilenumber: this.post.mobilenumber,

            });
        });
      }
      else{
        this.mode = 'create';
        this.postId = null;
      }
    });




  }
 // end of ng oninit


// on image picked
  onImagePicked(event: Event)

  {

    const file = (event.target as HTMLInputElement).files[0];
    
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>
    {
      this.imagePreview = reader.result as string;

    };
    return reader.readAsDataURL(file);


    


    // reader.onload and reader.readAsDataURL works asynchronusly
  }
  // end of on image picked

  selectfiles(event)
  {
    
    //console.log("FAFSAFS", event.target.files);
    if(event.target.files)
    {
     
    this.try = event.target.files;
     console.log("this try"+ this.try);
     for(var i=0;i<=File.length;i++)
     {
      var reader = new FileReader();
      
      reader.readAsDataURL(event.target.files[i]);
      //this.images.push(reader.readAsDataURL(event.target.files[i]));
      reader.onload = (event:any) => 
      {
        this.urls.push(event.target.result);
      }
     } 
    
     
     this.postsService.storeimage1(this.try[0]).subscribe(res => 
      {
        this.image1any = res;
        let trw= JSON.stringify(this.image1any);
        //this.imagePath = this.image1any.toString();
        console.log("Image 1 : ", trw);
        this.allimagesanytry.push(this.image1any);
      });
    this.postsService.storeimage2(this.try[1]).subscribe(res => 
      {
        this.image2any = res;
        console.log("Image 2 : ", this.image2any);
        this.allimagesanytry.push(this.image2any);
      });
    this.postsService.storeimage3(this.try[2]).subscribe(res => 
      {
        this.image3any = res;
        console.log("Image 3 : ", this.image3any);
        this.allimagesanytry.push(this.image3any);
      }); 



      //let first = this.image1any.toString();
      
      let a = this.allimagesanytry.join();
      //let final = this.image3any.concat(a);
      console.log("tostring",a)

    }
    const file = event.target.files[0];
    //console.log("file", file);
    //console.log("=================================urls",this.urls);

    // this.allimages = this.urls.toString();
    this.form.get('image').setValue(file);
    this.allimages = this.urls.join();
    let p= Object.entries(this.try);
    for(let i=0;i<p.length;i++)
    {
      this.sendimg[i]= p[i][1];
    
    }
    console.log("this.try objects",this.sendimg);
   // console.log("=======================================  images", this.form.value.image);

    //console.log("images a: "+this.urls.join())
    //console.log("images"+ this.urls.toString())
  }

//on Save posts
  onSavePost()
  {
    console.log("DASDASDSD1");
    console.log(this.form)
    if (this.form.invalid)
    {
    console.log("DASDASDSD2");

      return;
    }
    this.isloading = true;
    if(this.mode === 'create')
    {
    console.log("DASDASDSD3");

   
    // this.postsService.storeimage1(this.try[0]).subscribe(res => 
    //   {
    //     this.image1any = res;
    //     console.log("Image 1 : ", this.image1any);
    //   });
    // this.postsService.storeimage2(this.try[1]).subscribe(res => 
    //   {
    //     this.image2any = res;
    //     console.log("Image 2 : ", this.image2any);
    //   });
    // this.postsService.storeimage3(this.try[2]).subscribe(res => 
    //   {
    //     this.image3any = res;
    //     console.log("Image 3 : ", this.image3any);
    //   }); 
    

      this.postsService.addPost(
        //basic info
        this.form.value.city,
        this.form.value.make,
        this.form.value.model,
        this.form.value.registrationcity,
        this.form.value.mileage,
        this.form.value.exteriorcolor,
        this.form.value.description,

        //price
        this.form.value.price,
        //images
        //this.form.value.image ,
        this.image1any,
        this.image2any,
        this.image3any,
        //this.sendimg,
 
        //additional information
        this.form.value.enginetype,
        this.form.value.enginecapacity,
        this.form.value.transmission,
        this.form.value.assembly,
       // this.form.value.filteredFeatures,
        this.features.toString(),
    
        this.form.value.mobilenumber
        );
       // alert(this.features);
    }
    else {
    console.log("DASDASDSD4");

      this.postsService.updatePost
        (
        this.postId,
        this.form.value.city ,
        this.form.value.make ,
        this.form.value.model ,
        this.form.value.registrationcity ,
        this.form.value.mileage ,
        this.form.value.exteriorcolor ,
        this.form.value.description ,
        this.form.value.price ,
        this.image1any,
        this.image2any,
        this.image3any,
        this.form.value.enginetype ,
        this.form.value.enginecapacity ,
        this.form.value.transmission ,
        this.form.value.assembly ,
        this.features.toString(),
        this.form.value.mobilenumber
        );
    }

    this.form.reset();

  }
//End of On Save Post

//ngOnDestroy
 ngOnDestroy()
 {
   this.authStatusSub.unsubscribe();
 }

 //end of class
}
