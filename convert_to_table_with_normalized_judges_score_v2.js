var arr=POST.data.split("\n").map(e=>e.trim().split("_").slice(1).join("_"));
var jstable_right=arr=>{
  resp_off();
  var right=s=>s.split('<tbody>').join('<tbody align="right">');
  var center=s=>s.split('<body>').join('<center><body>');
  var f=s=>center(right(s));
  var safe_json=obj=>json(obj).split("/").join("\\/");
  var cb=data=>html(f(data).split("</body>").join("<script>document.title+='("+g_conf_info.vhost+")';draw("+safe_json(arr)+");</script></body>"));
  fs.readFile("json2table_fish.html",(err,data)=>{if(err)throw err;cb(""+data);})
  return;
};
var arrmapdrop=(arr,keys)=>arr.map(e=>mapdrop(e,keys));
var to_num=(num)=>("number"===typeof num?num:JSON.parse(num));
var mapgetdef=(m,k,def)=>((k in m)?m[k]:def);
var qapclone=obj=>JSON.parse(JSON.stringify(obj));
var with_tot=arr=>arr.map(e=>{var tot=0;var a=mapkeys(e).filter(k=>k.startsWith("_"));a.map(k=>tot+=to_num(mapgetdef(e,k,0)));e.tot=tot;return e;});

//return html_utf8("<pre>"+arr.join("\n"));
var t0=arr.map((e,id)=>{var m=e.split(" ");var obj={"#":id+1,sys:"_"+m[0],user:m[0],arr:m.slice(1)};return obj;});//return inspect(t0);
var users=t0.map(e=>e.user);
var specs={};
var id2user=id=>{var ok=id<users.length;var u="_"+(ok?users[id]:""+(id+1));specs[u]={ok:ok,u:u,id:id};return u;}
var t1=t0.map(obj=>{obj.arr.map((v,id)=>{v|0;obj[id2user(id)]=v;});return obj;});//return jstable_right(t);
t1=with_tot(t1);
var specs_ok=mapvals(specs).filter(e=>e.ok);
t1.map(e=>e.mass=qapavg(t1.filter(a=>a.user!=e.user),a=>a["_"+e.user]|0));
var t2=t1;
//var t2=qapsort(t1,e=>e.tot).map((e,id)=>{e['#']=id+1;return e;});
var su=t2.map(e=>e.user).map(u=>"_"+u).concat(mapkeys(specs).filter(k=>!specs[k].ok));
//t2=t2.map(e=>{var out={id:e.id,sys:e.sys,user:e.user};su.map(u=>out[u]=e[u]);out.tot=e.tot;return out;});

var nulls=t2.filter(a=>{var q=0;t2.map(e=>q+=(e["_"+a.user]|0));return !q;}).map(e=>"_"+e.user);//return inspect(nulls);

t3=arrmapdrop(t2,nulls.concat("sys","arr"));

//t3.map(e=>delete e['tot']);
t3.map(e=>{su.map((u,id)=>{e["_"+(specs[u].ok?"p":"s")+(id+1)]=e[u];delete e[u];});});
t3=arrmapdrop(t3,["tot"]);t3=with_tot(qapclone(t3));
t3.map(e=>e.mass=e.mass.toFixed(2));
return jstable_right(t3);
var table=t3;
var jstable_to_csv=arr=>{return mapkeys(arr[0]).join(",")+"\n"+arr.map(e=>mapvals(e).join(",")).join("\n");}
var s=jstable_to_csv(table);return html_utf8("<pre>"+s);

var arr=s.split("\n"); // <- image_parsed.csv
arr=arr.map(e=>e.split(","));
var u=arr[0];var jud=[];
var A=arr.slice(1);
var zzz=A.map((e,i)=>{var t={};var q=[];u.map((k,j)=>{t[k]=e[j];if(j>=2)q.push(e[j]*1.0);if(j>=2)getdef(jud,j-2,[]).push(JSON.parse(e[j]));});q.pop();t.q=qapavg(q);return t;});
var JV=jud.map(e=>{var t={min:qapmin(e),avg:qapavg(e),max:qapmax(e)};return t;})
var jud_func=(v,id)=>{var ex=JV[id];return (v-ex.min)/(ex.max-ex.min)*100;}
A.map((e,i)=>{var t=zzz[i];var q=[];u.map((k,j)=>{if(j>=2){var w=jud_func(e[j]*1.0,j-2);q.push(w);t[k]=w.toFixed(2);}});q.pop();t.q=qapavg(q);});
//return inspect(jud.map(e=>{var t={min:qapmin(e),avg:qapavg(e),max:qapmax(e)};return t;}));
return jstable_right(zzz);
return jstable_right(table);