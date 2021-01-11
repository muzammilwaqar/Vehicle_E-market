export interface Post
{

  //id
  id: string;
  //car inormation
  city:string;
  make:string;
  model:string;
  registrationcity:string;
  mileage:string;
  exteriorcolor: string;
  description: string;

  //price
  price: string;

  //images
  imagePath: string;

  //additional information
  enginetype:string;
  enginecapacity:string;
  transmission:string;
  assembly:string;
  features:string;

  //contact information
  mobilenumber:string;


  creator: string;
}
