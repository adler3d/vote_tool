var parse_inp_v0=(inp,prefix)=>{
  prefix=prefix|0?prefix:"_";
  var arr=inp.split("\n").map(e=>e.trim().split(prefix).slice(1).join(prefix));
  return arr.map((e,id)=>{var m=e.split(" ");var obj={"#":id+1,user:m[0],arr:m.slice(1)};return obj;});
}
var parse_inp_v1=(inp,nick_sep)=>{
  var arr=inp.split("\n").map(e=>e.trim());
  return arr.map((e,id)=>{var t=e.split(nick_sep);var m=t.slice(1).join(nick_sep).split(" ");var obj={"#":id+1,user:t[0],arr:m};return obj;});
}

var conv_inp_v0_to_csv=(arr)=>{
  var h=arr[0].arr.map((e,id)=>id<arr.length?arr[id].user:"s"+(id+1));
  return "user,"+h.join(",")+"\n"+arr.map(e=>e.user+","+e.arr.join(",")).join("\n");
}

var only_users=e=>!'#,user,corr,tot'.split(',').includes(e);
var pf=parseFloat;
var upgrade_pcsv=(pcsv)=>{
  pcsv.gen=(conf)=>{
    var h=pcsv.head;
    return pcsv.arr.map((e,id)=>{
      var out={id:id,user:pcsv.get(id,'user')};
      out.arr=h.filter(only_users).map(v=>pf(pcsv.get(id,v)));
      out.arr.map((e,id)=>out[(id<pcsv.arr.length?'p':'s')+id]=e);
      out.arr_wo_me=out.arr.filter((e,i)=>i!=id);
      out.tot=qapsum(out.arr);
      //if(conf&&conf.avg)out.avg=qapavg(out.arr_wo_me);
      if(!conf||!conf.dbg){
        out=mapdrop(out,['arr_wo_me','arr']);
      }
      return out;
    });
  }
  pcsv.gen_v2=(conf)=>{
    var h=pcsv.head;
    return pcsv.arr.map((e,id)=>{
      var out={id:id,user:pcsv.get(id,'user')};
      out.arr=h.filter(only_users).map(v=>pf(pcsv.get(id,v)));
      out.tot=(qapsum(out.arr)/*+pf(pcsv.x2corr[id])*/).toFixed(2);
      return out;
    });
  }
  pcsv.gen_user2arr=()=>{
    var tab=pcsv.gen({dbg:1});
    var u=pcsv.head.slice(1);
    var v=u.map((u,x)=>(tab.filter((e,y)=>y!=x).map(e=>e.arr[x])));
    return v;
  }
  pcsv.gen_user2influence=()=>{
    var v=pcsv.gen_user2arr();
    return v.map(e=>{
      var corr=qapavg(e);
      return qapsum(e,e=>Math.abs(e-corr)).toFixed(2);
    });
  }
  pcsv.fix_influence=(base)=>{
    base=base|0?base:20;
    var u=pcsv.head.slice(1);
    var u2i=pcsv.gen_user2influence();
    var u2k=u2i.map((e,i)=>e|0?base/u2i[i]:0);//txt(inspect([u2i,u2k]));
    pcsv.arr.map(arr=>arr.map((e,x)=>{if(!x)return;var id=x-1;arr[x]=e*u2k[id];}));
    return pcsv;
  }
  pcsv.calc_x2corr=()=>{
    var tab=pcsv.gen({dbg:1});
    var u=pcsv.head.slice(1);
    pcsv.x2corr=u.map((u,x)=>(tab.filter((e,y)=>y!=x).map(e=>e.arr[x]))).map(e=>qapavg(e));
    pcsv.users=u;
    return pcsv;
  }
  pcsv.apply_corr=()=>{
    pcsv.calc_x2corr();
    pcsv.inject_corr();
    var tab=pcsv.gen({dbg:1});
    var u=pcsv.users;
    var x2corr=pcsv.x2corr;
    //pcsv.arr=tab.map((u,y)=>[u.user,...u.arr.map((e,x)=>(e-(x==y?0:x2corr[x])).toFixed(2))]);
    pcsv.arr=tab.map((u,y)=>[u.user,...u.arr.map((e,x)=>(e-x2corr[x]).toFixed(2))]);
    return pcsv;
  }
  pcsv.inject_corr=()=>{
    pcsv.arr=pcsv.arr.map((e,y)=>e.map((v,x)=>x&&(x-1)===y?pcsv.x2corr[x-1].toFixed(2):v));
    return pcsv;
  }
  pcsv.gen_with_corr=()=>{
    //pcsv.fix_influence(20);
    pcsv.calc_x2corr().inject_corr();
    //pcsv.apply_corr();
    var tab=pcsv.gen({dbg:1});tab.map(e=>e.tot=e.tot.toFixed(2));
    var u=pcsv.head.slice(1);
    var v=u.map((u,x)=>(tab.filter((e,y)=>y!=x).map(e=>e.arr[x])));
    var bc=s=>"<b><center>"+s+"</center></b>";
    var HR=["<b><hr></b>",...v.map(e=>"<hr>")];
    var HL=["#",...u];
    var CL=["<b>corr ==</b>",...v.map(e=>qapavg(e).toFixed(2))];
    var DL=["<b>influence ==</b>",...v.map(e=>{
      var corr=qapavg(e);
      return qapsum(e,e=>Math.abs(e-corr)).toFixed(2);
    })];
    var add_tot_to_end=true;var without_users=false;
    var f=(str,pos,pcsv,arr,td,tag,bg,rg)=>{
      var tdsys=(str,v)=>bg(v,v,v,tag('b',str));
      if(without_users)if(pos.key!="#")if(pcsv.arr.filter(e=>e[0]==pos.key).length)return "";
      if(arr[0]=="#")return tag("th",tag("b",tag('center',str)));
      if(pos.key==arr[0])return tdsys(str,230);
      if(pos.key!=arr[0])if(pos.t=='b')if(pos.x)if(pos.key!="tot"){
        var max_v=5.79;var min_v=0;
        var row=qapclone(arr);
        if(add_tot_to_end)row.pop();
        var sys=arr[0].includes('==');
        if(!sys){
          min_v=pf(CL[pos.x]);max_v+=min_v;//min_v+=(max_v-min_v)*0.5;
          //row=v[pos.x-1];
          //row=[];
          // tab.map((e,y)=>e.arr_wo_me.map(e=>row.push(e)));
        }
        if(sys)
        {
          //var row=arr[0].includes('corr')?CL:DL;
          max_v=qapmax(row.slice(1),e=>Math.abs(pf(e)));
          min_v=qapmin(row.slice(1).filter(e=>pf(e)),e=>Math.abs(pf(e)));
          if(sys)if((min_v|0)-max_v==0)min_v=0;
          //min_v+=(max_v-min_v)*0.5;
        }
        var out=pf(str);
        return rg(out-min_v,out.toFixed(2),max_v-min_v,1);
      }
      return tdsys(str,245);
    }
    var tmp={head:["#",...u,"tot"],arr:[DL,CL,HL,...pcsv.arr]};
    if(add_tot_to_end)tmp.arr=tmp.arr.map(e=>e.concat(e[0]=="#"?"tot":qapsum(e.slice(1).map(e=>pf(e))).toFixed(2)));
    var b=pcsv2table_v2(tmp,f);
    tab=arrmapdrop(tab,['arr_wo_me','arr']);
    var tabstr=maps2table(tab)+"\n";
    tabstr="";
    return tabstr+"<center>inject_rows({\ncorr:(user)=>user.sum(v=>v)/(users.length-1),\ninfluence:(user)=>user.sum(v=>abs(v-user.corr))\n})</center>"+b;
  }
  pcsv.html=()=>{var tab=pcsv.gen();tab.map(e=>e.tot=e.tot.toFixed(2));return maps2table(tab);}
  pcsv.reorder=(new_header)=>{
    pcsv.arr=pcsv.arr.map((unused,id)=>new_header.map(field=>pcsv.get(id,field)));
    pcsv.head=new_header;
    return pcsv;
  }
  pcsv.auto_reorder=()=>{
    var h=pcsv.head;
    var u=pcsv.arr.map((e,id)=>pcsv.get(id,'user'));
    var nh=[h[0],...u,...pcsv.head.slice(1).filter(e=>!u.includes(e))];
    // bullshit: if('x2corr' in pcsv)pcsv.x2corr=u.map((e,id)=>pcsv.x2corr[h.slice(1).indexOf(e)]);
    pcsv.reorder(nh);
    //pcsv.calc_x2corr();
    return pcsv;
  }
  pcsv.reorder_v2=(sort_cb)=>{
    var full=pcsv.gen({dbg:1});
    qapsort(full,sort_cb);
    pcsv.arr=full.map(e=>{return [e.user].concat(e.arr);});
    pcsv.auto_reorder();
    return pcsv;
  }
  //pcsv.
/*
    out.to_csv=()=>{
      return maps2csv(out.arr.map(e=>{return {out.arr}}));
    }*/
  return pcsv;
};

var main=(tag,dev)=>{
  var show_tab=code=>dev.add_tab("show_tab("+code+")",eval(code));
  var show_txt=code=>dev.add_txt("show_txt("+code+")",eval(code));
  var show_obj=code=>dev.add_obj("show_obj("+code+")",eval(code));
  var show_pcsv=code=>dev.add_txt("show_pcsv("+code+")",pcsv2table(eval(code)));
  var inp=POST.data;
  show_txt("inp");
  var csv=conv_inp_v0_to_csv(parse_inp_v1(inp," "));
  show_txt("csv");//show_txt("csv2table(csv)");
  var pcsv=parse_csv_with_head(csv);show_pcsv("pcsv");
  upgrade_pcsv(pcsv);
  show_txt("pcsv.calc_x2corr().inject_corr().reorder_v2(e=>e.tot).gen_with_corr()");
  show_txt("pcsv.apply_corr().reorder_v2(e=>e.tot).fix_influence().gen_with_corr()");
  //var true_order=upgrade_pcsv(parse_csv_with_head(csv));
  //show_txt("true_order.apply_corr().html()");
  //show_txt("true_order.reorder_v2(e=>e.tot).html()");
  //show_pcsv("pcsv.arr=true_order.arr.map(e=>pcsv.arr.filter(a=>a[0]==e[0])[0]);pcsv");
  //show_pcsv("pcsv.auto_reorder();pcsv;");
  //show_txt("pcsv.calc_x2corr().inject_corr().gen_with_corr()");
  dev.content.reverse();
  return tag('center',tag('pre',tag('h1',"top")+dev.content.join("")));
}
//return ""+POST.data.split("\r").join("").split("\n").map(e=>e.trim()).join("\n").split("  ").join(" 0 ").split("\r").join("").split("\n").map(e=>e.split(" ").slice(0,13).join(" ")).join("\n");
return qap_page_v1("nope",main);