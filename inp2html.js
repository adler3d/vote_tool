var pcsv2table_impl_v2=(pcsv,cb)=>{
  cb=("undefined"!==typeof cb)&&cb?cb:(str,pos,pcsv,arr,td,tag,bg,rg)=>td(escapeHtml(str));
  var tag=(t,s)=>'<'+t+'>'+s+'</'+t.split(" ")[0]+'>';var td=s=>tag('td',s);
  var bg=(r,g,b,str)=>'<td style="background-color:rgb('+r+','+g+','+b+');">'+str+'</td>';
  var wr=(c,str)=>bg(0xff,c,c,str);var wg=(c,str)=>bg(c,0xff,c,str);
  var rg=(v,str,max,base)=>{max=max?max:12.8;base=base?base:128;return (v<0?wr:wg)((Math.max(0.0,1.0-Math.abs(v)/max)*(0xff-base)+base)|0,str);}
  var h=pcsv.head;
  var head=h.map((e,id)=>cb(e,{t:'h',y:0,x:id,key:e},pcsv,h,td,tag,bg,rg)).join("");
  var out=pcsv.arr.map((arr,y)=>{
    return h.map((key,id)=>id<arr.length?cb(arr[id],{t:'b',y:y,x:id,key:key},pcsv,arr,td,tag,bg,rg):"<b>0</b>").join("");
  });
  out=out.map(e=>"<tr>"+e+"</tr>").join("");
  return tag('table',tag('thead',tag('tr',head))+tag('tbody',out));
}

var pcsv2table_v2=(pcsv,cb)=>{
  pcsv.get=(y,key)=>pcsv.arr[y][pcsv.head.indexOf(key)];
  return with_style_for_center_pre_div_table(pcsv2table_impl_v2(pcsv,cb));
}

var parse_inp_v0=(inp)=>{
  var arr=inp.split("\n").map(e=>e.trim().split("_").slice(1).join("_"));
  return arr.map((e,id)=>{var m=e.split(" ");var obj={"#":id+1,user:m[0],arr:m.slice(1)};return obj;});
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
      if(conf&&conf.avg)out.avg=qapavg(out.arr_wo_me);
      if(!conf||!conf.dbg){
        out=mapdrop(out,['arr_wo_me','arr']);
      }
      return out;
    });
  }
  pcsv.fix_influence=()=>{
    
  }
  pcsv.apply_corr=()=>{
    var tab=pcsv.gen({dbg:1,avg:1});
    var u=pcsv.head.slice(1);
    var x2corr=u.map((u,x)=>(tab.filter((e,y)=>y!=x).map(e=>e.arr[x]))).map(e=>qapavg(e));
    pcsv.arr=tab.map((u,y)=>[u.user,...u.arr.map((e,x)=>(e-(x==y?0:x2corr[x])).toFixed(2))]);
    //pcsv.x2corr=x2corr;
    return pcsv;
    //pcsv.arr=pcsv.arr.map((arr,y)=>arr.map((v,x)=>x?(pf(x)-):x));
  }
  pcsv.gen_with_corr=()=>{
    pcsv.fix_influence();//pcsv.apply_corr();
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
    var add_tot_to_end=true;
    var f=(str,pos,pcsv,arr,td,tag,bg,rg)=>{
      if(arr[0]=="#")return tag("th",tag("b",tag('center',str)));
      if(pos.key!=arr[0])if(pos.t=='b')if(pos.x)if(pos.key!="tot"){
        var max_v=5.79;var min_v=0;
        var row=qapclone(arr);
        if(add_tot_to_end)row.pop();
        var sys=arr[0].includes('==');
        if(!sys){
          min_v=pf(CL[pos.x]);max_v+=min_v;//min_v+=(max_v-min_v)*0.5;
          //row=v[pos.x-1];
          //row=[];
          //tab.map((e,y)=>e.arr_wo_me.map(e=>row.push(e)));
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
      return td(str);
    }
    var tmp={head:["#",...u,"tot"],arr:[DL,CL,HL,...pcsv.arr]};
    if(add_tot_to_end)tmp.arr=tmp.arr.map(e=>e.concat(e[0]=="#"?"#":qapsum(e.slice(1).map(e=>pf(e))).toFixed(2)));
    var b=pcsv2table_v2(tmp,f);
    tab=arrmapdrop(tab,['arr_wo_me','arr']);
    return maps2table(tab)+"\n<center>inject_rows({\ncorr:(user)=>user.sum(v=>v)/(users.length-1),\ninfluence:(user)=>user.sum(v=>abs(v-user.corr))\n})</center>"+b;
  }
  pcsv.reorder=(new_header)=>{
    pcsv.arr=pcsv.arr.map((unused,id)=>new_header.map(field=>pcsv.get(id,field)));
    pcsv.head=new_header;
    return pcsv;
  }
  pcsv.reorder_v2=(sort_cb)=>{
    var h=pcsv.head;
    var full=pcsv.gen({dbg:1});
    qapsort(full,sort_cb);
    pcsv.arr=full.map(e=>{return [e.user].concat(e.arr);});
    var u=pcsv.arr.map((e,id)=>pcsv.get(id,'user'));
    var nh=[h[0]].concat(u,h.slice(1).filter(e=>!u.includes(e)));
    pcsv.reorder(nh);
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
  var csv=conv_inp_v0_to_csv(parse_inp_v0(inp));
  var pcsv=parse_csv_with_head(csv);
  show_obj("pcsv");
  show_txt("csv");
  show_txt("csv2table(csv)");
  //
  upgrade_pcsv(pcsv);
  show_tab("pcsv.gen()");
  pcsv.reorder_v2(e=>e.tot);
  show_pcsv("pcsv");
  show_tab("pcsv.gen()");
  show_txt("pcsv.gen_with_corr()");
  dev.content.reverse();
  return tag('center',tag('pre',tag('h1',"top")+dev.content.join("")));
}

return qap_page_v1("nope",main);