$(function(){
  auth();
  $('#link').css({'display':'block', 'text-align':'center'});
});

function auth(){
  var auth_ = prompt('请输入邀请码');
  if (auth_ == null){
    return false;
  } else if (auth_ != 'swidy'){
    auth();
  }
}
