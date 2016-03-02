---
layout: post
title: "有关异步的几种设计模式"
description: "several kinds of design pattern about javascript asynchronous"
category: project
tags: [javascript,异步编程,设计模式]
---


在上一篇文章中我们了解了 JavaScript 异步事件的运作方式,也看到了随之而来的"金字塔厄运"及流程不好控制等问题.异步编程给我们带来便捷的同时,如果缺乏合理的管理也会使我们的代码变得混乱,这篇文章就来谈谈有关异步编程的几种设计模式,希望通过这些设计模式的学习对编写异步代码有更多的启发.

## 观察者模式

对于异步事件来说,往往单一的事件对应着多重的后果,如果用一个事件对应对应一个处理器的方式来做,处理器规模会显著膨胀,这显然不是一种好的方式.复杂应用程序的异步回调就如同"蝴蝶效应",亚马逊森林的蝴蝶拍一拍翅膀就引起亚洲地区的一阵台风,中间过程都是连锁的,同样一丝微小的变动就会引起整个应用状态的改变.更合理的方式不是"一对一"处理,而是分发处理,解耦嵌套.

观察者模式就是促使形成松散耦合的一种模式,它不是一个对象调用另一个对象的方法,而是一个对象订阅了另一个对象的特定活动并在状态改变后获得通知.订阅者就称之为观察者,而被观察的对象就被称为发布者,所以这种模式也叫 Pub/Sub 模式.当事件发生时,发布者会向所有的订阅者以事件对象的形式传递消息.像 Node 的 EventEmitter 和 jQuery 的自定义事件等就是用的这种模式, 通过这些工具我们就可以解嵌套式回调,减少重复冗余.

### JQuery 的 Pub/Sub

以 JQuery 的 Pub/Sub 插件为例,将设现在有两个函数 f1 和 f2, f2在f1执行完后立刻执行.那么首先我们可以先让 f2 在"信号中心"订阅 `done` 信号:

```JavaScript
 jQuery.subscribe("done", f2);
```

然后,在 f1 执行后,向"信号中心"jQuery发布"done"信号:

```JavaScript
　　function f1(){
　　　　setTimeout(function () {
　　　　　　// f1的任务代码
　　　　　　jQuery.publish("done");
　　　　}, 1000);
　　}
```

当然我们也可以取消订阅:

```JavaScript
　jQuery.unsubscribe("done", f2);
```

这种方式本质和事件监听是类似的,但是对比之下还是有优势,比如它还可以通过"消息中心"查看订阅者并进行操作,从而监控整个程序的运行.

### EventEmitter 对象
再来看看 Node.js 核心模块 Events 提供 EventEmitter 对象,它也实现了分布式事件:

```JavaScript
var Emitter = require('events').EventEmitter;
var emitter = new Emitter();

emitter.on('someEvent', function f1(msg) {
    console.log(msg + 'from f1');
});

emitter.on('someEvent', function f2(msg) {
    console.log(msg + 'from f2');
});

emitter.emit('someEvent', 'I am a message!');

// I am a message!from f1
// I am a message!from f2
```
通过 emitter 对象中 `emitter.on`  方法,就可以给 EventEmitter 对象添加一个事件处理器, `emitter.emit` 则是触发事件,它会调用指定事件的所有处理器.

## Promise

由上章节可见 Pub/Sub 模式允许应用程序把来源层的事件发布到其他层级,已经可以合理地处理异步当中的部分任务了,但是还不是万能的,尤其不适用于一次性事件, 一次性事件要求对异步函数的一次执行的两种结果(成功或失败)做不同的处理,例如 Ajax 就是一个典型的例子.那么解决一次性事件问题的工具就是Promise.

Promise 对象和 EventEmitter 对象一样,都允许向同一个事件绑定多个处理器,但是 Promise 对象最大的优势就是可以轻松从现有 Promise 对象中派生出新的 Promise 对象,这就意味着我们可以让并行任务的两个 Promise 对象合并成一个,也可以让串行任务中首任务中的 Promise 对象派生出末任务的 Promise 对象,这样后者就能知道这一系列任务是否都已经完成.

Promise 如今收到这么大关注的主要原因其实是 JQuery,2011 年JQuery作者 John Resig 以 Promise 重量级重写 `$.Ajax` 震惊了所有没用过 Promise 的开发者,非常优雅地解决了多重回调的问题.但是 JQuery 的 Promise 却和 Promise/A+ 规范有点区别,这里还是以 Promise/A+ 为例吧.Promise 有三种状态: `pending`, `fulfilled` 或 `rejected`.当它的状态改变成后两者的时候就会触发相应的回调, 并且同一个 Promise 的状态只能改变一次,如下例所示,刚 `new` 出来的 `promise` 对象的状态就是 `pending`.

```JavaScript
var promise = new Promise(function (resolve, reject) {
    console.log('begin do something');
    if (Math.random() * 10 > 5) {
        console.log(" run success");
        resolve();
    } else {
        console.log(" run failed");
        reject();

    }
});
```
我们可以调用 Promise 的 `resolve` 和 `reject` 方法来改变 Promise 的状态,并且用 `promise` 实例对象上的 `then` 方法来处理这两个状态的回调

```JavaScript
promise.then(function () {
    console.log(' resolved');
}, function () {
    console.log(' rejected');
});
```

所以执行结果就有如下两种:

```JavaScript
begin do something
 run success
 resolved
或
begin do something
 run failed
 rejected
```

其他具体的用法这里就不多介绍了,还是[API文档](https://promisesaplus.com)来得齐全,总之 Promise 可以让'意大利面条式'的回调趋于平滑(如包含过多 Ajax 调用的应用),可见 Promise 的出现弥补了异步编程中的又一短缺.

## 工作流控制

上一章节中,Promise的设计模式是将简单任务抽象成对象,通过对这些对象的合并来表示更复杂的任务.但是在 `Node.js` 中,往往我们需要执行一组 IO 操作(串行或并行),这个时候直接用前面的两种模式就比较困难了,这也是在异步编程中的另一块短板.

### 异步的数据收集
说到工作流往往我们会联想 `Async.js` 这个库,也是业界最流行的工作流控制库,就像 `loadsh` 和 `underscore` 可以大幅度简化同步代码中的迭代一样, `Async.js` 也可以消除异步代码中的嵌套.首先和 `loadsh` 相似的是,它也提供像 `forEach` 和 `filter` 等函数式方法,面向的对象是数据集,不过处理方法都是异步操作,举个简单的例子,如果我现在有100个文件地址(其中有些地址失效了)需要筛选出有效的地址,这个时候用 `Async.js` 就很方便:

```JavaScript
async.filter(['file1', 'file2', 'file3'], function(filePath, callback) {
    fs.access(filePath, function(err) {
        callback(null, !err);
    });
}, function(results) {
    // results now equals an array of the existing files
});

```

### 异步的任务组织
 上边解决的一个异步函数如何运用与一个数据的问题, 那么如果不是数据集而是函数集, 我们需要并发或者串行地执行异步操作, `Async.js` 同样提供了可以派发异步函数并收集其结果的方法,比较常用的如下,其他方法不多介绍了还是看[API文档](https://github.com/caolan/async)吧

- series: 串行执行，一个函数数组中的每个函数，每一个函数执行完成之后才能执行下一个函数。
- parallel: 并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终 callback 的数组中的数据按照 tasks 中声明的顺序，而不是执行完成的顺序。
- waterfall: 按顺序依次执行一组函数。每个函数产生的值，都将传给下一个。

如下面的例子,会依次按顺序执行异步函数:

```JavaScript
var async = require('async');
var start = new Date();
async.series([
    function(callback) {
        setTimeout(callback, 100);
    },
    function(callback) {
        setTimeout(callback, 300);
    },
    function(callback) {
        setTimeout(callback, 200);
    }
], function(err, results) {
    console.log('Completed in' + (new Date() - start) + 'ms');
});

// Completed in627ms
```

如果把他换成 `parallel`,结果则变成:

```JavaScript
async.parallel([
    function(callback) {
        setTimeout(callback, 100);
    },
    function(callback) {
        setTimeout(callback, 300);
    },
    function(callback) {
        setTimeout(callback, 200);
    }
], function(err, results) {
    console.log('Completed in' + (new Date() - start) + 'ms');
});

// Completed in319ms
```

细看上面的代码我们会发现,每个任务函数都接收了一个 `callback` 作为参数,判断一个异步函数是否执行完毕也是靠它,如果有一个任务执行的时候出现错误了,往 `callback` 函数的第一个参数扔错误信息就不会往下执行了,只有它第一个参数为空并被调用才会往下执行下一个任务函数.同时在所有的任务执行完后会有个完工事件处理器,其中的 `results` 参数是一个数组,就是上述所有任务中 `callback` 第二个参数的集合,这种设计还是非常合理的,这样既拥有了并行的性能优势,又可以统计所有任务的结果数据.

这两个函数在日常开发当中已经够用了,但对于重度用户其实还是有诸多限制的:

- 任务无法动态添加,只能是静态列表
- 任务的执行状态是一个黑盒,我们无法获取到任务内部的更新信息

`Async.js` 也提供了 `async.queue` 来解决上述问题,但由于篇幅原因本章不详细说了,下一篇结合这个专门来聊聊队列的那些事.至此,上面的几种设计模式和工具基本已经解决了异步编程中的痛点.
