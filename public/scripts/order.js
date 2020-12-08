var orderComplete = document.getElementsByClassName('complete');
var orderTotal = orderComplete.length;
var totalChecked = 0
const progressBar = document.getElementById('file');
var progressValue = progressBar.value;

progressBar.addEventListener('click', function(input){
    for(var i = 0; i < progressBar.max; i++){
        if(input.checked){
            console.log(progressValue)
            progressValue += 1;
        }
        else{
            progressValue += 0;
        }
    }
});