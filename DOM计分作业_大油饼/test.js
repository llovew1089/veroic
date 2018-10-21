/**
 * Created by Administrator on 2018/10/22.
 */
var db = new DBComment();
var user = db.getLoginUser();
var id = +new Date;
var url = user.avatarURL;
document.getElementById('user').src = url;
db.getCommentTotal().then(function (total) {
    var total = '共' + JSON.stringify(total) + '条评论';
    var a = document.querySelector('.m-header .count ');
    a.textContent=total;
});