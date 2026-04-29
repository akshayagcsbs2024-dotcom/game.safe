const pool=["Apple","Car","Dog","Phone","Book","Pizza","Chair","Watch","Pen","Bottle","Bag","Mouse","Keyboard"];

let score=0, round=0, items=[], timer;

function startGame(){
  document.getElementById("start").style.display="none";
  document.getElementById("game").style.display="block";
  nextRound();
}

function nextRound(){
  round++;
  if(round>5){endGame();return;}

  document.getElementById("result").innerText="";
  document.getElementById("options").innerHTML="";

  let count = round<=2 ? 5 : round<=4 ? 7 : 9;

  document.getElementById("level").innerText="Level "+round+" ("+count+" items)";

  items = pool.sort(()=>0.5-Math.random()).slice(0,count);

  showItems(count);
}

function showItems(count){
  const box=document.getElementById("items");
  box.innerHTML="";

  items.forEach(it=>{
    box.innerHTML+=`<div class="item">${it}</div>`;
  });

  startTimer(4);
}

function startTimer(t){
  document.getElementById("timer").innerText="Memorize: "+t;
  timer=setInterval(()=>{
    t--;
    document.getElementById("timer").innerText="Memorize: "+t;

    if(t<=0){
      clearInterval(timer);
      hideItems();
    }
  },1000);
}

function hideItems(){
  document.getElementById("items").innerHTML="❓ ❓ ❓ ❓ ❓";

  let correct = items[Math.floor(Math.random()*items.length)];

  let opts=[correct];

  while(opts.length<4){
    let r=pool[Math.floor(Math.random()*pool.length)];
    if(!opts.includes(r)) opts.push(r);
  }

  opts.sort(()=>0.5-Math.random());

  opts.forEach(o=>{
    document.getElementById("options").innerHTML+=
      `<button onclick="check('${o}','${correct}')">${o}</button>`;
  });
}

function check(c,ans){
  if(c===ans){
    score++;
    document.getElementById("result").innerText="Correct 🧠";
    blast(80);
    playSound();
  }else{
    document.getElementById("result").innerText="Wrong 😂 ("+ans+")";
  }

  setTimeout(nextRound,1000);
}

function endGame(){
  let msg="";
  if(score>=4)msg="Memory Master 🧠🔥";
  else if(score>=2)msg="Average 😎";
  else msg="Forgetful 😂";

  document.getElementById("items").innerHTML="";
  document.getElementById("options").innerHTML="";
  document.getElementById("level").innerText="Game Over!";
  document.getElementById("result").innerText=msg;
  document.getElementById("score").innerText="Score: "+score+"/5";
  document.getElementById("shareBtn").style.display="block";

  blast(200);
  playSound();
}

/* SOUND */
function playSound(){
  const s=document.getElementById("boom");
  s.currentTime=0;
  s.play();
}

/* SHARE */
function shareScore(){
  const text=`I scored ${score}/5 in Memory PRO 🧠🔥 Try: ${location.href}`;
  if(navigator.share){
    navigator.share({title:"Memory PRO",text,url:location.href});
  }else{
    navigator.clipboard.writeText(text);
    alert("Copied 😎");
  }
}

/* PARTICLES */
const c=document.getElementById("canvas");
const ctx=c.getContext("2d");
c.width=innerWidth;
c.height=innerHeight;

let p=[];

function blast(n){
  for(let i=0;i<n;i++){
    p.push({
      x:c.width/2,
      y:c.height/2,
      s:Math.random()*5+2,
      vx:(Math.random()-0.5)*10,
      vy:(Math.random()-0.5)*10,
      col:`hsl(${Math.random()*360},100%,50%)`
    });
  }
}

function anim(){
  ctx.clearRect(0,0,c.width,c.height);
  p.forEach((e,k)=>{
    e.x+=e.vx;
    e.y+=e.vy;
    e.s*=0.96;

    ctx.beginPath();
    ctx.arc(e.x,e.y,e.s,0,6.28);
    ctx.fillStyle=e.col;
    ctx.fill();

    if(e.s<0.5)p.splice(k,1);
  });
  requestAnimationFrame(anim);
}
anim();
