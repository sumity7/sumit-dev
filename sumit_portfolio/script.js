const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

// Loader
window.addEventListener('load', () => {
  const loader = $('#loader');
  const line = $('.loader-line i');
  if (window.gsap) {
    gsap.timeline().to(line,{width:'100%',duration:.75,ease:'power2.inOut'}).to('.loader-inner',{opacity:0,y:-16,duration:.35}).to(loader,{yPercent:-100,duration:.75,ease:'power4.inOut'}).set(loader,{display:'none'}).from('.hero .reveal-up',{y:45,opacity:0,stagger:.1,duration:.8,ease:'power3.out'},'-=.35');
  } else loader.style.display='none';
});

// Cursor + spotlight
const dot=$('.cursor-dot'), ring=$('.cursor-ring'), spot=$('#spotlight');
let mx=0,my=0,rx=0,ry=0;
window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;if(dot){dot.style.transform=`translate(${mx-3.5}px,${my-3.5}px)`}if(spot){spot.style.left=mx+'px';spot.style.top=my+'px'}});
function cursorLoop(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;if(ring)ring.style.transform=`translate(${rx-19}px,${ry-19}px)`;requestAnimationFrame(cursorLoop)}cursorLoop();
$$('a,button,.tilt-card').forEach(el=>{el.addEventListener('mouseenter',()=>ring?.classList.add('hover'));el.addEventListener('mouseleave',()=>ring?.classList.remove('hover'))});

// Header, progress, parallax background
const header=$('#siteHeader'), progress=$('#progress');
window.addEventListener('scroll',()=>{
  header?.classList.toggle('scrolled',scrollY>40);
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progress) progress.style.width=(max?scrollY/max*100:0)+'%';
  const y=scrollY;
  const a=$('.mesh-a'),b=$('.mesh-b'),c=$('.mesh-c');
  if(a)a.style.transform=`translate3d(0,${y*.035}px,0)`;
  if(b)b.style.transform=`translate3d(0,${-y*.025}px,0)`;
  if(c)c.style.transform=`translate3d(${Math.sin(y/800)*35}px,${-y*.015}px,0)`;
},{passive:true});

// Mobile menu
const menuBtn=$('#menuBtn'), menu=$('#mobileMenu');
menuBtn?.addEventListener('click',()=>menu.classList.toggle('open'));
$$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

// Magnetic hover
$$('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.12}px,${y*.12}px)`});
  el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)');
});

// Subtle 3D cards
$$('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{if(innerWidth<900)return;const r=card.getBoundingClientRect();const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1000px) rotateX(${py*-3}deg) rotateY(${px*4}deg) translateZ(0)`});
  card.addEventListener('mouseleave',()=>card.style.transform='perspective(1000px) rotateX(0) rotateY(0)');
});

if(window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);

  $$('.reveal-up').forEach(el=>{
    if(el.closest('.hero') || el.closest('.contact')) return;
    gsap.fromTo(el,{y:50,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
  });

  gsap.to('.hero-wordmark',{xPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to('.profile-card',{y:-45,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});

  $$('.project').forEach((section,i)=>{
    const stage=$('.project-stage',section), copy=$('.project-copy',section);
    if(innerWidth>680){
      gsap.fromTo(stage,{scale:.84,rotate:i%2?2:-2,opacity:.45},{scale:1,rotate:0,opacity:1,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'top 12%',scrub:1}});
      gsap.to(stage,{scale:.94,y:-25,opacity:.65,ease:'none',scrollTrigger:{trigger:section,start:'55% top',end:'bottom top',scrub:1}});
      gsap.fromTo(copy,{y:55,opacity:.25},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:section,start:'top 75%',end:'top 20%',scrub:1}});
    }
  });

  // Background color pulse around project sections
  $$('.project').forEach((section,i)=>{
    const colors=['rgba(139,92,246,.18)','rgba(236,72,153,.16)','rgba(124,58,237,.18)'];
    ScrollTrigger.create({trigger:section,start:'top 55%',end:'bottom 45%',onEnter:()=>document.documentElement.style.setProperty('--activeGlow',colors[i]),onEnterBack:()=>document.documentElement.style.setProperty('--activeGlow',colors[i])});
  });

  // Contact reveal: keep content visible even when entering via anchor/hash.
  gsap.set(['.contact-title','.mail-link','.contact-bottom'], {opacity:1, clearProps:'transform'});
  const contactTl = gsap.timeline({
    scrollTrigger:{trigger:'.contact',start:'top 82%',once:true}
  });
  contactTl
    .from('.contact-title',{y:70,opacity:0,duration:1,ease:'power4.out'})
    .from('.mail-link',{y:24,opacity:0,duration:.65,ease:'power3.out'},'-=.5')
    .from('.contact-bottom',{y:24,opacity:0,duration:.65,ease:'power3.out'},'-=.4');

  // Hash navigation / restored browser scroll can bypass an initial ScrollTrigger frame.
  requestAnimationFrame(()=>ScrollTrigger.refresh());
}

// Make iframe fallback disappear only when frames report load
$$('.project-stage iframe').forEach(frame=>frame.addEventListener('load',()=>{const f=frame.parentElement.querySelector('.frame-fallback');if(f)f.style.opacity='0'}));
