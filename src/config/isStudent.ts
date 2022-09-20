import { NextFunction, Request, Response } from "express";

function isAdmin(req:any, res:Response, next:NextFunction){

    if(req.isAuthenticated()){
        if(req.user.type == '0' ){
            res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
            next();
        }
        else{
            
            res.redirect('/notfound');
        }
    }
    else{
        var path=req.url;
        const state = path ? Buffer.from(JSON.stringify({ path })).toString('base64') : '';
        res.redirect(`/?redirect=${state}`);
    }

}

export default isAdmin;