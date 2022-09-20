// importing core modules
import express, {Application, NextFunction, Request, Response} from 'express';

// importing config
import config from './config/config';


// importing third party modules
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import flash from "connect-flash"
import fileUpload from 'express-fileupload';

const csrfProtection=csurf({cookie:true});


// initializing express app
const app: Application = express();

// setting view engine and static files directory
app.set("view engine","ejs")
app.use(express.static('./public'))


// passport strategy
import strategy from "./config/passport"
strategy(passport)

// setting session and cookie parser 
app.use(cookieParser('dsf5ds5f5dsfd'));
app.use(session({
    secret:'dsf5ds5f5dsfd',
    resave:true,
    saveUninitialized:true
}));
app.use(flash())


//passport extra
app.use(passport.initialize());
app.use(passport.session());


 //global variables
 app.use(async(req:any, res:Response, next:NextFunction)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error= req.flash('error');
    res.locals.message= req.flash('message');
    res.locals.user = req.user
    res.locals.college = undefined

    if(req.user){
        if(req.user.type == '1'){

            const college:any = await Colleges.findOne({
                where:{ cu_id: req.user.cu_id },
                include:[
                    {model:College_Addresses},
                    {model:Exams}
                ]
             });

             res.locals.college = college
             next();
        }else{
            next();
        }
    }else{
        next();
    }
});


//custom csrf message
app.use(function (err:any, req:Request, res:Response, next:NextFunction) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
   
    // handle CSRF token errors here
    res.status(403)
    res.send('unauthorised access');
});


//setting body parser
app.use(express.urlencoded({limit:'10mb',extended: true }));
app.use(express.json({limit:'10mb'}));
app.use(fileUpload({
    createParentPath: true
}));


// importing controllers
import collegeLogincontroller from "./controllers/collegeLogin";
import dashboardController from "./controllers/dashboard";
import startExamController from "./controllers/startExam";
import collegeController from "./controllers/college";
import examController from "./controllers/exam";
import studentLoginController from "./controllers/studentLogin";
import homeController from "./controllers/home";
import profileController from './controllers/profile';


//importing middlewares
import isAuth from "./config/isAuth";
import notAuth from "./config/notAuth";
import isCollege from "./config/isCollege";
import isStudent from "./config/isStudent";

import bcrypt from "bcryptjs";

// Routes

//college user login
app.route( '/' )
.get(notAuth, csrfProtection, collegeLogincontroller.view)
.post(notAuth, csrfProtection, collegeLogincontroller.post)


app.route( '/register' )
.get(notAuth, csrfProtection, collegeLogincontroller.registerView)
.post(notAuth, csrfProtection, collegeLogincontroller.registerPost)

//logout
app.get('/logout',(req:any,res:Response,next:NextFunction)=>{

    req.logout(()=>{
        res.redirect('/');
    });
});

// // users redirection
// app.route( '/dashboard' )
// .get( isAuth, csrfProtection, dashboardController.view )


// // college user
// app.route( '/college' )
// .get( isCollege, csrfProtection, collegeController.view )
// .post( isCollege, csrfProtection, collegeController.post )

// //
// app.route('/college/exam/:uniqid')
// .get(isCollege, csrfProtection, examController.view)
// .post(isCollege, csrfProtection, examController.post)



// //student Login
// app.route('/exam/:examId/login')
// .get(notAuth, csrfProtection, studentLoginController.view)
// .post(notAuth, csrfProtection, studentLoginController.post)


// // student user
// app.route('/exam/:examId')
// .get( isStudent, csrfProtection, startExamController.view )
// .post( isStudent, csrfProtection, startExamController.post )

app.route('/profile')
.get( isCollege, csrfProtection, profileController.view )
.post( isCollege, csrfProtection, profileController.post )

app.route('/exams')
.get( isCollege, csrfProtection, examController.view )
.post( isCollege, csrfProtection, examController.post )
.delete( isCollege, csrfProtection, examController.del )

app.route('/exam/:uniqid/register')
.get( notAuth, csrfProtection, studentLoginController.registerView )
.post( notAuth, csrfProtection, studentLoginController.registerPost )


app.route('/exam/:uniqid/login')
.get( notAuth, csrfProtection, studentLoginController.view )
.post( notAuth, csrfProtection, studentLoginController.post )

app.route('/exam/:uniqid')
.get( isStudent, csrfProtection, startExamController.view )
.post( isStudent, csrfProtection, startExamController.post )


// starting server
const server = app.listen(config.server.port,()=> console.log("server is running"));


//generating tables
import dbInit from './database/init';
dbInit();

//initiating socket
import initiate from './config/socket';
initiate(server);





import { encrypt, decrypt } from "./config/crypto";
import Colleges from './database/models/Colleges';
import College_Addresses from './database/models/College_Addresses';
import Exams from './database/models/Exams';
import profile from './controllers/profile';import studentLogin from './controllers/studentLogin';

