学习笔记

week5: 
语法树：

优先级：
产生式确定运算符优先级

最高：
member运算：
a.b
a[b]
foo`string`
super.b
super[‘b’]
new.target
new foo()

new 运算：
new Foo

reference运算：
对象的assgin和delete

call expression：
foo()
super()
foo()[’b’]
foo().b
foo()`abc`

左手表达式：
a.b = c
右手表达式:
a + b = c

不属于left hand，就是right hand（白名单）

right hand expression:
1. update express
i++

2. unary
delete a.b
void foo()
typeof a
+a
-a
!a
~a
await a

3. exponental
** (右结合运算符)

4. 
multiplicative
* / %
addtive
+ -
shift
<< >>>
relationship
< > instanceof in
equality
== !==
bitwise
& | ^
logical
&& ||
conditional
? :

类型转换：
false == ‘false’  // false
Number(undefined) // NaN
Number(null) // 0

toPremitive：
装箱：
Object转换成普通类型：
toString vs valueOf
Symbol.toPrimitive

规则：定义了Symbol.toPrimitive，优先。未定义Symbol.toPrimitive，表达式运算调用valueOf，作为属性key调用toString

Eg: 
let obj = {
1: 1,
2: 2,
3: 3
}
let o = {
toString: function () { return '1' },
valueOf: function () { return  },
[Symbol.toPrimitive]() { return 3 }
}
console.log(o + 1)
console.log(obj[o])

拆箱：
基础类型包装类

通过点运算访问，会自动调用装箱，把基础类型转换成对应的包装类