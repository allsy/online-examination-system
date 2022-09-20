import { NextFunction, Request, Response } from "express";

function notAuth(req:Request, res:Response, next:NextFunction){

    if(!req.isAuthenticated()){
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    }
    else{
        res.redirect('/profile');
    }

}

export default notAuth;