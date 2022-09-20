const activateEdit = document.getElementById('activateEdit');
const mainSlider = document.getElementById('mainSlider');

const form = document.getElementById('form');
const api = new API();


activateEdit.addEventListener('click',function(){

    mainSlider.style.transform = "translateX(-50%)";
    this.style.display = "none";

});


const culogo = document.getElementById('culogo');
var loadFile = function(event) {
    var reader = new FileReader();
    reader.onload = function(){
      compressImage(reader.result,function(dataUri){

        var output = document.getElementById('logoPreview');
        output.src = dataUri;

        api.bind({ processedImage:  dataUri.split(';base64,')[1] });

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


form.addEventListener('submit',function(e){
    e.preventDefault();

    api.url = '/profile';
    api.method = 'POST';

    api.header({ 'CSRF-Token' : document.getElementById('csrf').value });
    api.bind({ name: document.getElementById('inpname').value });
    api.bind({ regno: document.getElementById('inpregno').value });
    api.bind({ addr: document.getElementById('inpaddr').value });
    api.bind({ state: document.getElementById('inpstate').value });
    api.bind({ city: document.getElementById('inpcity').value });
    api.bind({ pin: document.getElementById('inppin').value });

    api.loaded = function(result){
        location.reload(true);
    }

    api.exec()
})