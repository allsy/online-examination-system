import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Answers from "../database/models/Answers";
import Exams from "../database/models/Exams";
import Questions from "../database/models/Questions";
import Users from "../database/models/Users";

const view = (req: any,res: Response,next: NextFunction)=>{

    const uniqid = req.params.uniqid;

    (async ()=>{
        const exam:any = await Exams.findOne({where:{ uniqid:uniqid } });
        if(!exam) return res.end('error');

        const user:any = await Users.findOne({where:{ email: req.user.email, e_id:exam.e_id } });

        if(!user){
            return res.end('error');
        }else{

        

            const questions:any = await Questions.findAll({where:{ 
                e_id:exam.e_id            
            }});

            var newques:any;
            var prep:any[] = [];
            if(questions){
                newques = questions.map((element: any)=>{

                    prep.push({q_id:element.q_id});

                    var ob={
                        q_id:element.q_id,
                        question:element.question,
                        a:element.a,
                        b:element.b,
                        c:element.c,
                        d:element.d
                    }
    
                    return ob;
    
                })
            }else{
                newques=[];
            }
            
            var ans:any = await Answers.findAll({
                where: {
                    [Op.or]: prep,
                },
              });

              if(ans){
                for(var i=0; i< newques.length; i++){
                    newques[i]['ans'] = '';

                    for(var j=0; j<ans.length; j++){
                        if(newques[i].q_id == ans[j].q_id ){
                            newques[i]['ans'] = ans[j].option
                        }
                    }
                }
              }


            return res.render('startExam',{ questions:newques, exam:exam, cuser:user });
        }
    })();

}

const post = (req: Request,res: Response,next: NextFunction)=>{

   

}


export default { view, post }