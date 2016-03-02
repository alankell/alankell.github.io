---
layout: post
title: "理解JavaScript异步机制"
description: "Understand JavaScript asynchronous mechanisms"
category: project
tags: [javascript,异步编程]
---

本文主要谈谈异步的机制和原理,帮助更好地理解和书写异步代码,至于有关 JavaScript 异步的解决方案如 Promise , Async 等等这类只是为了辅助开发者更优雅和方便地书写异步代码,这类的文章也是遍地都是,但是归根结底,其底层原理其实是类似的.

### JavaScript 事件模型

众所周知, JavaScript 是一门单线程的语言,这意味着所有调度的事件会整整齐齐排好队有条不紊地依次执行,那么如果我们想让某段代码在将来时运行,则可以把它放在回调当中,像 `setTimeout` 就是一个典型的做这样事情的例子,先看一个简单的例子:

```JavaScript
for (var i = 1; i <= 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 0);
};
// 4
// 4
// 4
```
往往看起来简单的东西总存在一些可怕的细节,造成输出三个 4 的原因主要有:

- i的作用域扩散至蕴含循环的最内侧函数
- 循环结束后, i 一直递增到 4
- 在线程空闲之前, Javascript 事件处理器不会运行

第三点显得尤为重要,这也引出了接下来要讲的线程阻塞.

#### 线程阻塞
看下面这段代码:

```JavaScript
var start = new Date;
setTimeout(function() {
    var end = new Date;
    console.log('Time elapsed:', end - start, 'ms');
}, 500);
while (new Date - start < 1000) {};

```
在不了解 Javascript 事件模型的情况下,多数人会习惯性地以为会输出 `500ms` ,但是结果其实是:

```
Time elapsed: 1002ms
```
其原因就是 `while` 循环一直占用着线程,直到一秒钟之后才空闲下来,所以 `setTimeout` 的回调一直没有被调用,还有至于为什么会多出 `2ms` ,在于 `setTimeout` 和 `setInterval` 的精度本来就很低.

#### 队列

由上面的例子可见, `setTimeout` 并没有新起一个线程,而是在调用的时候,将一系列延时事件压入队列,然后在某个时候 Javascript 虚拟机会挑选一个适合'触发'的事件调用事件处理器,事件处理器返回后又会回到队列处等待下一个`触发`的事件.而 Javascript 代码永远不会被中断的原因就是因为其在运行期间只需要排列事件即可,这些事件触发完全事后的事情.

### 异步函数
上面简单介绍了下 Javascript 事件模型,那么什么样的才称得上是异步函数呢?我的理解是这个函数会导致将来再运行另一个函数,并且后者取自于事件队列就可以称为异步函数,通常后面这个函数是作为参数传递给前者的,像 `setTimeout` 和 `setInterval` 就是这样,不过也有些异步函数是间接取用回调的,它们会返回 Promise 对象或使用 PubSub 模式.这么一来,异步函数大致可以分为两类:异步计时函数和异步 I/O 函数.

#### 异步计时函数

 `setTimeout` 和 `setInterval` 就是两个典型的异步计时函数,因为有的时候我们只是想让它在将来的某个时刻运行.但是这两个函数却不是什么精确的计时工具,     如果使用 `setInterval` 调度事件并且延时设定为 0 ,在英特尔 i7 处理器上的 Chrome 浏览器上运行大约是 200 次/秒的频率,但是若替换成 `while` 此事件的触发频率将能达到 400 万次/秒,可见设计者本身就是想把它们设计成慢吞吞的.那如果需要高精度的计时怎么办?

IE9+ 的浏览器下带有一个 `requestAnimationFrame` 函数,这个函数可以以 60+ 帧/秒的速度运行动画,在 Chrome 浏览器下能达到亚秒级的精度。在不支持 `requestAnimationFrame` 的浏览器中,只能用 `setInterval ` 了.

#### 异步 I/O 函数

说到异步,则常常会与非阻塞联系起来,它强调了异步函数的高速度, Ryan Dahl 在创造 Node.js的目的也是为了建立一个在某高级语言之上的事件驱动型服务器框架,而不是为了人们能够在服务器上运行 JavaScript. JavaScript 的特性恰好可以完美地实现非阻塞 I/O ,例如下面这段代码将会一直运行下去:

```JavaScript
var ajaxRequest = new XMLHttpRequest;
ajaxRequest.open('GET', url);
ajaxRequest.send(null);
while (ajaxRequest.readyState === XMLHttpRequest.UNSENT) {};

```
但是,我们只需要加一个事件处理器,随即返回事件队列

```JavaScript
var ajaxRequest = new XMLHttpRequest;
ajaxRequest.open('GET', url);
ajaxRequest.send(null);
ajaxRequest.onreadystatechange = function() {};
```
就是这么简单直接便能写出高效的基于事件的代码.

### 异步的错误处理
几乎所有语言都允许抛出异常,随后用 try/catch 语句捕获,如果抛出的异常没有被捕获,大多数 JavaScript 环境都会提供一个有用的堆栈轨迹,堆栈轨迹不仅告诉了我们哪里出错了,而且也说明了出错的明确位置.可是异步代码中的堆栈轨迹却没那么容易捕获,看下面的例子:

```JavaScript
setTimeout(function A() {
    setTimeout(function B() {
        setTimeout(function C() {
            throw new Error('that is terrible!');
        }, 0);
    }, 0);
}, 0);

```
把上面这段代码放在浏览器控制台执行,会发现只有一条极短的错误轨迹

```
Uncaught Error: that is terrible!
C @ VM591:5
```
 A 和 B 发生了什么事我们完全不知道,这是因为在运行 C 的时候 A 和 B 并不在内存堆栈里,这三个函数都是在事件队列里直接运行的,即便是延时设置为 0 , `setTimeout` 依然是在异步地运行回调,因此即便是用 `try/catch` 也只能捕获到 `setTimeout` 内部的错误,如下代码只抛出了一个错:

```JavaScript
try {
    setTimeout(function() {
        throw new Error('that is terrible!');
    }, 0);
} catch (e) {
    console.error(e);
}

// Uncaught Error: that is terrible!
// (anonymous function) @ VM2721:5
```
细想会发现这个错其实是在回调中抛出的,那么是不是该是那个调用了回调的人负责捕获异常呢?正因如此,你会发现 Node.js 中的回调几乎都会接受一个错误作为首个参数,这样就允许回调自己来决定如何处理这个错误.例如一个简单的读文件:

```JavaScript
var fs = require('fs');
fs.readFile('message.txt', function (err, data) {
    if (err) throw err;
    console.log(data);
});
```

还有一种做法就是针对成功和失败各自规定一个单独的回调,也是最常见的一种模式,例如 Kissy 的 `IO` 就是这种形式的:

```
new IO({
    type: 'get',
    url: url,
    data: data,
    success: successCall,
    error: errorCall,
    dataType: 'json'
});

```

不管 API 的形态如何,始终要记住,只能在回调内部处理源于回调的异步错误.那么随之而来的问题就是,回调内部嵌套回调所带来的恶心,也就是业界所说的金字塔厄运.异步虽好,但是多层嵌套的代码显然丧失了易读性,这也是后来出现了那么多异步代码管理库的原因,之后我会单独写一篇文章讲讲有关异步的几种设计模式.
