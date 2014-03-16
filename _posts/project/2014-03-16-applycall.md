---
layout: post
title: "javascript中的apply和call"
description: "apply(),call()简单总结"
category: "project"
tags: [js,apply,call]
---

javascript中的call 和 apply 都是为了改变某个函数运行时的 context 而存在的，即通过call或者apply用来代替另一个对象调用一个方法，将一个函数的对象上下文从初始的上下文改变为由 thisObj 指定的新对象。两个方法的基本
区别表现在传参不同。

##call和apply的语法
###call
<pre>fun.call(thisObj[, arg1[, arg2[, ...]]])</pre>

###apply
<pre>fun.call(thisObj[, arg1[, arg2[, ...]]])</pre>

*   call第一个参数传对象，可以是null。参数以逗号分开进行传值，参数可以是任何类型。
*   apply第一个参数传对象，参数可以是数组或者arguments 对象。

##作用一：类的继承
<pre>
function student(name,age){
	this.name = name;
	this.age = age;
	this.alertName = function(){
		alert(this.name);
	}
	this.alertAge() = function(){
		alert(this.age);
	}
}

function girl(name,age,relationship){
	student.call(this,name,age);
	this.relationship = relationship;

	this.alertRelationship = function(){
		alert(this.relationship);
	}
}


var test = new girl("Helen",17,"single")

test.alertName();//Helen
test.alertAge();//17
test.alertRelationship();//single
</pre>

##作用二：回调函数

很多时候，做开发我们需要回调函数执行上下文，那么这个时候call和apply变得非常重要，
来看一个例子
<pre>
var socket = 
{
    connect: function(host, port)
    {
        alert('Connecting socket server,host:' + host + ',port:' + port);
    }
};
function classIm()
{
    this.host = '192.168.1.28';
    this.port = '8080';
    this.connect = function(data)
    {
        socket.connect(this.host, this.port);
    };
}
var IM = new classIm();
$.get('index.html', IM.connect.apply(IM));//弹出Connecting socket server,host:192.168.1.28,port:8080
</pre>

如果不使用<code>IM.connect.apply(IM)</code>，而用<code>IM.connect</code>代替，那么弹出的host与port都是undefined，
那是因为回调函数的this不是指向IM对象，而我们则想要回调函数代码socket.connect(this.host, this.port)中的this指向类
classIm的实例对象IM。使用前者则在这个返回的function中使用apply把调用时对象的this替换为目标对象thisObj。


###示例二：
<pre>
function Album(id, title, owner_id) {
this.id = id;
this.name = title;
this.owner_id = owner_id;

};

Album.prototype.get_owner = function (callback) {
var self = this;
$.get('/owners/' + this.owner_id, function (data) {
callback && callback.call(self, data.name);
});
};


var album = new Album(110, 'jeason', 520);
album.get_owner(function (owner) {
alert('The album' + this.name + ' belongs to ' + owner);
});

</pre>
这里<code>alert('The album' + this.name + ' belongs to ' + owner)</code>中的<code>this.name</code>就能直接取到album对象中的name属性了
##发现
至此我们可以总结出函数的三种调用方式

*  <pre>obj.myFunc();</pre>
*  <pre>myFunc.call(obj,arg);</pre>
*  <pre>myFunc.apply(obj,[arg1,arg2..]);</pre>