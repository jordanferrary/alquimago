// Preserved original Alquimago Orb 2D. Restored from the previously shipped
// public 0.9 bundle. All faces and animations stay local and dependency-free.
export const ROBOT_STYLES=`
/* Alquimago Orb 2D: stateful SVG face animation, no image sheets or network. */
.character:has(.alquimago-orb){width:154px!important;height:168px!important;padding:0!important;animation:levitate 4.2s ease-in-out infinite!important;filter:drop-shadow(0 6px 11px #110729ad)!important}
.character:has(.alquimago-orb):hover{filter:drop-shadow(0 0 10px #ab72ef8a) drop-shadow(0 7px 11px #0b0523a0)!important}
.character .alquimago-orb{width:154px!important;height:168px!important;overflow:visible;display:block}
.character .orb-expression{opacity:0;transition:opacity .18s ease}
.character .orb-expression-idle{opacity:1}
.character[data-expression]:not([data-expression="idle"]) .orb-expression-idle{opacity:0}
.character[data-expression="idle"] .orb-expression-idle,
.character[data-expression="breath"] .orb-expression-breath,
.character[data-expression="serene"] .orb-expression-serene,
.character[data-expression="blink"] .orb-expression-blink,
.character[data-expression="happy"] .orb-expression-happy,
.character[data-expression="excited"] .orb-expression-excited,
.character[data-expression="laugh"] .orb-expression-laugh,
.character[data-expression="curious"] .orb-expression-curious,
.character[data-expression="focused"] .orb-expression-focused,
.character[data-expression="thinking"] .orb-expression-thinking,
.character[data-expression="surprised"] .orb-expression-surprised,
.character[data-expression="confused"] .orb-expression-confused,
.character[data-expression="sad"] .orb-expression-sad,
.character[data-expression="worried"] .orb-expression-worried,
.character[data-expression="angry"] .orb-expression-angry,
.character[data-expression="tired"] .orb-expression-tired,
.character[data-expression="yawn"] .orb-expression-yawn,
.character[data-expression="sleep"] .orb-expression-sleep,
.character[data-expression="pet"] .orb-expression-pet,
.character[data-expression="love"] .orb-expression-love,
.character[data-expression="shy"] .orb-expression-shy,
.character[data-expression="proud"] .orb-expression-proud,
.character[data-expression="talk"] .orb-expression-talk,
.character[data-expression="lookleft"] .orb-expression-lookleft,
.character[data-expression="lookright"] .orb-expression-lookright,
.character[data-expression="lookup"] .orb-expression-lookup,
.character[data-expression="lookdown"] .orb-expression-lookdown{opacity:1}
.character .orb-robot{transform-box:fill-box;transform-origin:center;animation:orb-breath var(--orb-breath-duration,4s) ease-in-out infinite}
.character .orb-headset-left,.character .orb-headset-right{transform-box:fill-box;transform-origin:center}
.character .orb-eye-glow{filter:drop-shadow(0 0 2px #83faffaf)}
.character .orb-crest{transform-box:fill-box;transform-origin:center;animation:orb-twinkle 3s ease-in-out infinite}
.character .orb-status-light{animation:orb-neon 3.8s ease-in-out infinite}
.character .orb-audio-bars{animation:orb-neon 1.6s ease-in-out infinite}
.character .orb-twinkle{animation:orb-twinkle 4s ease-in-out infinite}
.character .orb-orbit{transform-box:fill-box;transform-origin:center;animation:orb-orbit-shimmer 8s ease-in-out infinite}
.character .orb-shadow{animation:orb-shadow-soft 4.2s ease-in-out infinite}
.character .orb-shadow-ring{animation:orb-neon 4.2s ease-in-out infinite}
.character[data-expression="idle"] .orb-expression-idle .orb-eyes,
.character[data-expression="curious"] .orb-expression-curious .orb-eyes{transform-box:fill-box;transform-origin:center;animation:orb-auto-blink 5.1s infinite}
.character[data-expression="talk"] .orb-talk-mouth{transform-box:fill-box;transform-origin:center;animation:orb-talk .3s ease-in-out infinite alternate}
.character[data-expression="laugh"] .orb-robot,
.character[data-expression="excited"] .orb-robot{animation:orb-bounce 1s ease-in-out infinite}
.character[data-expression="surprised"] .orb-robot{animation:orb-startle .55s ease-out 1}
.character[data-expression="angry"] .orb-audio-bars{stroke:#ff8ce5!important;animation:orb-neon .6s ease-in-out infinite}
.character[data-expression="sad"] .orb-robot{animation:orb-sigh 4.6s ease-in-out infinite}
.character[data-expression="tired"] .orb-robot{animation:orb-sigh 5s ease-in-out infinite}
.character[data-expression="sleep"] .orb-robot{animation:orb-breath 6s ease-in-out infinite}
.character[data-expression="serene"] .orb-robot{animation:orb-breath 6s ease-in-out infinite}
.character[data-expression="serene"] .orb-crest{animation:orb-twinkle 6s ease-in-out infinite}
.character[data-music="playing"] .orb-audio-bars{animation:orb-neon 3.6s ease-in-out infinite}
.character[data-music="playing"] .orb-orbit{animation:orb-orbit-shimmer 11s ease-in-out infinite}
.character[data-music="playing"] .orb-shadow-ring{animation:orb-neon 7s ease-in-out infinite}
.character[data-expression="pet"] .orb-crest,
.character[data-expression="love"] .orb-crest{animation:orb-twinkle .64s ease-in-out infinite}
.character[data-expression="curious"] .orb-robot,
.character[data-expression="thinking"] .orb-robot{animation:orb-tilt 3.2s ease-in-out infinite}
.character[data-expression="yawn"] .orb-robot{animation:orb-sigh 3s ease-in-out 1}
@keyframes orb-breath{0%,100%{transform:scale(1)}50%{transform:scale(1.018)}}
@keyframes orb-sigh{0%,100%{transform:translateY(2px) scale(.99)}50%{transform:translateY(5px) scale(.985)}}
@keyframes orb-bounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.025)}}
@keyframes orb-startle{0%,100%{transform:scale(1)}30%{transform:scale(.94) rotate(-4deg)}70%{transform:scale(1.06) rotate(3deg)}}
@keyframes orb-tilt{0%,100%{transform:rotate(0)}50%{transform:rotate(-4deg)}}
@keyframes orb-auto-blink{0%,43%,46%,100%{transform:scaleY(1)}44.5%{transform:scaleY(.07)}}
@keyframes orb-talk{0%{transform:scaleY(.45)}100%{transform:scaleY(1.1)}}
@keyframes orb-twinkle{0%,100%{opacity:.8;transform:scale(.96)}50%{opacity:1;transform:scale(1.1)}}
@keyframes orb-neon{0%,100%{opacity:.64}50%{opacity:1}}
@keyframes orb-orbit-shimmer{0%,100%{opacity:.55}50%{opacity:.86}}
@keyframes orb-shadow-soft{0%,100%{opacity:.68;transform:scaleX(1)}50%{opacity:.38;transform:scaleX(.9)}}
@media(max-width:460px){
 .character:has(.alquimago-orb){width:118px!important;height:130px!important}
 .character .alquimago-orb{width:118px!important;height:130px!important}
}
@media(prefers-reduced-motion:reduce){
 .character:has(.alquimago-orb),.character .alquimago-orb *,
 .character .orb-expression{animation:none!important;transition:none!important}
}

`;
// Built-in 2D mascot: native SVG with independent robotic facial poses.
const orbEye=(x,y=81,rx=5,ry=8)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="url(#orb-eye)" class="orb-eye-glow"/><ellipse cx="'+(x-1.5)+'" cy="'+(y-2.5)+'" rx="1.4" ry="2" fill="#f6ffff" opacity=".7"/>';
const orbArc=(d,color='#8bf4ff',sw=3.7)=>'<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round"/>';
const orbMouth=d=>orbArc(d,'#ffabf3',3.4);
const orbFace=(eyes,mouth,extra='')=>'<g class="orb-eyes">'+eyes+'</g><g class="orb-mouth">'+mouth+'</g>'+extra;
const orbSmile=orbMouth('M73 101q7 7 14 0');
const orbClosed=orbArc('M51 82q9 7 18 0')+orbArc('M91 82q9 7 18 0');
const orbNeutral=orbEye(60)+orbEye(100);
export const ORB_EXPRESSIONS={
 idle:orbFace(orbNeutral,orbSmile),
 breath:orbFace(orbClosed,orbSmile),
 serene:orbFace(
  orbArc('M50 82q10 8 20 0','#a9faff',3)+orbArc('M90 82q10 8 20 0','#a9faff',3),
  orbMouth('M73 100q7 10 14 0'),
  '<path d="M49 95q5 3 11 0m40 0q5 3 11 0" fill="none" stroke="#e79bf1" stroke-width="1.4" opacity=".75"/>'),
 blink:orbFace(orbClosed,orbSmile),
 happy:orbFace(orbArc('M51 82q9-11 18 0')+orbArc('M91 82q9-11 18 0'),
  '<path d="M70 98q10 20 20 0Z" fill="#ffa0e7" stroke="#ffcefb" stroke-width="2"/>'),
 excited:orbFace(orbEye(60,80,6,10)+orbEye(100,80,6,10),
  '<path d="M69 98q11 20 22 0Z" fill="#ffa0e7" stroke="#ffcefb" stroke-width="2"/>'),
 laugh:orbFace(orbArc('M50 82l9-9 9 9')+orbArc('M92 82l9-9 9 9'),
  '<path d="M68 96q12 25 24 0Z" fill="#f78adf" stroke="#ffd5ff" stroke-width="2"/>'),
 curious:orbFace(orbEye(60,81,5,9)+orbEye(100,81,5.5,10),
  orbMouth('M76 104q4-3 8 0'),orbArc('M90 68q9-6 18 0','#9cfaff',2.3)),
 focused:orbFace(orbEye(60,84,5,5)+orbEye(100,84,5,5),
  orbMouth('M74 104h12'),orbArc('M50 72l19 8')+orbArc('M91 80l19-8')),
 thinking:orbFace(orbEye(58,79)+orbEye(99,78),
  orbMouth('M76 104q6-5 10-2'),orbArc('M89 66q9-5 19 0')),
 surprised:orbFace(orbEye(60,81,7,11)+orbEye(100,81,7,11),
  '<ellipse cx="80" cy="103" rx="5.5" ry="8" fill="#ffabea" stroke="#ffe1ff" stroke-width="2"/>'),
 confused:orbFace(orbEye(60,81)+orbArc('M91 82q9-6 18 2'),
  orbMouth('M73 104q5-5 9 0q3 2 5-1'),orbArc('M51 68q7-4 17 0')),
 sad:orbFace(orbEye(60,87,5,6)+orbEye(100,87,5,6),
  orbMouth('M73 107q7-9 14 0'),orbArc('M51 75q9-5 18 2')+orbArc('M91 77q9-6 18-2')),
 worried:orbFace(orbEye(60,83)+orbEye(100,83),
  orbMouth('M74 105q6-6 12 0'),orbArc('M51 70q9-9 18 0')+orbArc('M91 70q9-9 18 0')),
 angry:orbFace(orbEye(60,86,5,5)+orbEye(100,86,5,5),
  orbMouth('M73 107q7-5 14 0'),orbArc('M50 73l19 9')+orbArc('M91 82l19-9')),
 tired:orbFace(orbArc('M52 84q8 2 16 0')+orbArc('M92 84q8 2 16 0'),
  orbMouth('M75 104q5 2 10 0'),orbArc('M53 79h15','#a6bfd9',2)+orbArc('M92 79h15','#a6bfd9',2)),
 yawn:orbFace(orbClosed,'<ellipse cx="80" cy="104" rx="7.5" ry="10.5" fill="#f4a1e3" stroke="#ffd2fc" stroke-width="2"/>'),
 sleep:orbFace(orbClosed,'<ellipse cx="80" cy="105" rx="3" ry="4" fill="#ffb4ee"/>'),
 pet:orbFace(orbClosed,orbMouth('M70 99q10 16 20 0'),
  '<path d="M49 96l-4 4m11-3-4 4m56-5 4 4m-11-3 4 4" stroke="#ff92e3" stroke-width="2.6" stroke-linecap="round"/>'),
 love:orbFace('<path d="M49 77q6-8 12-2q6-6 12 2q0 9-12 14q-12-5-12-14ZM88 77q6-8 12-2q6-6 12 2q0 9-12 14q-12-5-12-14Z" fill="#fa9ce9" stroke="#ffd0fa" stroke-width="1.5"/>',
  orbMouth('M73 101q7 11 14 0')),
 shy:orbFace(orbEye(59,84,4.5,6.5)+orbEye(99,84,4.5,6.5),
  orbSmile,'<path d="M49 96l-4 4m10-3-3 4m54-5 4 4m-11-3 3 4" stroke="#ffa0e9" stroke-width="3" stroke-linecap="round"/>'),
 proud:orbFace(orbArc('M52 82q8 4 16 0')+orbArc('M92 82q8 4 16 0'),orbMouth('M70 98q10 15 20 0')),
 talk:orbFace(orbNeutral,'<ellipse class="orb-talk-mouth" cx="80" cy="103" rx="5.5" ry="8" fill="#ffa2e4" stroke="#ffdcfd" stroke-width="2"/>'),
 lookleft:orbFace(orbEye(56)+orbEye(96),orbSmile),
 lookright:orbFace(orbEye(64)+orbEye(104),orbSmile),
 lookup:orbFace(orbEye(60,76)+orbEye(100,76),orbSmile),
 lookdown:orbFace(orbEye(60,87)+orbEye(100,87),orbSmile)
};
export const ROBOT_SVG=[
 '<svg class="alquimago-orb" viewBox="0 0 160 176" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
 '<defs>',
 '<linearGradient id="orb-ceramic" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0ff"/><stop offset=".27" stop-color="#efc3fc"/><stop offset=".57" stop-color="#bdadef"/><stop offset=".82" stop-color="#8ce2ed"/><stop offset="1" stop-color="#6079d1"/></linearGradient>',
 '<linearGradient id="orb-ear" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff2ff"/><stop offset=".54" stop-color="#adbaef"/><stop offset="1" stop-color="#6550a4"/></linearGradient>',
 '<linearGradient id="orb-visor" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#2c1746"/><stop offset=".63" stop-color="#13152e"/><stop offset="1" stop-color="#101c33"/></linearGradient>',
 '<linearGradient id="orb-trim" x1="0" y1=".2" x2="1" y2=".8"><stop stop-color="#ff95f0"/><stop offset=".48" stop-color="#d3a2ff"/><stop offset=".85" stop-color="#80f6ff"/><stop offset="1" stop-color="#bbaeff"/></linearGradient>',
 '<linearGradient id="orb-eye" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#f8ffff"/><stop offset=".52" stop-color="#a8ffff"/><stop offset="1" stop-color="#58dfff"/></linearGradient>',
 '<radialGradient id="orb-aura"><stop stop-color="#a277f7" stop-opacity=".34"/><stop offset="1" stop-color="#9a4aff" stop-opacity="0"/></radialGradient>',
 '<radialGradient id="orb-floor"><stop stop-color="#dc8aff" stop-opacity=".57"/><stop offset=".55" stop-color="#79d5ff" stop-opacity=".22"/><stop offset="1" stop-color="#67d1ff" stop-opacity="0"/></radialGradient>',
 '<pattern id="orb-hex" width="14" height="12" patternUnits="userSpaceOnUse"><path d="M0 3L7 0L14 3V9L7 12L0 9Z" fill="none" stroke="#fff3ff" stroke-width=".7" opacity=".32"/></pattern>',
 '</defs>',
 '<ellipse cx="80" cy="80" rx="76" ry="76" fill="url(#orb-aura)"/>',
 '<ellipse class="orb-shadow" cx="80" cy="162" rx="37" ry="8" fill="url(#orb-floor)"/>',
 '<ellipse class="orb-shadow-ring" cx="80" cy="162" rx="34" ry="5" fill="none" stroke="#8ceaff" stroke-width="1.5" opacity=".62"/>',
 '<g class="orb-orbit"><path d="M18 116C0 122 18 137 42 136M118 41C147 29 157 47 142 66" fill="none" stroke="url(#orb-trim)" stroke-width="3" stroke-linecap="round" opacity=".64"/></g>',
 '<g class="orb-robot">',
 '<circle cx="80" cy="77" r="57" fill="url(#orb-ceramic)" stroke="#c69af5" stroke-width="2.8"/>',
 '<path d="M43 41q19-26 60-17" stroke="#fff8ff" stroke-width="8" fill="none" opacity=".66" stroke-linecap="round"/>',
 '<path d="M88 23q39 3 45 49l-36-26Z" fill="url(#orb-hex)" opacity=".6"/>',
 '<path d="M32 81q-2 36 39 54" fill="none" stroke="#ebffff" stroke-width="3" opacity=".64"/>',
 '<path d="M128 85q-2 32-30 45" fill="none" stroke="#80e9ff" stroke-width="3" opacity=".7"/>',
 '<g class="orb-headset-left"><ellipse cx="24" cy="82" rx="13" ry="25" fill="#342b6b" stroke="#a88af7" stroke-width="2"/><ellipse cx="23" cy="82" rx="10.5" ry="22.5" fill="url(#orb-ear)" stroke="#fff9ff" stroke-width="1.4"/><ellipse cx="20" cy="82" rx="5.8" ry="16.8" fill="#544097" stroke="#c4a8ff" stroke-width="1.4"/><path d="M20 71q-2 11 0 22" fill="none" stroke="#a7faff" stroke-width="2"/></g>',
 '<g class="orb-headset-right"><ellipse cx="136" cy="82" rx="13" ry="25" fill="#342b6b" stroke="#a88af7" stroke-width="2"/><ellipse cx="137" cy="82" rx="10.5" ry="22.5" fill="url(#orb-ear)" stroke="#fff9ff" stroke-width="1.4"/><ellipse cx="140" cy="82" rx="6" ry="17" fill="#35265b" stroke="#8aeaff" stroke-width="1.5"/><path class="orb-audio-bars" d="M137 79v6m3-11v15m3-10v6" stroke="#91faff" stroke-width="1.5" stroke-linecap="round"/></g>',
 '<path d="M38 58Q50 45 68 49L80 51L92 49Q113 47 123 63Q132 85 119 103Q108 117 80 119Q46 116 38 99Q28 80 38 58Z" fill="url(#orb-visor)" stroke="url(#orb-trim)" stroke-width="3.8"/>',
 '<path d="M42 62q14-12 29-7" fill="none" stroke="#f4d0ff" stroke-width="2.5" opacity=".37" stroke-linecap="round"/>',
 '<path d="M45 63l10-6m-6 11 9-5" stroke="#e0d5ff" stroke-width="3" opacity=".4" stroke-linecap="round"/>',
 '<g class="orb-face-display">',
 ...Object.entries(ORB_EXPRESSIONS).map(([name,face])=>'<g class="orb-expression orb-expression-'+name+'">'+face+'</g>'),
 '</g>',
 '<path class="orb-cheek" d="M47 96l-3 4m10-4-3 4m62-4 3 4m-10-4 3 4" fill="none" stroke="#ff97e4" stroke-width="2" stroke-linecap="round" opacity=".58"/>',
 '<path d="M65 50l6-10h18l6 10-6 9H71Z" fill="#2c214a" stroke="#e7a8ff" stroke-width="2"/>',
 '<path class="orb-crest" d="M80 43l2.4 5.2 5.4 2.3-5.4 2.4L80 58l-2.4-5.1-5.4-2.4 5.4-2.3Z" fill="#baffff" stroke="#fff" stroke-width=".6"/>',
 '<path d="M47 118q33 24 66 0" stroke="#fff9ff" stroke-width="2" fill="none" opacity=".55"/>',
 '<rect x="65" y="127" width="30" height="11" rx="5.5" fill="#24234e" stroke="#8bdefc" stroke-width="1.5"/>',
 '<path class="orb-status-light" d="M72 131h16m-13 3h10" stroke="#8df4ff" stroke-width="1.8" stroke-linecap="round"/>',
 '</g>',
 '<path class="orb-twinkle" d="M12 54l2 5 5 2-5 2-2 5-2-5-5-2 5-2ZM146 36l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#dec1ff" opacity=".76"/>',
 '</svg>'
].join('');
