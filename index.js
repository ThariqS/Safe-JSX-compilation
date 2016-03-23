var reactServer = require('react-dom/server');
var React = require('react');
var ReactDOM = require('react-dom');
var localeval = require('localeval');


// testing custom react components inside pages
var Test = React.createFactory(React.createClass({
  displayName: "Test",
  render: function render() {
    return React.createElement(
      "div",
      { className: "commentForm" },
      "Hello, world! I am a CommentForm."
    );
  }
}));

// React DOM factory wrapper
// removes all functions in properties before rendering
var actionRemover = function() {
  var slicedArgs = Array.prototype.slice.call(arguments, 1);
  var props = slicedArgs[0];

  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      if (typeof props[key] === 'function') {
        props[key] = undefined;
      }
    }
  }

  return React.DOM[arguments[0]].apply(this, slicedArgs);
}

// we fail on this code: (infinite while)
// var jsxCode = "<a  onClick={function(){while(true){}}()} href='#'>Back to top{5}<Test/><span onclick='alert(5)'></span></a>";

var jsxCode = "<a  onClick={5} href='#'>Back to top{5}<Test/><span onclick='alert(5)'></span></a>";
console.log('JSX Code is: ', jsxCode);


//Renders the jsx using a modified factory so we can intercept element creation
var jsx = require('jsx-transform');
var j = jsx.fromString(jsxCode, {
  factory: 'actionRemover'
});

j = String(j).replace(/"/g, "'").trim()
console.log('Compiled Code is: ', j);

// use 'localeval' for safely evaluating compiled code
var r = localeval(j,{ actionRemover: actionRemover,Test: Test, React: React});

// render this as a string for inspection
var r2 = reactServer.renderToString(r);
console.log('Rendered String is: ', r2);


//Alternative code using a different jsx-transpiler (without support for a modified factory)
/*
var jsx = require('jsx-transpiler');
var j = jsx.compile(jsxCode);
console.log(j);
var r = reactServer.renderToString(eval(j.code));
console.log(r);
*/
