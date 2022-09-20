import Users from "../database/models/Users";
import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import bcrypt from "bcryptjs"
import { PassportStatic } from "passport";
import College_Users from "../database/models/College_Users";
import { decrypt } from "./crypto";

export default (passport:PassportStatic)=>{

     passport.use('college-login',new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {

    
        (async ()=>{

            const user:any = await College_Users.findOne({ where: { email: email } })

            if (!user) {
                return done(null, false, { message:'emailerr' });
              } else {

               
                const match = await bcrypt.compare(password,user.password);
                    if(match){
                        return done(null,user);
                    }else{
                        return done(null, false, { message: "passerr" });
                    }

              }

        })();
    }));


    passport.use('student-login',new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {

    
        (async ()=>{

            const user:any = await Users.findOne({ where: { email: email } })

            if (user === null) {
                return done(null, false, { message:'emailerr' });
              } else {

                const match = await bcrypt.compare(password,user.password);
                    if(match){
                        return done(null,user);
                    }else{
                        return done(null, false, { message: "passerr" });
                    }

               
              }

        })();
    }));


    
    passport.serializeUser<any, any>((req, user, done) => {
        done(undefined, user);
    });
    
    passport.deserializeUser((current:any, done) => {

        if(current.type == '1'){
            (async ()=>{
                const user = await College_Users.findOne({ where: { cu_id: current.cu_id } });
                if(user === null)
                done("Error: Deserialization",user);
                else
                done(null,user);
            })();

        }
        else if(current.type == '0'){
            (async ()=>{
                const user = await Users.findOne({ where: { u_id: current.u_id } });
                if(user === null)
                done("Error: Deserialization",user);
                else
                done(null,user);
            })();

        }
    });
}

