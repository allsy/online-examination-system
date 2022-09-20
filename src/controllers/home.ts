import { Request, Response, NextFunction } from "express";
import reader from "xlsx";
import Exams from "../database/models/Exams";

const view = (req: any,res: Response,next: NextFunction)=>{

    return res.render('home');
}

const post = (req: any,res: Response,next: NextFunction)=>{

  
   

}


export default { view, post }