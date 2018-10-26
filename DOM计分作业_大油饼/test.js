/**
 * Created by Administrator on 2018/10/22.
 */
var db = new DBComment();
var user = db.getLoginUser();
var id = +new Date;

var current = 8;
//当前登录用户头像
var lim = 10;
var url = user.avatarURL;
document.getElementById('user').src = url;
//正确显示评论总数量
db.getCommentTotal(lim).then(function (total) {
    var tot = JSON.stringify(total);
    var count = document.getElementById("total");
    count.textContent = tot;
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
var prv = document.querySelector('.m-pager .prv');
var nxt = document.querySelector('.m-pager .nxt');
var left = document.getElementById('left');
var right = document.getElementById('right');
var pages = document.querySelectorAll('.m-pager .itm');
for (var i = 0; i < pages.length; i++) {
    pages[i].onclick = function () {
        current = parseInt(this.innerText);
        updatePager(current);
        opt.page = current;
        return showCommentList();
    };
}
prv.onclick = function () {
    current -= 1;
    updatePager(current);
    opt.page = current;
    return showCommentList();
};
nxt.onclick = function () {
    current += 1;
    updatePager(current);
    opt.page = current;
    return showCommentList();
};
function updatePager(num) {
    var total=parseInt(document.getElementById('total').textContent);
    var page=Math.ceil(total/10);
    var pager = new Pager(page, num);
    var data = pager.data;
    var list = data.pageList;
    var pages = document.querySelectorAll('.m-pager .itm a');
    if (data.prevDisabled) {
        prv.classList.add('j-disabled');
        prv.onclick = ''
    } else {
        prv.classList.remove('j-disabled');
        prv.onclick = function () {
            current -= 1;
            updatePager(current);
            opt.page = current;
            return showCommentList();
        };
    }
    if (data.nextDisabled) {
        nxt.classList.add('j-disabled');
        nxt.onclick = ''
    } else {
        nxt.classList.remove('j-disabled');
        nxt.onclick = function () {
            current += 1;
            updatePager(current);
            opt.page = current;
            return showCommentList();
        };
    }
    ////显示页码并设置页码高亮
    for (var i = 0; i < list.length; i++) {
        pages[i].innerText = list[i].number;
        if (list[i].selected) {
            pages[i].classList.add('j-selected')
        } else {
            pages[i].classList.remove('j-selected')
        }
    }

    //设置省略号

    left.style.display = data.sepLeftShow ? 'inline-block' : 'none';
    right.style.display = data.sepRightShow ? 'inline-block' : 'none'
}
class Pager{
    constructor(pages, current = 1) {
        this.pages = pages;
        this.current = current;
        this.data = {
            prevDisabled: false,
            nextDisabled: false,
            sepLeftShow: false,
            sepRightShow: false,
            pageList: []
        };
        this.compute();
    }

    compute() {
        var page = this.pages;
        var curr = this.current;
        function prevDisabled(current) {
            return (current == 1);
        }
        this.data.prevDisabled = prevDisabled(curr);
//            判断当前页为首页时，禁用上一页按钮
        function nextDisabled(pages, current) {
            return !(current < pages);
        }
        this.data.nextDisabled = nextDisabled(page, curr);
//            判断当前页等于最后一页时，禁用下一页按钮
        function sepLeftShow(current) {
            return (current > 3);
        }
        this.data.sepLeftShow = sepLeftShow(curr);
//            当前页大于3，则显示左省略号
        function sepRightShow(pages,current) {
            return (current < pages - 2);
        }
        this.data.sepRightShow = sepRightShow(page, curr);
//            当前页小于总页数-2时，显示右边省略号
        function pageList(pages, current) {
            var a = [];
            if (pages == 1) {
                a = [{number: 1, selected: true}];
            }
            else if (pages == 2) {
                a = [{number: 1, selected: false}, {number: 2, selected: false}];
            }
            else if (pages == 3) {
                a = [{number: 1, selected: false}, {number: 2, selected: false}, {number: 3, selected: false}];
            }
            else if (pages == 4) {

                a = [{number: 1, selected: false}, {number: 2, selected: false}, {
                    number: 3,
                    selected: false
                }, {number: 4, selected: false}];
            }
            else {
                a = [{number: 1, selected: false}, {number: (current - 1), selected: false}, {
                    number: current,
                    selected: false
                }, {number: current + 1, selected: false}, {number: pages, selected: false}];
            }

//              根据总页数给pageList赋值一个数组，并将所有select置为false
            for (var i = 0; i < a.length; i++) {
                if (a[i].number == current) {
                    a[i].selected = true;
                }
            }
            return a;
//                根据当前页判断，置当前页的select为true
        }
        this.data.pageList = pageList(page, curr);
    }
}

var opt = {
    // 当前页码
    page: current,
    // 每页显示数量
    limit: lim
};
showCommentList();
function showCommentList() {
    db.getCommentList(opt).then(function (ret) {
        document.getElementById("myList").innerHTML = "";
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
            img.src =this.user.avatarURL;
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
                        var tot = JSON.stringify(total);
                        var count = document.getElementById("total");
                        count.textContent = tot;
                        var lim = limit(pages, current);
                        return lim;
                    });
                });
                this.parentNode.parentNode.parentNode.remove();
                //this.preventDefault();
            }
        }

    });
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
                var tot = JSON.stringify(total);
                var count = document.getElementById("total");
                count.textContent = tot;
                var lim = limit(pages, current);
                return lim;
            });
            var dele = document.querySelectorAll('.reply a');
            for (var i = 0; i < dele.length; i++) {
                dele[i].onclick = function () {
                    var id = this.parentNode.parentNode.parentNode.firstElementChild.firstElementChild.alt;
                    db.removeComment(id).then(function (ret) {
                        db.getCommentTotal(lim).then(function (total) {
                            var tot = JSON.stringify(total);
                            var count = document.getElementById("total");
                            count.textContent = tot;
                            var lim = limit(pages, current);
                            return lim;
                        });
                    });
                    this.parentNode.parentNode.parentNode.remove();
                    //this.preventDefault();
                }
            }
        });
    }
});