学习笔记

##### 语言按语法分类：
1.非形式语言
自然语言
2.形式语言
计算机语言

乔姆斯基谱系：
0- 型文法（无限制文法或短语结构文法）包括所有的文法。
1- 型文法（上下文相关文法）生成上下文相关语言。
2- 型文法（上下文无关文法）生成上下文无关语言。
3- 型文法（正规文法）生成正则语言。

产生式
描述方法：BNF

##### 四则运算with bracket：

<Expression> ::=
    <AdditiveExpression><EOF>

<AdditiveExpression> ::=
    <MultiplicativeExpression>
    | <AdditiveExpression><+><MultiplicativeExpression>
    | <AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression> ::=
    | <MultiplicativeExpression><*><BracketExpression>
    | <MultiplicativeExpression></><BracketExpression>

<BracketExpression> ::=
    <Number>
    | (<AdditiveExpression>)

##### 形式语言分类：
1、按用途：
数据描述语言：
xml + json + html + css + sql

编程语言：
ruby + javascript + python +
rust + erlang + golang + java + lisp + c + 
c++ + c# + assembly + pascal +
visual basic + shell

2、按表达方式：
声明式语言（展示结果）：
数据描述语言 + lisp + haskell

命令式语言（展示过程和结果）

一般命令式语言：
1. 原子级（关键字，运算符）
2. 表达式
3. 语句
4. 结构化
5. 模块

合法表示：
```javascript
123.
.123
```
```javascript
0.toString() // wrong
0. toString() // right
```

Undefined 全局变量（可以在代码中复制， void 0替代）
null关键字

{} . [] Object.defineProperty 基本对象能力
Object.create / Object.getPrototypeOf / Object.setPrototypeOf 基于原型的对象api
new / class / extends 基于类的对象api
new / function / prototype

Function 带[[call]] 方法的对象，f()会访问call，没有会报错