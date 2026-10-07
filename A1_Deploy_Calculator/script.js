(function(){
  var cur="0", prev=null, op=null, fresh=false, error=false;
  var sym={"+":"+","-":"\u2212","*":"\u00d7","/":"\u00f7"};
  var valueEl=document.getElementById("value"), histEl=document.getElementById("hist");

  function fmt(n){
    if(!isFinite(n)) return null;
    var s=String(parseFloat(n.toPrecision(12)));
    return s;
  }
  function compute(a,b,o){
    a=parseFloat(a); b=parseFloat(b);
    if(o==="+") return a+b;
    if(o==="-") return a-b;
    if(o==="*") return a*b;
    if(o==="/") return b===0?NaN:a/b;
  }
  function setError(msg){
    error=true; cur="0"; prev=null; op=null;
    valueEl.textContent=msg; histEl.textContent="Press C to start over";
    valueEl.style.fontSize="26px";
  }
  function render(){
    if(error) return;
    valueEl.style.fontSize = cur.length>11 ? "28px" : cur.length>8 ? "36px" : "44px";
    valueEl.textContent=cur;
    histEl.textContent = op ? prev+" "+sym[op] : "";
    document.querySelectorAll("button.op").forEach(function(b){
      b.classList.toggle("active", b.dataset.k===op && fresh);
    });
  }
  function digit(d){
    if(fresh){ cur="0"; fresh=false; }
    if(d==="." ){ if(cur.indexOf(".")>-1) return; cur+="."; }
    else if(cur==="0") cur=d;
    else if(cur.replace(/[-.]/g,"").length<12) cur+=d;
  }
  function operate(o){
    if(op && !fresh){
      var r=compute(prev,cur,op);
      if(r!==r || !isFinite(r)){ setError("Can\u2019t divide by 0"); return; }
      cur=fmt(r);
    }
    prev=cur; op=o; fresh=true;
  }
  function equals(){
    if(!op || fresh) return;
    var r=compute(prev,cur,op);
    if(r!==r || !isFinite(r)){ setError("Can\u2019t divide by 0"); return; }
    histEl.textContent=prev+" "+sym[op]+" "+cur+" =";
    cur=fmt(r); prev=null; op=null; fresh=true;
    valueEl.style.fontSize = cur.length>11 ? "28px" : cur.length>8 ? "36px" : "44px";
    valueEl.textContent=cur;
  }
  function press(k){
    if(error){ if(k!=="C") return; error=false; valueEl.style.fontSize=""; cur="0"; fresh=false; render(); return; }
    if(k==="C"){ cur="0"; prev=null; op=null; fresh=false; }
    else if(k==="Backspace"){ if(!fresh){ cur=cur.length>1?cur.slice(0,-1):"0"; } }
    else if(/^[0-9.]$/.test(k)) digit(k);
    else if(k==="+"||k==="-"||k==="*"||k==="/") operate(k);
    else if(k==="="||k==="Enter"){ equals(); return; }
    render();
  }
  document.querySelector(".keys").addEventListener("click",function(e){
    var b=e.target.closest("button"); if(b) press(b.dataset.k);
  });
  document.addEventListener("keydown",function(e){
    var k=e.key;
    if(k==="Escape") k="C";
    if(/^[0-9.+\-*\/]$/.test(k)||k==="Enter"||k==="="||k==="Backspace"||k==="C"){
      if(k==="Enter"||k==="/"||k==="Backspace") e.preventDefault();
      press(k);
    }
  });
  render();
})();
