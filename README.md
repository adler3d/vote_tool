# vote_tool

```js
var remove_number_before_username=e=>{
  var t=e.split("_");
  return (" "+t[0]).split(" ").slice(0,-1).join(" ")+t.slice(1).join("_");
}
var f=remove_number_before_username;
return html_utf8("<pre>"+POST.data.split("\r").join("").split("\n").map(f).join("\n"));
```
