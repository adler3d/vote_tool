var f=s=>s.split(" ").slice(1).join(" ").trim();
var g=s=>{s.split(". ").slice(1).join(". ");}
var v={};var nicks={};var ug={};var vr=[];var bs="Vinchesoo,tac,Crebor,klip,Daimos,endeavour_pr".toUpperCase().split(",");
var N=21;
var out=POST.data.split("\r").join("").split("---").filter(e=>e.split("\n").length>=N).map(e=>{return {foo:e.split("\n").filter(e=>e.includes(".")).map(f).join("\n")};}).map(e=>{
  var a=e.foo.split("\n");
  e.len=a.length;
  e.user=qapclone(a).pop();if(bs.includes(e.user.toUpperCase()))return;
  vr.push(e.user.toUpperCase());
  a.map((ex,i)=>{var nick=ex.toUpperCase();getdef(ug,nick,[]).push([ex,e.user,i]);inc(getdef(nicks,nick,{}),ex);getarr(v,nick).push(N-i-1);});
  return e;
});
var fix=k=>{
  //if(!(k in nicks))txt(inspect(['fail',k,vr,vr2,nicks]));
  return qapsort(Object.entries(nicks[k]),e=>e[1])[0][0];
}
var specs=mapkeys(nicks).filter(e=>!vr.includes(e)).map(e=>e.toUpperCase());
var vr2=[...vr,...specs];
var pcsv={head:['user',...vr2.map(e=>fix(e))],arr:vr2.map(k=>[fix(k),...v[k],...specs.map(e=>0)])};
//return html(pcsv2table(pcsv));
return txt(pcsv2csv(pcsv));
return inspect(pcsv.arr);
//return jstable(out);