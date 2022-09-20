const activateEdit = document.getElementById('activateEdit');
const closeEdit = document.getElementById('closeEdit');
const collegeView = document.getElementById('collegeView');
const collegeEdit = document.getElementById('collegeEdit');


activateEdit.addEventListener('click',function(){

    collegeView.style.display = "none";
    collegeEdit.style.display = "block";

});

closeEdit.addEventListener('click',function(){

    collegeView.style.display = "block";
    collegeEdit.style.display = "none";

});
