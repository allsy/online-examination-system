import { Server } from "socket.io";
import Answers from "../database/models/Answers";
import Attendance from "../database/models/Attendance";
import Exams from "../database/models/Exams";
import Users from "../database/models/Users";


function initiate(server:any){
    const io = new Server(server,{

    });
    
    io.use((socket, next) => {
        (async ()=>{
            const token = socket.handshake.auth;
    
            const exam:any = await Exams.findOne({ where:{ uniqid:token.examId} });
            if(exam){
                const user:any = await Users.findOne({ where:{ uuid:token.uid, e_id:exam.e_id } });
                if(user){
    
                    next();
                    socket.join(token.uid);
                }else{
                    next(new Error('Unauthorized Access'));
                }
            }else{
                next(new Error('Unauthorized Access'));
            }
    
        })();
      });
    
    io.on('connection',(socket)=>{
    
        socket.on('marked',function(qid,uid,eid,val){

            (async ()=>{

                const exam:any = await Exams.findOne({where:{uniqid:eid}});
                const user:any = await Users.findOne({where:{uuid:uid, e_id: exam.e_id }});

                if(exam){

                    const starting = exam.starting;
                    const st = Date.parse(starting);
                    const nt = Date.now();
                    const duration = exam.duration;
                    
                    if(nt - st > (duration * 60 * 1000)){

                        io.sockets.in(uid).emit('examended');
                        return;
                    }else{


                    if(user){

                        const ans:any = await Answers.findOne({where:{ q_id:qid, u_id:user.u_id, e_id:exam.e_id }});
                        if(ans){
                            await Answers.update({option:val},{where:{ u_id:user.u_id, q_id:qid, e_id:exam.e_id }});
                        }else{

                            await Answers.create({
                                q_id:qid,
                                u_id:user.u_id,
                                option:val
                            })
                        }
                    }

                    }

                }

            })();
          
        });

        socket.on('submit',async function(uuid,examid,details){

            const user:any = await Users.findOne({where:{uuid:uuid}})
            const exam:any = await Exams.findOne({where:{uniqid:examid}});
            const atten:any = await Attendance.findOne({where:{e_id:exam.e_id, u_id:user.u_id}});

            if(!atten.endedAt){

                const att:any = await Attendance.update(
                    {
                        endedAt:Date.now(),
                    },
                    {where:{ u_id:user.u_id, e_id:exam.e_id }}
                )  
            }
            io.sockets.in(uuid).emit('submitted');
            
        });

        socket.on('startrequest',function(uuid,examid){

            (async ()=>{
                const user:any = await Users.findOne({where:{uuid:uuid}})
                const exam:any = await Exams.findOne({where:{uniqid:examid}});
                const att:any = await Attendance.findOne({where:{e_id:exam.e_id, u_id:user.u_id}});

                if(!att){
                    await Attendance.create({
                        u_id:user.u_id,
                        e_id:exam.e_id,
                        startingAt:Date.now(),
                    });
                }else{

                    if(att.endedAt){
                        io.sockets.in(uuid).emit('examended');
                        return;
                    }
                }


                if(exam){
                    const starting = exam.starting;
                    const st = Date.parse(starting);
                    const nt = Date.now();
                    if(nt - st > 0){

                        io.sockets.in(uuid).emit('start');
                    }
                    else{
                        io.sockets.in(uuid).emit('notstarted');
                    }
                }

            })();

        });
    
        socket.on('compatible',function(){
    
            
          
        });
    
    });
}

export default initiate