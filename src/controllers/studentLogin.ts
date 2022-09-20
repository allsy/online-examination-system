import { Request, Response, NextFunction } from "express";
import passport from "passport"
import Exams from "../database/models/Exams";
import Users from "../database/models/Users";
import bcrypt from 'bcryptjs'

const view = (req: Request,res: Response,next: NextFunction)=>{

    const uniqid = req.params.uniqid;

    const rdr=req.query.redirect;

    (async()=>{
        const exam:any = await Exams.findOne({ where: { uniqid: uniqid} });
        const strt = (new Date(exam.starting)).getTime();
        const nw = (new Date(Date.now())).getTime();
        const diff = strt - nw;


        var visible = false

        console.log(Math.floor(diff/60000))
        if(Math.floor(diff/60000) < 10)
        visible = true;

        if(exam){
            return res.render('studentLogin',{csrfToken:req.csrfToken(),rdr:rdr,exam:exam,visible:visible})
        }else{
            return res.redirect('/');
        }

    })();
}

const post = (req: any,res: Response,next: NextFunction)=>{

   const uniqid = req.params.uniqid;

   var rdr:string = req.body.rdr;
   var success:string = "";

   if(rdr != undefined && rdr != ""){
       success=JSON.parse(Buffer.from(rdr, 'base64').toString()).path;
   }else{
       success=`/exam/${uniqid}`;
   }

   passport.authenticate('student-login',{
     successRedirect: success,
     failureRedirect: `/exam/${uniqid}/login?redirect=${rdr}`,
     failureFlash: true
   })(req,res,next);

}


const registerView = (req: any,res: Response,next: NextFunction)=>{

    const uniqid = req.params.uniqid;

    const rdr=req.query.redirect;

    (async()=>{
        const exam:any = await Exams.findOne({ where: { uniqid: uniqid} });
        const diff = (new Date(exam.regend).getTime()) - (new Date(Date.now()).getTime())

        var visible = false

        if(diff > 0)
        visible = true;

        if(exam){
            return res.render('studentRegister',{csrfToken:req.csrfToken(),exam:exam, rdr:rdr,visible:visible})
        }else{
            return res.redirect('/');
        }

    })();

}

const registerPost = async(req: any,res: Response,next: NextFunction)=>{

    const {name, email, password, cpassword } = req.body;

    const uniqid = req.params.uniqid;

    const exam:any = await Exams.findOne({ where: { uniqid: uniqid} });

    const diff = (new Date(exam.regend).getTime()) - (new Date(Date.now()).getTime())


    if(exam){

        if(diff > 0){


        if(name && email && password && cpassword){

            const user:any = await Users.findOne({where:{email:email, e_id:exam.e_id }});
            if(user){
                req.flash('error', 'exist');
                res.redirect(`/exam/${uniqid}/register`);
            }else if(password != cpassword){
                req.flash('error', 'matcherr');
                res.redirect(`/exam/${uniqid}/register`);
            }else{
    
                try {
                    // Generate a salt
                    const salt = await bcrypt.genSalt(10);
            
                    // Hash password
                    const hash = await bcrypt.hash(password, salt);
    
    
                    const u:any = await Users.create({
                        name:name,
                        email:email,
                        password: hash,
                        type:'0',
                        e_id:exam.e_id
                    });

    
                    req.flash('success_msg', 'Registration completed');
                    res.redirect(`/exam/${uniqid}/register`);
    
    
                } catch (error) {
                    console.log(error);
                }
    
            }
    
    
        }else{
            req.flash('error', 'Missing credentials');
            res.redirect(`/exam/${uniqid}/register`);
        }


    }

}
    
}

export default { view, post, registerView, registerPost }