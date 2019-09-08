# vote_tool

<h4> скрипт "убрать номер перед именем ползователя":</h4>
```js
var f=e=>{
  var t=e.split("_");
  return (" "+t[0]).split(" ").slice(0,-1).join(" ")+t.slice(1).join(" ");
}
return html_utf8("<pre>"+POST.data.split("\r").join("").split("\n").map(f).join("\n"));
```
