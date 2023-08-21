/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */
/***
 * 从数组的原型新建一个Object.create(arrayProto)对象，通过修改此原型可以保证原生数组方法不被污染。如果当前浏览器支持__proto__这个属性的话就可以直接覆盖该属性则使数组对象具有了重写后的数组方法。如果没有该属性的浏览器，则必须通过遍历def所有需要重写的数组方法，这种方法效率较低，所以优先使用第一种。

在保证不污染不覆盖数组原生方法添加监听，主要做了两个操作，第一是通知所有注册的观察者进行响应式处理，第二是如果是添加成员的操作，需要对新成员进行observe。

但是修改了数组的原生方法以后我们还是没法像原生数组一样直接通过数组的下标或者设置length来修改数组，可以通过Vue.set以及splice方法。

 */
import { def } from "../util/index";

// 原生arr   prototype
const arrayProto = Array.prototype;

// 根据arrayProto，新建一份arrayMethods，相当于拷贝arrayProto，防止污染原生方法
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

/**
 * Intercept mutating methods and emit events
 */
/*这里重写了数组的这些方法，在保证不污染原生数组原型的情况下重写数组的这些方法，截获数组的成员发生的变化，执行原生数组操作的同时dep通知关联的所有观察者进行响应式处理*/
methodsToPatch.forEach(function (method) {
  // cache original method

  // 获取缓存原生方法function
  const original = arrayProto[method];

  /**
   * @arrayMethods 原生array api
   * @method  string方法名
   * @args method的值，例[1,2,3].push(4) , arg 即为4
   */
  def(arrayMethods, method, function mutator(...args) {
    /*调用原生的数组方法*/
    const result = original.apply(this, args);
    /*数组新插入的元素需要重新进行observe才能响应式*/
    /*这里__ob__ 是指数组Observe对象，里面有数组所对应的dep(观察者)，value等 */
    const ob = this.__ob__;

    let inserted;

    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }
    // 递归调用observeArray，对数组的每个字段开启响应式
    if (inserted) ob.observeArray(inserted);
    // notify change
    /*dep通知所有注册的观察者进行响应式处理*/
    ob.dep.notify();
    return result;
  });
});
