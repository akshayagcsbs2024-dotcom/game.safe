const questions=[
"Start strong…",
"Feeling lucky?",
"Risk now?",
"Big chance ahead",
"Careful or crazy?",
"Halfway…",
"Trap coming 👀",
"Multiplier round 🔥",
"Jackpot chance 💎",
"Final move 😈"
];

let i=0,score=0,time=5,timer;

function startGame(){
  document.getElementById("start").style.display="none";
  document.getElementById("game").style.display="block";
  next();
}

function next(){
  if(i>=questions.length){endGame();return;}

  document.getElementById("question").innerText=questions[i];
  document.getElementById("result").innerText="";

  startTimer();
}

function startTimer(){
  time=5;
  document.getElementById("timer").innerText="Time: "+time;

  timer=setInterval(()=>{
    time--;
    document.getElementById("timer").innerText="Time: "+time;

    if(time<=0){
      clearInterval(timer);
      i++;
      next();
    }
  },1000);
}

function choose(type){
  clearInterval(timer);

  let change=0;

  // 💣 TRAP ROUND
  if(i===6){
    change=-3;
    document.getElementById("result").innerText="💣 Trap! -3";
  }

  // 🎯 MULTIPLIER
  else if(i===7){
    change=(Math.floor(Math.random()*3)+1)*2;
    document.getElementById("result").innerText="🔥 x2 Round +"+change;
  }

  // 💎 JACKPOT
  else if(i===8){
    change=Math.floor(Math.random()*10)+5;
    document.getElementById("result").innerText="💎 JACKPOT +"+change;
    blast(200);
    playSound();
  }

  else{
    if(type==="safe"){
      change=Math.floor(Math.random()*2)+1;
      document.getElementById("result").innerText="Safe +"+change;
    }else{
      change=Math.floor(Math.random()*6)-2;
      document.getElementById("result").innerText="Risk "+change;
      blast(100);
      playSound();
    }
  }

  score+=change;
  i++;
  setTimeout(next,800);
}

function endGame(){
  let msg="";
  if(score>=20)msg="Legend 🔥";
  else if(score>=10)msg="Pro 😎";
  else msg="Noob 😭";

  document.getElementById("question").innerText="Game Over!";
  document.querySelector(".btns").style.display="none";
  document.getElementById("result").innerText=msg;
  document.getElementById("score").innerText="Score: "+score;
  document.getElementById("shareBtn").style.display="block";

  blast(300);
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
  const text=`I scored ${score} in PRO Risk Game 🔥 Try: ${location.href}`;
  if(navigator.share){
    navigator.share({title:"Risk PRO",text,url:location.href});
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
  for(let j=0;j<n;j++){
    p.push({
      x:c.width/2,
      y:c.height/2,
      s:Math.random()*5+2,
      vx:(Math.random()-0.5)*12,
      vy:(Math.random()-0.5)*12,
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
