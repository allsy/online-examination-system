import { Response, NextFunction } from "express";
import Colleges from "../database/models/Colleges";
import College_Addresses from "../database/models/College_Addresses";
import Exams from "../database/models/Exams";

const view = (req: any,res: Response,next: NextFunction)=>{
    
    (async()=>{
        const college:any = await Colleges.findOne({where:{ cu_id: req.user.cu_id }});
        if(college){

            const exam:any = await Exams.findAll({ where: { c_id: college.c_id} });
            const addr:any = await College_Addresses.findOne({where:{ c_id: college.c_id }});

            res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');

            return res.render('dashboard',{
                csrfToken:req.csrfToken(),
                exams:exam,
                college:college,
                addr:addr
            });

        }else{
            return res.redirect('/');
        }

    })();
}

const post = (req: any,res: Response,next: NextFunction)=>{

  
   

}


export default { view, post }