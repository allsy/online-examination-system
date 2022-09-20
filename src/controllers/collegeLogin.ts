import { Request, Response, NextFunction } from "express";
import passport from "passport"
import College_Users from "../database/models/College_Users";
import { encrypt, decrypt } from "../config/crypto";
import Colleges from "../database/models/Colleges";
import College_Addresses from "../database/models/College_Addresses";
import bcrypt from 'bcryptjs'

const view = (req: Request,res: Response,next: NextFunction)=>{

    const rdr=req.query.redirect;

    res.render('login',{csrfToken:req.csrfToken(),rdr:rdr })
}

const registerView = (req: Request,res: Response,next: NextFunction)=>{

    const rdr=req.query.redirect;

    res.render('register',{csrfToken:req.csrfToken(),rdr:rdr })
}

const post = (req: Request,res: Response,next: NextFunction)=>{


    var rdr:string = req.body.rdr;
    var success:string = "";

    if(rdr != undefined && rdr != ""){
        success=JSON.parse(Buffer.from(rdr, 'base64').toString()).path;
    }else{
        success='/profile';
    }

    passport.authenticate('college-login',{
      successRedirect: success,
      failureRedirect: `/?redirect=${rdr}`,
      failureFlash: true
    })(req,res,next);

}

const registerPost = async(req: any,res: Response,next: NextFunction)=>{

        const {email, password, cpassword } = req.body;



        if(email && password && cpassword){

            const user:any = await College_Users.findOne({where:{email:email}});
            if(user){
                req.flash('error', 'exist');
                res.redirect('/register');
            }else if(password != cpassword){
                req.flash('error', 'matcherr');
                res.redirect('/register');
            }else{

                try {
                    // Generate a salt
                    const salt = await bcrypt.genSalt(10);
            
                    // Hash password
                    const hash = await bcrypt.hash(password, salt);


                    const u:any = await College_Users.create({
                        email:email,
                        password: hash,
                        type:'1'
                    })
    
                    const c:any = await Colleges.create({
                        cu_id:u.cu_id
                    })
    
                    const addr:any = await College_Addresses.create({
                        c_id:c.c_id
                    })
    
                    req.login(u, function (err:any) {
                        if(err) throw err;
    
                        res.redirect('/profile');
                    });


                } catch (error) {
                    console.log(error);
                }

            }


        }else{
            req.flash('error', 'Missing credentials');
            res.redirect('/register');
        }

}

export default { view, post, registerView, registerPost }