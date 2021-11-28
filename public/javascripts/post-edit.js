let postEditForm=document.getElementById('postEditForm');
postEditForm.addEventListener('submit',function(event){
let imageUpload=document.getElementById('imageUpload').files.length;
let existingImgs=document.querySelectorAll('.imageDeleteCheckbox').length;
let imgDeletions=document.querySelectorAll('.imageDeleteCheckbox:checked').length;

let newTotal=existingImgs-imgDeletions+imageUpload;
if(newTotal>4){
    event.preventDefault();
    let removalAmt=newTotal-4;
    alert(`You need to remove atleast ${removalAmt} more image${removalAmt===1?'':'s'}`);
}
});