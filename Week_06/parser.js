const EOF = Symbol('EOF')

function data(c) {
  if(c === '<') {
    return tagOpen
  } else if (c === EOF) {
    return
  } else {
    return data
  }
}

function tagOpen(c) {
  if(c === '/') {
    return endTagOpen // </
  } else if(c.match(/[a-zA-Z]/)) {
    return tagName(c)
  } else {
    // return 
  }
}

function endTagOpen(c) {
  if (c.match(/[a-zA-Z]/)) {
    return tagName
  }
}

function tagName(c) {
  if(c === ' ') {
    return beforeAttributeName
  } else if(c === '/') {
    return selfClosingStartTag
  } else if (c.match(/[a-zA-Z]/)) {
    return tagName
  } else if(c === '>') {
    return data
  } else {
    // return
  }
}

function beforeAttributeName(c) {
  if(c === '>') {
    return data
  } else if(c === '/') {
    return selfClosingStartTag
  } else {
    return beforeAttributeName
  }
}

function selfClosingStartTag(c) {
  if(c === '>') {
    return data
  }
}

module.exports = function parserHTML(html) {
  console.log(html)

  let state = data
  for(let c of html) {
    state = state(c)
    if(!state) break
  }
}