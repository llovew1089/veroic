/**
 * Created by Administrator on 2018/10/22.
 */
var db = new DBComment();
var user = db.getLoginUser();
var id = +new Date;
var pages = 0;
//当前登录用户头像
var url = user.avatarURL;
document.getElementById('user').src = url;
//正确显示评论总数量
db.getCommentTotal(pages).then(function (total) {
    var tot = '共' + JSON.stringify(total) + '条评论';
    var count = document.querySelector('.m-header .count ');
    count.textContent = tot;
    pages = total;
    return pages;
});
var current = 1;
function limit(pages, current) {
    if (current <= (parseInt(pages / 10))) {
        return 10;
    } else {
        return pages % 10
    }
}

var opt = {
    // 当前页码
    page: current,
    // 每页显示数量
    limit: 10
};
db.getCommentList(opt).then(function (ret) {
    // ret - 数组，当前页评论列表
    var copy = [];
    for (var i = 0; i < ret.length; i++) {
        copy[i] = ret[i]
    }

    for (var i = 0; i < opt.limit; i++) {

        var li = document.createElement('li');
        li.className = 'm-comment f-clear';
        document.getElementById("myList").appendChild(li);

        var a = document.createElement('a');
        a.className = 'w-avatar';
        a.href = '#';
        li.appendChild(a);
        var img = document.createElement('img');
        img.src = copy[i].user.avatarURL;
        img.alt = copy[i].user.id;
        a.appendChild(img);
        var div1 = document.createElement('div');
        div1.className = 'reply';
        li.appendChild(div1);
        var p = document.createElement('p');
        div1.appendChild(p);
        var time = document.createElement('time');
        time.textContent =displayDate(copy[i].time);
        p.appendChild(time);
        var p1 = document.createElement('p');
        div1.appendChild(p1);
        var a1 = document.createElement('a');
        a1.href = '#';
        a1.textContent = '删除';
        p1.appendChild(a1);
        var div2 = document.createElement('div');
        div2.className = 'comment';
        li.appendChild(div2);
        var p2 = document.createElement('p');
        //p2.textContent = ':'+copy[i].content;
        p2.textContent = ':buydsabufa';
        div2.appendChild(p2);
        var a2 = document.createElement('a');
        a2.className = 'user';
        a2.href = '#';
        a2.textContent = copy[i].user.nickName;
        p2.appendChild(a2);
    }

    function displayDate(time) {
        var now = new Date();
        var oldDate = new Date(time);
        var oldyear = oldDate.getFullYear();
        var oldmonth = oldDate.getMonth() + 1;    //js从0开始取
        var oldday = oldDate.getDate();
        var oldhour = oldDate.getHours();
        var oldminutes = oldDate.getMinutes();
        var oldsecond = oldDate.getSeconds();
        var oldminutesText;
        oldminutesText = oldminutes < 10 ? "0" + oldminutes : oldminutes;
        var disPlayTime;
        //判断是否为今年
        if (now.getFullYear() != oldyear) {
            disPlayTime = oldyear + "-" + oldmonth + "-" + oldday + " " + oldhour + ":" + oldminutesText;
            return disPlayTime;
        }
        //判断是否为今日
        else if ((now.getFullYear() == oldyear)&&(now.getDate() != oldday)) {
            disPlayTime =oldmonth + "月" + oldday + "日";
            return disPlayTime;
        }
        else {
            //判断小时是否一致
            if (now.getHours() != oldhour) {
                disPlayTime = oldhour + ":" + oldminutesText;
            }
            else {
                //判断分钟是否一致
                if (now.getMinutes() != oldminutes) {
                    disPlayTime = Math.abs(oldminutes - now.getMinutes()) + " 分前";
                }
                else {
                    disPlayTime = Math.abs(oldsecond - now.getSeconds()) + " 秒前";
                }
            }
        }
        return disPlayTime;
    }
});
//显示评论字节数
String.prototype.len = function() {
    var len = 0;
    for (var i=0; i<this.length; i++) {
        if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {
            len += 2;
        } else {
            len ++;
        }
    }
    return len;
};
window.onload = function () {
    function textCount(text) {
        var a= text.value;
        var len =a.len();
        return len;
    }
    var el = document.getElementById('text');
    el.addEventListener('input', function () {
        var len = textCount(this); //   调用函数
        document.getElementById('count').innerHTML = len;
    });
};

document.getElementById("myBtn").addEventListener("click", function(){
  var len=document.getElementById('count').innerHTML;
    if (len===0){alert("评论不能为空")}
    else  if(len>=140){alert("超过字数限制")}

});








