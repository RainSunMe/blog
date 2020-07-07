#!/usr/bin/env node
const recast = require("recast");
const TNT = recast.types.namedTypes

recast.run(function(ast, printSource) {
  recast.visit(ast, {
      visitExpressionStatement: function(path) {
        const node = path.value
        // 判断是否为ExpressionStatement，正确则输出一行字。
        printSource(node)
        if(TNT.ExpressionStatement.check(node)){
          console.log('这是一个ExpressionStatement')
        }
        this.traverse(path);
      }
    });
});