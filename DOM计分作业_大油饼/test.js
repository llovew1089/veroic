/**
 * Created by Administrator on 2018/10/22.
 */
var db = new DBComment();
var user = db.getLoginUser();
var id = +new Date;
//当前登录用户头像
var url = user.avatarURL;
document.getElementById('user').src = url;
//正确显示评论总数量
db.getCommentTotal().then(function (total) {
    var total = '共' + JSON.stringify(total) + '条评论';
    var a = document.querySelector('.m-header .count ');
    a.textContent=total;
});
