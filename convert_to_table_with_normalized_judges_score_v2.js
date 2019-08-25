var arr=POST.data.split("\n").map(e=>e.trim().split("_").slice(1).join("_"));

var to_num=(num)=>("number"===typeof num?num:JSON.parse(num));

var with_tot=arr=>arr.map(e=>{var tot=0;var a=mapkeys(e).filter(k=>k.startsWith("_"));a.map(k=>tot+=to_num(mapgetdef(e,k,0)));e.tot=tot;return e;});
var get_nulls=arr=>arr.filter(a=>{var q=0;t2.map(e=>q+=(e["_"+a.user]|0));return !q;}).map(e=>"_"+e.user);
var drop_nulls=(users,nulls)=>arrmapdrop(users,nulls);
var get_ordered_nicks=(users,specs)=>users.map(e=>e.user).map(u=>"_"+u).concat(mapkeys(specs).filter(k=>!specs[k].ok));
var get_sorted_users_table=(users,specs)=>{
  //var users=qapsort(users,e=>e.tot).map((e,id)=>{e['#']=id+1;return e;});
  var nicks=get_ordered_nicks(users,specs);
  users.map(e=>{nicks.map((u,id)=>{e["_"+(specs[u].ok?"p":"s")+(id+1)]=e[u];delete e[u];});});
  return with_tot(qapclone(users));
}
var make_top=users=>qapsort(users,e=>e.tot).map((e,id)=>{e['#']=id+1;return e;});

var content=[];
var gen_msg_header=name=>{
  var arrow='<h1><font size="+20">&uarr;</font></h1>';
  var header='<h2><small>.</small>.<b>.</b>---=( '+name+' )=---<b>.</b>.<small>.</small></h2>';
  return arrow+header;
};
var add=(name,html)=>content.push(gen_msg_header(name)+'<pre>'+html+'</pre>');
var add_table=(name,table)=>add(name,maps2table(table));
var add_table_v2=(name,s)=>add(name,"<table><tr><td><pre>"+s+"</pre></td></tr></table>");
//return html_utf8("<pre>"+arr.join("\n"));
add_table_v2("inp",POST.data);
var t0=arr.map((e,id)=>{var m=e.split(" ");var obj={"#":id+1,user:m[0],arr:m.slice(1)};return obj;});
add_table("t0",t0);
var users=t0.map(e=>e.user);
var specs={};
var id2user=id=>{var ok=id<users.length;var u="_"+(ok?users[id]:""+(id+1));specs[u]={ok:ok,u:u,id:id};return u;}
var t1=t0.map(obj=>{obj.arr.map((v,id)=>{v|0;obj[id2user(id)]=v;});return obj;});
t1=with_tot(t1);
t1=arrmapdrop(t1,["arr"]);
add_table("t1",t1);
var specs_ok=mapvals(specs).filter(e=>e.ok);
t1.map(e=>e._corr=qapavg(t1.filter(a=>a.user!=e.user),a=>a["_"+e.user]|0));
var t2=t1;
var t3=qapclone(drop_nulls(t2,get_nulls(t2).concat("arr")));
add_table("t3",t3);
var t3=make_top(t3,specs);
add_table("t3.top",t3);
var t3=arrmapdrop(t3,["tot"]);
add_table("t3.without_tot",t3);
var t4=get_sorted_users_table(t3,specs);
t4.map(e=>e._corr=e._corr.toFixed(2));
t4.map(e=>e.tot=e.tot.toFixed(2));
add_table_v2("t4",maps2table(t4).split("<td>_p").join("<td>"));
//return jstable_right(t3);
var table=t4;
var jstable_to_csv=arr=>{return mapkeys(arr[0]).join(",")+"\n"+arr.map(e=>mapvals(e).join(",")).join("\n");}
var s=jstable_to_csv(table);add_table_v2("csv",s);//return html_utf8("<pre>"+s);

var arr=s.split("\n"); // <- image_parsed.csv
arr=arr.map(e=>e.split(","));
var u=arr[0];var jud=[];
var A=arr.slice(1);
var zzz=A.map((e,i)=>{var t={};var q=[];u.map((k,j)=>{t[k]=e[j];if(j>=2)q.push(e[j]*1.0);if(j>=2)getdef(jud,j-2,[]).push(JSON.parse(e[j]));});q.pop();t.qarr=q.join(",");t.q=qapavg(q);return t;});
add_table("zzz",zzz);var zzz=arrmapdrop(zzz,["qarr"]);
var JV=jud.map(e=>{var t={min:qapmin(e),avg:qapavg(e),max:qapmax(e)};return t;})
var jud_func=(v,id)=>{var ex=JV[id];return (v-ex.min)/(ex.max-ex.min)*100;}
A.map((e,i)=>{var t=zzz[i];var q=[];u.map((k,j)=>{if(j>=2){var w=jud_func(e[j]*1.0,j-2);q.push(w);t[k]=w.toFixed(2);}});q.pop();t.q=qapavg(q);});
//return inspect(jud.map(e=>{var t={min:qapmin(e),avg:qapavg(e),max:qapmax(e)};return t;}));
//return jstable_right(zzz);
//add_table("jud",jud.map(e=>{var t={min:qapmin(e),avg:qapavg(e),max:qapmax(e)};mapkeys(t).map(k=>t[k]=t[k].toFixed(2));return t;}));
//add_table("zzz",zzz);
add_table("zzz",(zzz));
//add_table("table",table);
content.reverse();
return qap_page_v0("",(tag)=>tag('center',tag('pre',tag('h1',"top")+content.join(""))));