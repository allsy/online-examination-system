const menuBtn = document.getElementById('lcTop');
const menu = document.getElementById('menu');
const menuArrow = document.getElementById('lcTopArrow');

var menuState = false;
if(menuBtn){

    menuBtn.addEventListener('click',function(){

        if(menuState){
            menu.style.display = "none";
            menuArrow.style.transform = "rotate(90deg)";
            menuState = false;
    
        }else{
            menu.style.display = "block";
            menuArrow.style.transform = "rotate(-90deg)";
            menuState = true;
        }
    })
}


function API(){
    this.url = undefined;
    this.method = undefined;
    const data = {};
    const headerData = {};
    var xhr = undefined;
    this.progress = undefined;
    this.loaded = undefined;
    let urlEncodedData = "",
    urlEncodedDataPairs = [],
    name;

    this.bind = function(res){
       var key= Object.keys(res);
       var val = Object.values(res);
       data[key] = val;
    };

    this.header = function(res){
        var key= Object.keys(res);
        var val = Object.values(res);
        headerData[key] = val;
     };

    if(window.XMLHttpRequest) xhr=new XMLHttpRequest();
    else if(window.ActiveXObject) xhr= new ActiveXObject("Microsoft.XMLHTTP");

    this.exec = function(){

        // Turn the data object into an array of URL-encoded key/value pairs.
    for( name in data ) {
        urlEncodedDataPairs.push( encodeURIComponent( name ) + '=' + encodeURIComponent( data[name] ) );
    }

    urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );


        xhr.upload.addEventListener("progress",e =>{
            var perc=e.lengthComputable?(e.loaded/e.total)*100:0;
            perc=perc.toFixed(2);
            if(this.progress !== undefined)
            this.progress(perc);
        });

        xhr.onreadystatechange = function(e){
            if(this.readyState === 4){
                if(this.status !== 200)
                new Msg("Error: while connecting");
            }
        }

        xhr.onload=function(e){
            if(e.target.status === 200 && this.loaded !== undefined)
            this.loaded(JSON.parse(e.target.responseText));
        };
        xhr.onload = xhr.onload.bind(this);

        xhr.open(this.method, this.url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        for( name in headerData){
            xhr.setRequestHeader(name, headerData[name]);
        }

        xhr.send(urlEncodedData);

    };
}

function Msg(message){
    const msgbox=document.createElement('div');
    var st=msgbox.style;
    st.height = "100vh";
    st.width = "100%";
    st.position = "fixed";
    st.zIndex = "100";
    st.background = "rgba(0,0,0,.3)";
    st.display = "flex";
    st.alignItems = "center";
    st.justifyContent = "center";
    st.top = "0";
    st.left = "0";

    const msg=document.createElement('div');
    st=msg.style;
    st.height = "250px";
    st.width = "300px";
    st.display = "flex";
    st.flexDirection = "column";
    st.justifyContent = "center";
    st.alignItems = "center";
    st.background = "white";

    const p=document.createElement('p');
    p.innerHTML = message;
    p.style.color = "#f20c0c";
    p.style.fontSize = "16px";
    p.style.textAlign = "center";
    p.style.padding = "0 10px";
    
    const btn=document.createElement('button');
    btn.innerHTML = "OK";
    btn.setAttribute('type','button');
    st=btn.style;
    st.height = "40px";
    st.border = "none";
    st.padding = "5px 20px";
    st.margin = "40px 0 0 0";
    st.cursor = "pointer";
    btn.onclick = function(){
        var node= this.parentNode.parentNode;
        node.parentNode.removeChild(node);
    }

    msg.append(p);
    msg.append(btn);
    msgbox.append(msg);
    document.body.append(msgbox);

}
