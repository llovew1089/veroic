/**
 * Created by Administrator on 2018/10/26.
 */
/**
 * Created by Administrator on 2018/10/22.
 */
var db = new DBComment();
var user = db.getLoginUser();
var id = +new Date;

var current = 1;
//当前登录用户头像
var lim = 10;
var url = user.avatarURL;
document.getElementById('user').src = url;
//正确显示评论总数量
db.getCommentTotal(lim).then(function (total) {
    var tot = '共' + JSON.stringify(total) + '条评论';
    var count = document.querySelector('.m-header .count ');
    count.textContent = tot;
    pages = total;
    var lim = limit(pages, current);
    return lim;
});

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
    limit: lim
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
        img.alt = copy[i].id;
        a.appendChild(img);
        var div1 = document.createElement('div');
        div1.className = 'reply';
        li.appendChild(div1);
        var p = document.createElement('p');
        div1.appendChild(p);
        var time = document.createElement('time');
        time.textContent = displayDate(copy[i].time);
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
        p2.innerHTML = '<a class="user" href="#">' + copy[i].user.nickName + '</a>:' + copy[i].content + '</p>';
        div2.appendChild(p2);
    }
    document.querySelectorAll('.reply a')[0].onclick = function () {
        alert('11')
    };
    var dele = document.querySelectorAll('.reply a');
    for (var i = 0; i < dele.length; i++) {
        dele[i].onclick = function () {
            var id = this.parentNode.parentNode.parentNode.firstElementChild.firstElementChild.alt;
            db.removeComment(id).then(function (ret) {
                db.getCommentTotal(lim).then(function (total) {
                    var tot = '共' + JSON.stringify(total) + '条评论';
                    var count = document.querySelector('.m-header .count ');
                    count.textContent = tot;
                    pages = total;
                    var lim = limit(pages, current);
                    return lim;
                });
            });
            this.parentNode.parentNode.parentNode.remove();
            this.preventDefault();
        }
    }

});
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
    else if ((now.getFullYear() == oldyear) && (now.getDate() != oldday)) {
        disPlayTime = oldmonth + "月" + oldday + "日";
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
//显示评论字节数
String.prototype.len = function () {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
};
window.onload = function () {
    function textCount(text) {
        var a = text.value;
        var len = a.len();
        return len;
    }

    var el = document.getElementById('text');
    el.addEventListener('input', function () {
        var len = textCount(this); //   调用函数
        document.getElementById('count').innerHTML = len;
    });
};

document.getElementById("myBtn").addEventListener("click", function () {
    var len = document.getElementById('count').innerHTML;
    if (parseInt(len) === 0) {
        alert("评论不能为空")
    }
    else if (parseInt(len) >= 140) {
        alert("超过字数限制")
    }
    else {
        var text = document.getElementById('text').value;
        var data = {
            // 评论内容
            content: text
        };
        db.addComment(data).then(function (ret) {
            // ret - 对象，添加的评论项数据
            var li = document.createElement('li');
            li.className = 'm-comment f-clear';
            document.getElementById("myList").insertBefore(li, document.getElementById("myList").firstElementChild);

            var a = document.createElement('a');
            a.className = 'w-avatar';
            a.href = '#';
            li.appendChild(a);
            var img = document.createElement('img');
            img.src = ret.user.avatarURL;
            img.alt = ret.id;
            a.appendChild(img);
            var div1 = document.createElement('div');
            div1.className = 'reply';
            li.appendChild(div1);
            var p = document.createElement('p');
            div1.appendChild(p);
            var time = document.createElement('time');
            time.textContent = displayDate(ret.time);
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
            p2.innerHTML = '<a class="user" href="#">' + ret.user.nickName + '</a>:' + ret.content + '</p>';
            div2.appendChild(p2);

            db.getCommentTotal(lim).then(function (total) {
                var tot = '共' + JSON.stringify(total) + '条评论';
                var count = document.querySelector('.m-header .count ');
                count.textContent = tot;
                pages = total;
                var lim = limit(pages, current);
                return lim;
            });
            var dele = document.querySelectorAll('.reply a');
            for (var i = 0; i < dele.length; i++) {
                dele[i].onclick = function () {
                    var id = dele[i].parentNode.parentNode.parentNode.firstElementChild.firstElementChild.alt;
                    db.removeComment(id).then(function (ret) {
                        db.getCommentTotal(lim).then(function (total) {
                            var tot = '共' + JSON.stringify(total) + '条评论';
                            var count = document.querySelector('.m-header .count ');
                            count.textContent = tot;
                            pages = total;
                            var lim = limit(pages, current);
                            return lim;
                        });
                    });


                    this.parentNode.parentNode.parentNode.remove();
                    this.preventDefault();
                }
            }
        });
    }
});