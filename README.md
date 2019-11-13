# vote_tool

```js
var remove_number_before_username=e=>{
  var t=e.split("_");
  return (" "+t[0]).split(" ").slice(0,-1).join(" ")+t.slice(1).join("_");
}
var f=remove_number_before_username;
return html_utf8("<pre>"+POST.data.split("\r").join("").split("\n").map(f).join("\n"));
```
```js
var pad=s=>"                          ".slice(s.length)+s;
return html_utf8("<pre>"+POST.data.split("\r").join("").split("\n").
map((e,i)=>{var t=e.split(",");return !i?e:pad(t[0].trim())+","+t.slice(2,t.length-2).join(",");}).
join("\n")
//.split(",").join(" ")
//split("ZERO").join("0.000").
//split("X").join("0.0")
);
```
