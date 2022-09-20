const createExam = document.getElementById('createExam');
const createFirst = document.getElementById('createnew');
const createExamPanel = document.getElementById('newExam');
const hideExamPanel = document.getElementById('cancelcreation');

const examname = document.getElementById('examname');
const examdate = document.getElementById('examdate');
const examtime = document.getElementById('examtime');

const regenddate = document.getElementById('regenddate');
const regendtime = document.getElementById('regendtime');

const examduration = document.getElementById('examduration');
const file = document.getElementById('examquestions');
var processedImage='';

const examEdit = document.getElementsByClassName('examEdit');
const examDelete = document.getElementsByClassName('examDelete');

const e_id = document.getElementById('e_id');



function showExamCreator(){
    createExamPanel.style.display = "flex";
}
function hideExamCreator(){
    createExamPanel.style.display = "none";
}



// showing and hiding create exam panel
createExam.addEventListener('click',showExamCreator);
if(createFirst)
createFirst.addEventListener('click',showExamCreator);
hideExamPanel.addEventListener('click',hideExamCreator);

const culogo = document.getElementById('culogo');
var loadFile = function(event) {
    var reader = new FileReader();
    reader.onload = function(){
      compressImage(reader.result,function(dataUri){

        var output = document.getElementById('logoPreview');
        output.src = dataUri;

        processedImage = dataUri.split(';base64,')[1];

      })
      
    };
    reader.readAsDataURL(event.target.files[0]);

}

culogo.addEventListener('change',loadFile);


function compressImage(dataUri,func){

    var image=new Image();
    image.src=dataUri;
    image.onload = function () {
        var height = this.height;
        var width = this.width;
        var newwidth=0;
        var newheight=0;
        var aspect=0;
        if(width>height){
            aspect=width/height;
            newheight=500;
            newwidth=newheight*aspect;
        }else if(height>width){
            aspect=height/width;
            newwidth=500;
            newheight=newwidth*aspect;                   
        }else{
            newwidth=newheight=500;
        }
        
        
        var canvas=document.createElement('canvas');
        var ctx=canvas.getContext("2d");
        canvas.width=newwidth;
        canvas.height=newheight;
        var offx=0,offy=0;
        // if(newwidth != 500){
        //     offx=(500-newwidth)/2;
        // }
        // if(newheight != 500){
        //     offy=(500-newheight)/2;
        // }
        ctx.drawImage(image, offx, offy, newwidth, newheight);
        var ctod=canvas.toDataURL('image/jpeg',0.9);

        return func(ctod);

}
}

create.addEventListener('click',function(){

    if(processedImage == '/images/question.jpeg' || !processedImage){
        new Msg("Logo is Required!");
    }
    else if(!examname.value){
        new Msg("Exam Name cannot be empty!");
    }
    else if(!examdate.value){
        new Msg("Exam Date cannot be empty!");
    }
    else if(!examtime.value){
        new Msg("Exam Time cannot be empty!");
    }
    else if(!examduration.value){
        new Msg("Exam Duration cannot be empty!");

    }
    else if(!regenddate.value){
        new Msg("Registration End Date cannot be empty!");

    }else if(!regendtime.value){
        new Msg("Registration End Time cannot be empty!");
    }
    else if(!e_id.value && file.files.length < 1){
        new Msg("Please Select an Excel file containing questions");
    }
    else{

        const examstart = (new Date(`${examdate.value} ${examtime.value}`)).getTime();
        const rend = (new Date(`${regenddate.value} ${regendtime.value}`)).getTime();

        if(examstart - rend < (1 * 60 * 60 * 1000 )){
            new Msg("Registration end time must be at least 1 hour before the exam starting time");
        }
        else{

             var xhr;
            if(window.XMLHttpRequest){
                xhr=new XMLHttpRequest();
             }else if(window.ActiveXObject){
                xhr= new ActiveXObject("Microsoft.XMLHTTP");
             }

             const data=new FormData();
             data.append('logo',processedImage);
             data.append('name',examname.value);
             data.append('examdate',examdate.value);
             data.append('examtime',examtime.value);
             data.append('examduration',examduration.value);

             data.append('regenddate',regenddate.value);
             data.append('regendtime',regendtime.value);

             if(file.files.length > 0)
             data.append('questionfile',file.files[0],'questions.xlsx');

             data.append('e_id',e_id.value);

            //   //fetching form upload progress
            //   xhr.upload.addEventListener("progress",e =>{
            //     var perc=e.lengthComputable?(e.loaded/e.total)*100:0;
            //     perc=perc.toFixed(2);
            //     loader.load(perc);
            //    });
            

            //action on completion of form submission
             xhr.onload=function(){
                 
                location.reload(true);
        
             };


             xhr.open("POST","/exams");
             xhr.setRequestHeader('CSRF-Token', document.getElementById('_csrf').value );
             xhr.send(data);


        }
       

    }
});


(function(){

    const prep = getHtmlDate()
  
    examdate.setAttribute('min',prep);
    regenddate.setAttribute('min',prep);

})();

function getHtmlDate(mydate=Date.now()){
 
    const date = new Date(mydate);


    const yy=date.getFullYear();
    const mm=(date.getMonth()+1).toString().length == 1 ? '0'+(date.getMonth()+1) : (date.getMonth()+1);
    const dd=date.getDate().toString().length == 1 ? '0'+date.getDate() : date.getDate();

    const prep = yy+'-'+mm+'-'+dd;

    return prep;
}

function getHtmlTime(mydate=Date.now()){
 
    const date = new Date(`01/01/01 ${mydate}`);


    const yy=date.getHours().toString().length == 1 ? '0'+date.getHours() : date.getHours();
    const mm=date.getMinutes().toString().length == 1 ? '0'+date.getMinutes() : date.getMinutes();
    const dd=date.getSeconds().toString().length == 1 ? '0'+date.getSeconds() : date.getSeconds();

    const prep = yy+':'+mm+':'+dd;

    return prep;
}

for(var i=0; i< examEdit.length; i++){
    examEdit[i].addEventListener('click',function(){
        const cnt = this.parentNode.parentNode.parentNode;
        
        const name = cnt.getElementsByClassName('name')[0].value;
        const image = cnt.getElementsByClassName('image')[0].value;
        var starting = cnt.getElementsByClassName('starting')[0].value;
        var regend = cnt.getElementsByClassName('regend')[0].value;
        const uniqid = cnt.getElementsByClassName('uniqid')[0].value;
        const duration = cnt.getElementsByClassName('duration')[0].value;

        starting = new Date(starting).toLocaleString();
        regend = new Date(regend).toLocaleString();

        startingDate = starting.split(', ')[0];
        startingDate = getHtmlDate(startingDate);
        startingTime = starting.split(', ')[1];
        startingTime = getHtmlTime(startingTime);


        reDate = regend.split(', ')[0];
        reDate = getHtmlDate(reDate);
        reTime = regend.split(', ')[1];
        reTime = getHtmlTime(reTime);

        showExamCreator();
        examname.value = name;
        examdate.value = startingDate;
        examtime.value = startingTime;
        regenddate.value = reDate;
        regendtime.value = reTime;
        examduration.value = duration;
        processedImage = image;
        e_id.value = uniqid;

        var output = document.getElementById('logoPreview');
        output.src = image;

        
    });

    examDelete[i].addEventListener('click',function(){

        const cnt = this.parentNode.parentNode.parentNode;

        const id = cnt.getAttribute('id');

        const api = new API();
        api.method = 'delete';
        api.url = '/exams';

        api.bind({uniqid:id});
        api.header({ 'CSRF-Token' : document.getElementById('_csrf').value });

        api.loaded = function(){

            location.reload(true);

        }

        api.exec();
        

    });
}
