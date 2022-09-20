import { Request, Response, NextFunction } from "express";
import reader from "xlsx";
import Exams from "../database/models/Exams";
import Questions from "../database/models/Questions";
import fs from "fs";
import { htmlDate, htmlTime } from "../loc_modules/dateTime";

const view = (req: any,res: Response,next: NextFunction)=>{

    (async()=>{
        const exam:any = await Exams.findAll({ where: { c_id: res.locals.college.c_id } });

            return res.render('exam',{
                csrfToken:req.csrfToken(),
                exam:exam
            });

    })();
    
    
}

const post = async(req: any,res: Response,next: NextFunction)=>{


    const college = res.locals.college;
    const { logo, name, examdate, examtime, examduration, regenddate, regendtime, e_id } = req.body;
    var file = req.files;

    const allowedFiles = ['xlsx'];

    // checking for emptiness of all fields
    if(!logo || !name || !examdate || !examtime || !examduration || !regenddate || !regendtime ){
        return res.status(500).send()
    }


    if(!e_id){
        // create

        if(!file ){
            return res.status(500).send()
        }
        // Checking for question file
        if(typeof file != 'object'){
            return res.status(500).send()
        }
        else{
            if(!file['questionfile']){
                return res.status(500).send()
            }
        }

    }
    else{

        // update
        if(file != null){

            if(typeof file != 'object'){
                return res.status(500).send()
            }
            else{
                if(!file['questionfile']){
                    return res.status(500).send()
                }
            }

        }

    }

    // Checking if regestration end dateTime is 1 hour less than exam dateTime
    const examstart = (new Date(`${examdate} ${examtime}`)).getTime();
    const regend = (new Date(`${regenddate} ${regendtime}`)).getTime();
    if(examstart - regend < (1 * 60 * 60 * 1000 )){
        return res.status(500).send()
    }

    // checking if Exam starting Date is not smalleer than current Date
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var nowmili = new Date(date).getTime();
    var exammili = new Date(examdate).getTime();

    if(exammili < nowmili){
        return res.status(500).send()
    }


    //uploading exam logo

    const uniqid = (new Date(Date.now())).getTime() + Math.random();

    if(!e_id){
        // checking for valid file Extention
        const filename = file.questionfile.name.split('.');
        const ext = filename[filename.length - 1].toLowerCase();
        if(allowedFiles.indexOf(ext) == -1){
            return res.status(500).send()
        }
        const tempPath =`./temp/${uniqid}.${ext}`;

        excelHandler(tempPath,async function(data:any){


            const logopath = `./public/images/exams/${uniqid}.jpeg`;
            var logodbPath = `/images/exams/${uniqid}.jpeg`;
            
            if(logo.substr(0,13) != '/images/exams'){
                fs.writeFileSync(logopath, logo, 'base64');
            }
            else{
                logodbPath = logo;
            }


            const exam:any = await Exams.create({
                uniqid:uniqid,
                name:name,
                image:logodbPath,
                starting:`${examdate} ${examtime}`,
                duration: examduration,
                regstart:`${htmlDate()} ${htmlTime()}`,
                regend: `${regenddate} ${regendtime}`,
                c_id:college.c_id
        
            });

              //   converting json to database friendly columns
              const newdata = data.map((element:any)=>{

                const ob = {
                    question : element.QUESTION ? element.QUESTION.toString().trim() : "",
                    a:element.A ? element.A.toString().trim(): "",
                    b:element.B ? element.B.toString().trim(): "",
                    c:element.C ? element.C.toString().trim(): "",
                    d:element.D ? element.D.toString().trim(): "",
                    answer:element.ANSWER ? element.ANSWER.toString().toLowerCase().trim(): "",
                    marks:element.MARKS ? element.MARKS.toString().trim(): "",
                    e_id:exam.e_id
                }

                return ob;

            });

                const ques:any = await Questions.bulkCreate(newdata);

                // removing temp file
                fs.unlinkSync(tempPath);

                res.json({success:true});
            


        });
    }
    else{
         // update

         const ee:any = await Exams.findOne({where:{uniqid:e_id}});

        if(!ee)
        return res.status(500).send();

        if( file != null){

            // checking for valid file Extention
            const filename = file.questionfile.name.split('.');
            const ext = filename[filename.length - 1].toLowerCase();
            if(allowedFiles.indexOf(ext) == -1){
                return res.status(500).send()
            }

            const tempPath =`./temp/${e_id}.${ext}`;
            excelHandler(tempPath,async function(data:any){

                const logopath = `./public/images/exams/${uniqid}.jpeg`;
                var logodbPath = `/images/exams/${uniqid}.jpeg`;
                
                if(logo.substr(0,13) != '/images/exams'){
                    fs.writeFileSync(logopath, logo, 'base64');
                }
                else{
                    logodbPath = logo;
                }


                const exam:any = await Exams.update({
                    name:name,
                    image:logodbPath,
                    starting:`${examdate} ${examtime}`,
                    duration: examduration,
                    regstart:`${htmlDate()} ${htmlTime()}`,
                    regend: `${regenddate} ${regendtime}`,

                },
                {
                    where:{uniqid:e_id}
                });


                //   converting json to database friendly columns
              const newdata = data.map((element:any)=>{

                const ob = {
                    question : element.QUESTION ? element.QUESTION.toString().trim() : "",
                    a:element.A ? element.A.toString().trim(): "",
                    b:element.B ? element.B.toString().trim(): "",
                    c:element.C ? element.C.toString().trim(): "",
                    d:element.D ? element.D.toString().trim(): "",
                    answer:element.ANSWER ? element.ANSWER.toString().toLowerCase().trim(): "",
                    marks:element.MARKS ? element.MARKS.toString().trim(): "",
                    e_id:ee.e_id
                }

                return ob;

            });

                await Questions.destroy({where:{e_id:ee.e_id}});

                const ques:any = await Questions.bulkCreate(newdata);

                // removing temp file
                fs.unlinkSync(tempPath);

                res.json({success:true});





            });

        }
        else{

            // update without file
            const logopath = `./public/images/exams/${uniqid}.jpeg`;
                var logodbPath = `/images/exams/${uniqid}.jpeg`;
                
                if(logo.substr(0,13) != '/images/exams'){
                    fs.writeFileSync(logopath, logo, 'base64');
                }
                else{
                    logodbPath = logo;
                }


                const exam:any = await Exams.update({
                    name:name,
                    image:logodbPath,
                    starting:`${examdate} ${examtime}`,
                    duration: examduration,
                    regstart:`${htmlDate()} ${htmlTime()}`,
                    regend: `${regenddate} ${regendtime}`
                },
                {
                    where:{uniqid:e_id}
                });

                res.json({success:true});
        }

    }

function excelHandler(tempPath:string,func:any){

    file.questionfile.mv(tempPath,async(err:Error)=>{
        if(err)
        return res.status(500).send(err);


                // initiating excel file reader
                const file=reader.readFile(tempPath);
                const sheet=file.SheetNames;

                const data:any[]=[];
                sheet.forEach(element => {

                    const tmp = reader.utils.sheet_to_json(file.Sheets[element]);
                    tmp.forEach(result => {
                        data.push(result);
                    });
                    
                });


                // Excel file error handler
                if(data.length < 1)
                return res.status(500).send();

                var allowdKeys=['QUESTION','A','B','C','D','ANSWER','MARKS']

                var keys=Object.keys(data[0]);

                if(keys.length != 7)
                return res.status(500).send();

                keys.forEach(element => {
                    if(allowdKeys.indexOf(element) == -1){

                        // removing temp file
                        fs.unlinkSync(tempPath);
                        return res.status(500).send();
                    }
                });


                return func(data);



    });

}

}


const del = async(req: any,res: Response,next: NextFunction)=>{

    const { uniqid } = req.body;

    console.log(uniqid);

    const ex:any = await Exams.destroy({where:{uniqid: uniqid}});

    res.json({success:true});


}

export default { view, post, del }