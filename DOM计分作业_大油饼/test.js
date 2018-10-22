/**
 * Created by Administrator on 2018/10/22.
 */
var db = new DBComment();
var user = db.getLoginUser();
var id = +new Date;
var pages=0;
//当前登录用户头像
var url = user.avatarURL;
document.getElementById('user').src = url;
//正确显示评论总数量
db.getCommentTotal(pages).then(function (total) {
    var tot = '共' + JSON.stringify(total) + '条评论';
    var count = document.querySelector('.m-header .count ');
    count.textContent=tot;
     pages=total;
    return pages;
});
var current=1;
function limit(pages, current) {
    if (current <= (parseInt(pages / 10))) {
        return 10;
    } else {
        return pages % 10
    }
}
var limit=limit(pages,current);
var opt = {
    // 当前页码
    page: current,
    // 每页显示数量
    limit: 10
};
db.getCommentList(opt).then(function(ret){
    // ret - 数组，当前页评论列表

    var li=document.createElement('li');
    li.className='m-comment f-clear';
    document.getElementById("myList").appendChild(li);

    var a=document.createElement('a');
    a.className='w-avatar';
    a.href='#';
    li.appendChild(a);
    var img=document.createElement('img');
    img.src="img/avatar4.png";
    img.alt="大油饼";
    a.appendChild(img);
    var div1=document.createElement('div');
    div1.className='reply';
    li.appendChild(div1);
    var p=document.createElement('p');
    div1.appendChild(p);
    var time=document.createElement('time');
    time.textContent="10月10日";
    p.appendChild(time);
    var p1=document.createElement('p');
    div1.appendChild(p1);
    var a1=document.createElement('a');
    a1.href='#';
    a1.textContent='删除';
    p1.appendChild(a1);
    var div2=document.createElement('div');
    div2.className='comment';
    li.appendChild(div2);
    var p2=document.createElement('p');
    p2.textContent='好听哦真死牛逼是了'; div2.appendChild(p2);
    var a2=document.createElement('a');
    a2.className='user';
    a2.href='#';
    a2.textContent='大油饼'; p2.appendChild(a2);









});

