const addCssRules = require('./cssParser')

const EOF = Symbol('EOF')
let curToken = null
let curAttr = null
let curTextNode = null
let stack = [{ type: 'document', children: [] }]
let rules = null

function match(selector, element) {
  if(selector[0] === '.') {
    return element.attributes.class && element.attributes.class === selector.slice(1)
  } else if(selector[0] === '#') {
    return element.attributes.id && element.attributes.id === selector.slice(1)
  } else {
    return selector === element.type
  }
}

function compareSpecificity(s1, s2) {
  for(let i=0; i<s1.length; i++) {
    if(s1[i] > s2[i]) {
      return 1
    } else if(s1[i] < s2[i]) {
      return -1
    }
  }
  return 0
}

function calSpecificity(selectorsParts) {
  let specificity = [0, 0, 0, 0] // inline, class, id, tagName，高位可以比较大小，不考虑地位
  selectorsParts.forEach(selector => {
    if (selector[0] === '.') {
      specificity[2] = specificity[2] + 1
    } else if (selector[0] === '#') {
      specificity[1] = specificity[1] + 1
    } else {
      specificity[3] = specificity[3] + 1
    }
  })
  return specificity
}

function computeCSS(element) {
  let elements = [...stack].reverse()
  console.log(elements)
  if(!element.computedStyle) {
    element.computedStyle = {}
  }

  if(rules) {
    for (let i=0; i<rules.length; i++) {
      let selectorsParts = rules[i].selectors[0].split(' ').reverse()
      if (!match(selectorsParts[0], element)) {
        continue
      }

      let isMatch = true
      for (let j = 1; j < selectorsParts.length; j++) {
        if (!match(selectorsParts[j], elements[j])) {
          isMatch = false
          break
        }
      }
      if(isMatch) {
        const sp = calSpecificity(selectorsParts)
        for (let k = 0; k < rules[i].declarations.length; k++) {
          if (!element.computedStyle[rules[i].declarations[k].property]) {
            element.computedStyle[rules[i].declarations[k].property] = {}
            element.computedStyle[rules[i].declarations[k].property].value = rules[i].declarations[k].value
            element.computedStyle[rules[i].declarations[k].property].specificity = sp
          } else {
            if (compareSpecificity(element.computedStyle[rules[i].declarations[k].property].specificity, sp) < 0) {
              element.computedStyle[rules[i].declarations[k].property].value = rules[i].declarations[k].value
              element.computedStyle[rules[i].declarations[k].property].specificity = sp
            }
          }
        }
        console.log(element.computedStyle)
      }
    }
  }
}

function emitToken(token) {
  // console.log(token)
  if(token.type === 'startTag') {

    let element = {
      type: token.tagName,
      children: [],
      attributes: token.attributes
    }

    if (stack.length) {
      let top = stack[stack.length - 1]
      if (curTextNode) {
        top.children.push(curTextNode)
        curTextNode = null
      }

      top.children.push(element)
    }
    if(!token.selfClose) {
      stack.push(element)
    }
    computeCSS(element)
  }
  if (token.type === 'endTag') {
    let top = stack[stack.length - 1]
    if (token.tagName !== top.type) {
      throw new Error(`${token.tagName} dont match ${top.tagName}`)
    } else {
      if (curTextNode) {
        top.children.push(curTextNode)
        curTextNode = null
      }
      if(top.type === 'style') {
        rules = addCssRules(top.children[0].content)
        console.log(rules)
      }

      stack.pop()
    }
  }
  if(token.type === 'text') {
    if (!curTextNode) {
      curTextNode = {
        type: 'textNode',
        content: ''
      }
    }
    curTextNode.content += token.content
  }
}

function data(c) {
  if(c === '<') {
    return tagOpen
  } else {
    emitToken({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen(c) {
  if(c === '/') {
    return endTagOpen // </
  } else if(c.match(/[a-zA-Z]/)) {
    curToken = {
      type: 'startTag',
      tagName: '',
      attributes: {}
    }
    return tagName(c)
  }
}

function endTagOpen(c) {
  if (c.match(/[a-zA-Z]/)) {
    curToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  }
}

function tagName(c) {
  if(c === ' ') {
    return beforeAttributeName
  } else if(c === '/') {
    return selfClosingStartTag
  } else if (c.match(/[a-zA-Z]/)) {
    curToken.tagName += c
    return tagName
  } else if(c === '>') {
    emitToken(curToken)
    return data
  }
}

function beforeAttributeName(c) {
  if(c === '>') {
    // emitToken(curToken)
    return data
  } else if(c === '/') {
    return selfClosingStartTag
  } else if(c === ' ') {
    return beforeAttributeName
  } else {
    curAttr = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if(c === '=') {
    return beforeAttributeValue
  } else {
    curAttr.name += c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if(c === '\"') {
    return doubleQuotedAttributeValue
  }
}

function doubleQuotedAttributeValue(c) {
  if(c === '\"') {
    if(curToken.attributes) {
      curToken.attributes[curAttr.name] = curAttr.value
    }
    return afterQuotedAttributeValue
  } else {
    curAttr.value += c
    return doubleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if(c === '/') {
    return selfClosingStartTag
  } else if(c === '>') {
    return tagName(c)
  } else if(c === ' ') {
    return beforeAttributeName
  }
}

function selfClosingStartTag(c) {
  if(c === '>') {
    curToken.selfClose = true
    return tagName(c)
  }
}

module.exports = function parseHTML(html) {
  // console.log(html)

  let state = data
  for(let c of html) {
    state = state(c)
  }
  console.log(stack)
}