import { Response, NextFunction } from "express";
import Colleges from "../database/models/Colleges";
import College_Addresses from "../database/models/College_Addresses";
import fs from 'fs'
const view = (req: any,res: Response,next: NextFunction)=>{

        return res.render('profile',{
            csrfToken:req.csrfToken()
        });


}

const post = async(req: any,res: Response,next: NextFunction)=>{


  const { name, regno, addr, state, city, pin, processedImage } = req.body;

  var filename = '';
  var path = '';
  var dbPath = '';
  var prepared={};

  if(name && regno && addr && state && city && pin){

          if(processedImage){

            filename = `${res.locals.college.c_id}`;

            path = `./public/images/colleges/${filename}.jpeg`;
            dbPath = `/images/colleges/${filename}.jpeg`;

          
            fs.writeFileSync(path, processedImage, 'base64');

            prepared = { name: name, uniqid: regno, image:dbPath }

        }else{
            prepared = { name: name, uniqid: regno}
        }

    const clg = await Colleges.update(
        prepared,
        { where: { c_id: res.locals.college.c_id } }
    );

    const address = await College_Addresses.update(
        { landmark: addr, state: state, city: city, pin: pin },
        { where: { c_id: res.locals.college.c_id } }
    )

    return res.json({success:true});

  }else{
    return res.status(401).send();
  }
   

}


export default { view, post }