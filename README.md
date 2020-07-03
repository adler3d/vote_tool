# vote_tool

img->txt:
```js
// https://cloud.google.com/vision/
t=JSON.parse(POST.data);
return (t.textAnnotations[0].description);
```
description->hw_inp:
```js
var arr=POST.data.split("\r").join("").split("\n");
if(arr.pop()!="")return "arr.last is not empty";
var u='kreagen,Incvisitor,CStalker,Neuedev,Rotmilll,ronniko,aliskda,realstudent,goodi52,Daimos,POMAH,nklbdev,PlusMinus'.split(",");
var m=[];var N=13;var empty_n=qapmax(u,e=>e.length);var prefix="";for(var i=0;i<empty_n;i++)prefix+=" ";var lpad=s=>prefix.slice(s.length)+s;
arr.map((e,i)=>getdef(m,(i%N)|0,[lpad(u[((i%N)|0)])+"|"]).push(e.split(",").join(".")));
return ""+arr.length/N+"\n"+(m.map(e=>e.join(" ")).join("\n")).split("| ").join("|");
```

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
