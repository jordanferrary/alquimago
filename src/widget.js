import { restoreBrain, applyAction, passTime, currentMood, levelFromXp } from './brain.mjs';
import {normalizeConfig,loadConfig} from './config.mjs';
import {readMemory,writeMemory,parseBackup,exportBackup,cleanMemory} from './storage.mjs';
import {inspectProjectFiles,readPublicSnapshot} from './project.mjs';
import {readPublicPage,suggestionsFromPage,samePageSignature,routeSignature} from './awareness.mjs';
import {freshStroke,updateHeadStroke} from './gestures.mjs';
import {respondToChat,readDialogue,writeDialogue,safeChatText} from './dialogue.mjs';
import {INTENTS,seedNeuralModel,upgradeNeuralSeed,trainNeural,teachNeural,neuralPredict,serializeNeuralModel,restoreNeuralModel,readNeural,writeNeural} from './neural.mjs';
import {projectMeta,projectAdvice,projectIdentity,shouldCommentProject} from './project-insight.mjs';
import {normalizeLanguage,loadLanguage} from './i18n.mjs';
import {normalizeSkin,safeSkinUrl,skinExpression} from './skin.mjs';
import {inspectCover,imageMetricAdvice} from './image-insight.mjs';
import {blankPreferences,cleanPreferences,rankTips,learnTip,readPreferences,writePreferences} from './episodic.mjs';
import {createCortex,cleanCortex,createCortexRuntime,tickCortex,rewardCortex,cortexSummary,readCortex,writeCortex} from './behavior.mjs';
import {createOrb,stepOrb,tossOrb} from './physics.mjs';
import {recognizeStudioCommand} from './commands.mjs';
import {pendingFromReply} from './conversation.mjs';
import {normalizeKnowledge,loadKnowledge} from './knowledge.mjs';
import {askLanguageModel,validateModelEndpoint} from './llm.mjs';

const TAG = 'alquimago-familiar';
const STYLE = `
:host([data-position="bottom-left"]){right:auto;left:22px}
.tabs{overflow-x:auto}.tab{min-width:46px;padding:7px 4px}
:host{all:initial;position:fixed;z-index:2147483000;right:22px;bottom:20px;color:#f5eaff;font:13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;--violet:#b58aff;--ink:#17101f;--gold:#f9d891;user-select:none;box-sizing:border-box}
:host([data-mode="desktop"]){position:relative;right:auto;bottom:auto;display:block;width:100%;height:100%}
*{box-sizing:border-box}
.shell{position:relative;display:flex;align-items:flex-end;flex-direction:column;gap:6px;filter:drop-shadow(0 8px 21px #13082258)}
:host([data-mode="desktop"]) .shell{width:100%;align-items:center;padding-top:26px}
.character{appearance:none;border:0;background:transparent;width:116px;height:143px;padding:0;cursor:grab;position:relative;touch-action:none;transform-origin:bottom center;animation:levitate 3.4s ease-in-out infinite}
.character:focus-visible,.action:focus-visible,.menu:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.character:active{cursor:grabbing}
.character svg{width:116px;height:143px;overflow:visible}
.character .eyes{animation:blink 6.3s infinite;transform-origin:center}
.character[data-mood="meditando"] .eyes,.character[data-mood="sonolento"] .eyes{transform:scaleY(.18);animation:none}
.character[data-mood="animado"]{animation:levitate 1.5s ease-in-out infinite}
.character[data-mood="concentrado"] .rune{animation:spin 4s linear infinite;transform-origin:58px 91px}
.familiar-title{display:flex;gap:7px;align-items:center;border:1px solid #a67fdd69;background:linear-gradient(110deg,#24162fea,#3e275be9);color:#f5e8ff;border-radius:999px;box-shadow:0 8px 25px #1e0e2b72;padding:6px 10px;cursor:pointer}
.familiar-title strong{font-size:12px;letter-spacing:.1px}.familiar-title small{color:#c9adeb;font-size:10px}
.panel{width:min(308px,calc(100vw - 24px));border:1px solid #9567c6b8;border-radius:17px;background:linear-gradient(165deg,#291b38f5,#141020f7);color:#f6eeff;box-shadow:0 12px 42px #13072291;backdrop-filter:blur(17px);overflow:hidden;display:none}
.panel.open{display:block}
:host([data-mode="desktop"]) .panel{display:block;width:285px;max-height:calc(100vh - 220px);overflow:auto}
.panel-header{padding:14px 15px 12px;border-bottom:1px solid #72508b57;background:#ffffff08}
.panel-header .row{display:flex;align-items:center;justify-content:space-between;gap:8px}.subtitle{font-size:11px;color:#c4abd7;margin-top:5px}
.tabs{display:flex;gap:4px;padding:8px;border-bottom:1px solid #ffffff16}
.tab{border:0;flex:1;border-radius:9px;padding:7px 3px;color:#e8d9f4;background:transparent;font:inherit;font-size:11px;cursor:pointer}
.tab.selected{background:#8151a842;color:#ffebbf}
.content{padding:12px 13px;min-height:130px;max-height:235px;overflow-y:auto}
.line{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 0;font-size:12px}
.line small,.muted{color:#c4a6d5;font-size:11px}
.actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}
.action,.menu{font:inherit;font-size:11px;color:#f5e8ff;border:1px solid #a88ac066;background:#57376f8f;border-radius:9px;padding:8px 10px;cursor:pointer}
.action:hover,.menu:hover{background:#7c4a9c}.action:disabled{opacity:.5;cursor:default}
.action.primary{background:#7a4c9c;border-color:#b98adb}
.badge{display:inline-block;color:#fff0c9;background:#8d642b50;border:1px solid #dfb36b6b;padding:2px 7px;border-radius:999px;font-size:10px}
.stat{height:5px;background:#ffffff20;border-radius:6px;overflow:hidden;margin:2px 0 8px}.bar{height:100%;border-radius:6px;background:linear-gradient(90deg,#a76bea,#e5a8ff)}
.list-item{display:block;width:100%;text-align:left;color:#eee1ff;background:#ffffff0a;border:1px solid #ffffff15;border-radius:7px;padding:7px;margin:5px 0;font:inherit;font-size:11px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.feedback{border-top:1px solid #ffffff20;font-size:11px;padding:9px 13px;color:#dec4f1;min-height:34px}
.hidden{display:none!important}
@keyframes levitate{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}
@keyframes blink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.07)}}
@keyframes spin{to{transform:rotate(360deg)}}

/* Arcane familiar • refined panel & meaningful gestures */
:host{--violet:#b58aff;--ink:#110c21}
.shell{gap:9px}
.character{width:124px;height:155px;filter:drop-shadow(0 8px 12px #08051b99)}
.character svg{width:124px;height:155px}
.character:hover{filter:drop-shadow(0 0 13px #a768f681) drop-shadow(0 10px 10px #0b0525a6)}
.character .arc-sigils{animation:spin 36s linear infinite;transform-origin:58px 93px}
.character .potion-spark{animation:twinkle 2.2s ease-in-out infinite}
.character .potion-bubble{animation:twinkle 1.6s ease-in-out infinite}
.character[data-mood="feliz"] .arc-mouth{stroke-width:3}
.character[data-mood="animado"]{animation:levitate 1.25s ease-in-out infinite}
.familiar-title{border-color:color-mix(in srgb,var(--violet),#251438 40%);background:linear-gradient(115deg,#231335ed,#130e25ef)}
.panel{width:min(338px,calc(100vw - 18px));border:1px solid #ad78de91;background:linear-gradient(150deg,#251637f7,#110d20fa 75%);box-shadow:0 20px 60px #060113b0}
.panel-header{background:radial-gradient(ellipse at 80% 0%,#8a5cf21e,transparent),#ffffff06}
.panel-header b{font-size:14px;letter-spacing:.02em}
.tab{font-size:11px;white-space:nowrap}
.tab.selected{background:color-mix(in srgb,var(--violet) 32%,#21132f);color:#fff1d4}
.content{max-height:min(335px,45vh)}
.action{min-height:35px}
.action.primary{background:linear-gradient(125deg,#7043b3,#47277e)}
.action:hover,.list-item:hover{border-color:var(--violet)}
.insight{padding:11px;margin:8px 0;border:1px solid #9276af5a;border-radius:12px;background:#ad81f711;line-height:1.55}
.insight b{display:block;color:#f4e6ff;margin-bottom:3px}
.insight span{color:#cab7df;font-size:11px}
.thought{max-width:205px;border:1px solid #b991f37a;border-radius:12px 12px 3px 12px;background:#251635f2;padding:7px 11px;line-height:1.3;font-size:10px;color:#f1e3ff;box-shadow:0 5px 19px #06020d77;align-self:flex-end}
.thought:empty,.thought[hidden]{display:none!important}
:host([data-position="bottom-left"]) .thought{align-self:flex-start;border-radius:12px 12px 12px 3px}
:host([data-position="bottom-left"]) .shell{align-items:flex-start}
@keyframes twinkle{0%,100%{opacity:.45;transform:scale(.92)}50%{opacity:1;transform:scale(1.12)}}
@media(max-width:460px){:host{right:8px;bottom:9px}.panel{width:min(315px,calc(100vw - 16px))}.character{width:100px;height:128px}.character svg{width:100px;height:128px}}


/* Conversa local e gestos de afeto — sem dependências externas */
.content .chat-history{
 display:flex;flex-direction:column;gap:8px;min-height:125px;
 max-height:200px;overflow-y:auto;padding:4px 2px 11px;scrollbar-width:thin;
}
.chat-bubble{max-width:93%;font-size:12px;line-height:1.55;padding:9px 11px;border-radius:13px;overflow-wrap:anywhere;user-select:text}
.chat-bubble.from-user{align-self:flex-end;background:#67419d;border:1px solid #9a6fc5;color:#fff}
.chat-bubble.from-familiar{align-self:flex-start;background:#332243;border:1px solid #634a7f;color:#ecdcff}
.chat-form{display:flex;align-items:center;gap:6px;margin-top:7px}
.chat-form input{min-width:0;width:100%;flex:1;background:#140d22;border:1px solid #72548f;border-radius:11px;color:#fff;padding:10px 9px;font:inherit;font-size:12px;user-select:text}
.chat-form input:focus-visible{outline:2px solid var(--violet);outline-offset:1px}
.chat-send{min-width:37px;height:37px;border:1px solid #af83dc;background:#6a3f9b;color:#fff;border-radius:11px;cursor:pointer}
.chat-suggestions{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}
.chat-suggestions button{font:inherit;font-size:10px;color:#f8e8ff;background:#4b305f;border:1px solid #8563a3;border-radius:15px;padding:6px 9px;cursor:pointer}
.thought{color:#f2e5ff;text-align:left;cursor:pointer;max-width:205px;font:inherit;font-size:11px}
.affection-burst{pointer-events:none;position:absolute;top:14%;left:20%;font-size:19px;letter-spacing:8px;color:#ffacd8;animation:affection-rise .95s ease-out forwards;text-shadow:0 0 10px #f394f3}
@keyframes affection-rise{0%{opacity:0;transform:translateY(10px) scale(.8)}25%{opacity:1}100%{opacity:0;transform:translateY(-40px) scale(1.3)}}
.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}


/* Avoid filter creating a containing block for fixed-position panel. */
.shell{filter:none!important}
/* Responsive, opaque and truly viewport-bounded grimório. The panel is not in
   the mascot's vertical flow, so short monitors no longer cut it off. */
:host{isolation:isolate}
:host([data-publishing="true"]){display:none!important}
.panel{
 position:fixed!important;
 z-index:2147483600;
 right:clamp(132px,11vw,165px);
 left:auto;top:auto;bottom:10px;
 width:min(360px,calc(100vw - 175px));
 height:auto;max-height:calc(100dvh - 20px);
 min-height:0;
 overflow:hidden;
 background:#171023!important;
 background-image:linear-gradient(155deg,#302040,#161022 70%)!important;
 backdrop-filter:none!important;
 box-shadow:0 20px 65px #04010cf0,0 0 0 1px #b78cee50;
 pointer-events:auto;
 overscroll-behavior:contain;
}
.panel.open{display:flex!important;flex-direction:column}
.panel:not(.open){display:none!important}
.panel-header,.tabs,.feedback{flex:0 0 auto}
.panel-header{background:#261933!important}
.panel-header .row{gap:5px}
.panel-header .row b{flex:1;min-width:0;font-size:12px!important}
.panel-close{
 display:grid;place-items:center;width:27px;height:27px;flex:0 0 27px;
 background:#482e60;border:1px solid #b286ce;border-radius:9px;
 color:#f7e8ff;font:15px system-ui;cursor:pointer;
}
.content{
 flex:1 1 auto;min-height:0!important;
 max-height:none!important;
 overflow-y:auto;overscroll-behavior:contain;
 padding:12px!important;
}
.tabs{overflow-x:auto;scrollbar-width:thin}
.tab{flex:0 0 auto;min-width:46px}
.feedback{max-height:70px;overflow-y:auto;background:#1a1129}
.chat-history{min-height:45px!important;max-height:min(220px,32dvh)!important}
.neural-teach{
 display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:8px;
 padding:8px 0;border-top:1px solid #8b66a746;
}
.neural-teach label{color:#dec8f2;font-size:10px}
.neural-teach select{
 flex:1 1 115px;min-width:0;background:#20122f;color:#f5e8ff;
 border:1px solid #906ab7;border-radius:8px;padding:6px;font:11px system-ui;
}
.neural-teach button{
 background:#653b90;border:1px solid #ab83d4;color:#fff;
 border-radius:8px;padding:6px 9px;font:11px system-ui;cursor:pointer;
}
.session-note{
 font-size:11px;line-height:1.5;padding:8px 10px;margin-top:9px;
 border:1px solid #a77cd158;border-radius:10px;background:#362244;
 color:#e9d3f4;
}
:host([data-position="bottom-left"]) .panel{
 right:auto;left:clamp(132px,11vw,165px);
}
:host([data-mode="desktop"]) .panel{
 position:relative!important;right:auto!important;left:auto!important;
 top:auto!important;bottom:auto!important;max-height:calc(100dvh - 230px);
 width:min(320px,100%);overflow:hidden;
}
@media(max-width:720px){
 .panel,.panel.open,:host([data-position="bottom-left"]) .panel{
  position:fixed!important;
  top:8px;bottom:8px;right:8px;left:8px;
  width:auto!important;height:auto!important;max-height:none!important;
  border-radius:15px;
 }
 .panel.open{display:flex!important}
 .content{padding:10px!important}
}
@media(max-height:430px){
 .panel,.panel.open,:host([data-position="bottom-left"]) .panel{
  top:5px;bottom:5px;max-height:calc(100dvh - 10px);
 }
 .panel-header{padding:8px 10px}
 .tabs{padding:5px}
 .feedback{padding:5px 10px;min-height:20px}
}


/* Teaching is discoverable but does not crowd the conversation. */
.neural-lesson{margin:9px 0;padding:8px 10px;background:#24172f;border:1px solid #8b65af70;border-radius:10px}
.neural-lesson summary{color:#ead6ff;font-size:12px;font-weight:600;cursor:pointer}
.neural-lesson .neural-teach{margin-top:8px}

.arcane-orb-field{
 position:absolute;right:2px;bottom:160px;width:165px;height:112px;
 border:1px solid #9269c884;background:#1c1231e9;border-radius:14px;
 z-index:3;overflow:hidden;box-shadow:0 8px 32px #11051c99;
 pointer-events:auto;touch-action:none;
}
.arcane-orb{
 position:absolute;top:0;left:0;width:22px;height:22px;padding:0;border:0;
 border-radius:50%;color:#261340;font:16px system-ui;font-weight:bold;
 background:radial-gradient(circle at 30% 25%,#fff6c3,#dab3ff 50%,#8754e9);
 box-shadow:0 0 15px #b46dff,0 3px 8px #06031388;
 cursor:grab;touch-action:none;will-change:transform;z-index:1;
}
.arcane-orb:active{cursor:grabbing}
.orb-close{position:absolute;top:2px;right:3px;width:24px;height:24px;
 border:0;border-radius:8px;background:#39224cd9;color:#f0dcff;
 font:17px system-ui;cursor:pointer;z-index:2}


.arcane-cortex{border-color:#ae83d375}
.arcane-control-label{display:flex;flex-direction:column;gap:6px;margin:10px 0;color:#e3ccf4;font-size:11px}
.arcane-control-label select{background:#21132f;color:#fff;border:1px solid #8763a8;
 border-radius:8px;padding:8px;font:12px system-ui}
.arcane-cortex .action:disabled{opacity:.45;cursor:not-allowed}


.arcane-ai-consent{
 display:flex;gap:10px;align-items:flex-start;padding:10px 12px;margin:10px 0;
 border:1px solid #9767ba66;border-radius:12px;background:#261831;
 color:#e6d8ef;font:11px/1.5 system-ui;
}
.arcane-ai-consent input{accent-color:#ac78ef;width:15px;height:15px;flex-shrink:0;margin-top:2px}

/* Three clear tabs and an internal, unobtrusive settings disclosure. */
#arcane-skin-label select{margin-top:6px;width:100%;background:#21132f;color:#f3deff;border:1px solid #8763a8;border-radius:8px;padding:7px;font:12px system-ui}
.tabs{justify-content:stretch;gap:4px;padding:7px 8px}
.tab{flex:1 1 0;min-width:0!important;text-overflow:ellipsis;overflow:hidden;font-size:12px!important}
.arcane-advanced{margin-top:12px;padding:9px;border:1px solid #845ba353;border-radius:12px;background:#241630}
.arcane-advanced summary{font-size:11px;font-weight:600;cursor:pointer;color:#ead3f5;list-style:revert}
.arcane-advanced .actions{margin-top:10px}
.arcane-toggle{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:11px;margin-top:12px;color:#e5d2f2}
.arcane-toggle input{accent-color:#ae77e4;width:15px;height:15px}
.panel,.content,.chat-history,.tabs{scrollbar-color:#8654b4 #21152e;scrollbar-width:thin}
.panel ::-webkit-scrollbar{width:8px;height:6px}
.panel ::-webkit-scrollbar-track{background:#21152e;border-radius:999px}
.panel ::-webkit-scrollbar-thumb{background:#8054ab;border:2px solid #21152e;border-radius:999px}
.panel ::-webkit-scrollbar-thumb:hover{background:#ba89df}
.arcane-skin-image{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 6px 13px #07020e88)}

@media(prefers-reduced-motion:reduce){.character,.character .eyes,.rune{animation:none!important}}
`;
const SVG = `<svg viewBox="0 0 116 150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
<defs>
 <radialGradient id="arc-halo"><stop stop-color="#bd84ff" stop-opacity=".42"/><stop offset="1" stop-color="#8445d9" stop-opacity="0"/></radialGradient>
 <linearGradient id="arc-hat" x1=".1" y1="0" x2=".8" y2="1"><stop stop-color="#7651bd"/><stop offset=".52" stop-color="#3f246d"/><stop offset="1" stop-color="#23173c"/></linearGradient>
 <linearGradient id="arc-cloak" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6f43aa"/><stop offset=".65" stop-color="#342052"/><stop offset="1" stop-color="#170f2b"/></linearGradient>
 <linearGradient id="arc-flask" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d4ffed" stop-opacity=".8"/><stop offset=".55" stop-color="#47f5d6" stop-opacity=".7"/><stop offset="1" stop-color="#36a5ec" stop-opacity=".85"/></linearGradient>
 <filter id="arc-glow"><feGaussianBlur stdDeviation="2.1"/></filter>
</defs>
<ellipse cx="58" cy="87" rx="55" ry="60" fill="url(#arc-halo)"/>
<g class="arc-sigils" fill="none" stroke="#d5a7ff" stroke-width=".9" opacity=".68"><circle cx="58" cy="93" r="45" stroke-dasharray="3 5"/><path d="M58 40v8M58 139v-7M4 93h8M104 93h8"/><circle cx="58" cy="93" r="35" stroke-dasharray="1 10"/></g>
<ellipse cx="58" cy="143" rx="37" ry="4" fill="#0e0925" opacity=".3"/>
<!-- robe and sleeves -->
<path d="M37 93Q20 99 22 133Q38 144 58 144Q81 144 96 133Q96 101 78 94L70 89H47Z" fill="url(#arc-cloak)" stroke="#b893df" stroke-width="1.7"/>
<path d="M50 94L58 111L67 94L63 132L58 138L53 132Z" fill="#261838" stroke="#9e71c2" stroke-width="1.2"/>
<path d="M58 107l5 9-5 9-5-9Z" fill="#d7b572" stroke="#fff2bd" stroke-width=".7"/>
<path d="M36 100q-13 5-16 22" fill="none" stroke="#7952b2" stroke-width="13" stroke-linecap="round"/>
<path d="M81 102q12 3 17 18" fill="none" stroke="#7952b2" stroke-width="12" stroke-linecap="round"/>
<!-- flowing hair -->
<path d="M33 69Q23 93 36 108L44 99Q48 113 52 102L69 100Q75 111 83 107Q89 89 82 69Z" fill="#ece4f5" stroke="#b9a8d1" stroke-width="1.8"/>
<!-- face -->
<path d="M32 68Q30 47 57 48Q83 46 85 68L81 88Q75 100 59 102Q39 101 34 88Z" fill="#e9c1ad" stroke="#ba8b9a" stroke-width="1.4"/>
<ellipse cx="42" cy="85" rx="6" ry="3.3" fill="#efa5ac" opacity=".6"/><ellipse cx="74" cy="85" rx="6" ry="3.3" fill="#efa5ac" opacity=".6"/>
<!-- expressive hair fringe and eyes -->
<path d="M31 69Q37 50 51 54Q56 44 69 54Q79 52 85 69Q75 64 69 64Q64 73 58 72Q50 63 42 69Q36 67 31 71Z" fill="#f4ebff" stroke="#c9b8de" stroke-width="1.3"/>
<g class="eyes"><path d="M43 77q4-3 9 0" fill="none" stroke="#39243b" stroke-width="2" stroke-linecap="round"/><path d="M65 77q4-3 9 0" fill="none" stroke="#39243b" stroke-width="2" stroke-linecap="round"/><ellipse cx="47.5" cy="81" rx="3" ry="5" fill="#251936"/><ellipse cx="69" cy="81" rx="3" ry="5" fill="#251936"/><circle cx="48" cy="79.4" r="1.3" fill="#fff"/><circle cx="69.5" cy="79.4" r="1.3" fill="#fff"/></g>
<path class="arc-mouth" d="M54 91q4 4 8 0" fill="none" stroke="#9b6374" stroke-width="1.6" stroke-linecap="round"/>
<!-- hat with gold circlet and small arcane star -->
<path d="M18 64Q29 55 35 40Q52 13 59 5Q73 28 79 46Q88 56 97 61Q92 72 57 73Q29 72 18 64Z" fill="url(#arc-hat)" stroke="#c9a6ff" stroke-width="2.1"/>
<path d="M38 39Q55 29 76 44L80 53Q58 48 31 55Z" fill="#9a6abd" opacity=".35"/>
<path d="M22 62Q57 70 94 61" fill="none" stroke="#e3c077" stroke-width="4.5" stroke-linecap="round"/>
<path d="M56 13l3 6 7 1-5 5 2 7-7-4-6 4 1-7-5-5 7-1Z" fill="#fce1a4" stroke="#fff2c8" stroke-width="1"/>
<circle cx="59" cy="23" r="2" fill="#fff9d6"/>
<!-- alchemist vial in right hand -->
<path d="M94 111l3-7 7 2-1 7 5 10q3 12-9 15-12-2-9-14Z" fill="url(#arc-flask)" stroke="#cffdf1" stroke-width="1.5"/>
<path d="M95 110l9 3" stroke="#e8fff4" stroke-width="2"/><path d="M92 126q6 5 14 0" fill="none" stroke="#1ee4ba" stroke-width="2"/>
<circle class="potion-bubble" cx="99" cy="121" r="2.4" fill="#ecfffe"/><circle class="potion-bubble" cx="103" cy="117" r="1.2" fill="#fff"/>
<path d="M88 118q5-6 7-2" fill="none" stroke="#e7c7b9" stroke-width="5" stroke-linecap="round"/>
<!-- tiny feet and sparkles -->
<ellipse cx="44" cy="143" rx="12" ry="4" fill="#251333" stroke="#9e77bc" stroke-width="1.5"/><ellipse cx="71" cy="143" rx="12" ry="4" fill="#251333" stroke="#9e77bc" stroke-width="1.5"/>
<path class="potion-spark" d="M101 76l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#9ff5e8"/>
<path class="potion-spark" d="M17 88l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#ffdf9a"/>
<circle cx="93" cy="53" r="2" fill="#e7d4ff"/>
</svg>`;
const MAIN_TABS=[{index:5,key:'chat'},{index:1,key:'insights'},{index:0,key:'actions'}];
const MOODS = { feliz: 'Sua magia está em alta!', animado:'Pronto para uma aventura.', meditando:'Recarregando as runas...', sonolento:'Hora de descansar.', concentrado:'Estudando feitiços...', curioso:'Explorando ideias.', tranquilo:'Seu familiar está por aqui.' };
const CONFIG_URL = typeof document==='undefined'?'':(document.currentScript?.dataset?.config||window.ALQUIMAGO_CONFIG_URL||'');
const storage=()=>{try{return window.localStorage;}catch{return null;}};
function findSameOriginLinks() {
  if (typeof document === 'undefined') return [];
  const unique = new Map();
  document.querySelectorAll('a[href]').forEach(a => {
    try {
      const url = new URL(a.getAttribute('href'), location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname === location.pathname && url.search === location.search && !url.hash) return;
      const key = url.pathname + url.search + url.hash;
      if (!unique.has(key)) unique.set(key, { label: (a.textContent || a.getAttribute('aria-label') || key).trim().slice(0, 68) || key, href: url.href });
    } catch { /* malformed href */ }
  });
  return [...unique.values()].slice(0, 15);
}
function auditPage() {
  const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
  return {
    title: document.title || 'Página sem título',
    path: location.pathname,
    headings: document.querySelectorAll('h1,h2,h3').length,
    buttons: document.querySelectorAll('button').length,
    links: document.querySelectorAll('a[href]').length,
    images: document.querySelectorAll('img').length,
    missingAlt: document.querySelectorAll('img:not([alt])').length,
    duplicateIds: ids.length - new Set(ids).size,
    brokenImages: [...document.images].filter(e => e.complete && e.naturalWidth === 0).length,
  };
}
class AlquimagoFamiliar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = { brain: restoreBrain(null), tab: 5, open: false, position: null };
    this.config=normalizeConfig(null);
    this.message=this.config.identity.greeting;
    this.projectFiles=[];
    this.knowledge=normalizeKnowledge(null);this.lastProjectId=null;
    this.modelAvailable=false;this.modelEnabled=false;this.modelBusy=false;this.modelSequence=0;this.modelAbort=null;
    this.links = [];
    this.audit = null;
    this.timer = null;
    this.pointerStart = null;
    this.hoverStroke=freshStroke();this.dialogue=[];
    this.neural=seedNeuralModel();this.lastUserText='';this.lastNeuralIntent='';this.pendingQuestion=null;this.configReady=false;this.lastSpoken=null;this.lastSpokenAt=0;this.lastIdleSpeech=Date.now();this.idleCycle=0;
    this.activePage=null;this.suggestions=[];this.observeTimer=null;this.observer=null;this.routeHandler=null;this.studioHandler=null;this.activityHandler=null;this.studioInfo=null;
    this.publishDialogHandler=null;
    this.language=normalizeLanguage(null);this.skin=normalizeSkin(null);this.skinAdapter=null;
    this.preferences=blankPreferences();
    this.cortex=createCortexRuntime(createCortex());this.cortexStart=Date.now();
    this.behaviorAllowed=false;this.behaviorMode='equilibrado';
    this.lastUserActivity=Date.now();this.lastAutoDecision=null;this.lastAutoFeedbackAt=0;
    this.orb=null;this.orbElement=null;this.orbField=null;this.orbFrame=0;this.orbStopAt=0;
    this.skinProfiles=[{id:'padrao',label:'Alquimago padrão',type:'svg'}];this.selectedSkin='padrao';
    this.observeProjects=true;this.hoverStart=null;this.hoverCount={};this.hoverSeen=null;
    this.pointerOverHandler=null;this.pointerOutHandler=null;this.selectedProject=null;
  }
  get desktop() { return this.getAttribute('data-mode') === 'desktop'; }
  connectedCallback() {
    const saved=readMemory(storage());
    this.dialogue=readDialogue(storage());
    this.state.brain = passTime(restoreBrain(saved.brain), Math.max(0, Date.now() - (saved.brain?.lastSeen || Date.now())));
    if (saved.position && Number.isFinite(saved.position.x) && Number.isFinite(saved.position.y)) this.state.position = saved.position;
    this.state.open = this.desktop;
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><section class="shell"><div class="panel" id="panel"><header class="panel-header"><div class="row"><b id="wizard-title">✦ Grimório</b><span class="badge" id="level">Nível 1</span><button type="button" id="close-panel" aria-label="Fechar grimório" title="Fechar" class="panel-close">✕</button></div><div class="subtitle" id="wizard-subtitle">Familiar local • sem coleta de dados</div></header><nav class="tabs" id="tabs" aria-label="Seções"></nav><div class="content" id="content"></div><div class="feedback" id="feedback" role="status"></div></div><button type="button" class="thought" id="thought" aria-label="Conversar com o familiar"></button><button type="button" class="character" id="character" aria-label="Interagir com Alquimago" title="Toque para carinho, deslize para acariciar ou arraste para mover">${SVG}</button><button type="button" class="familiar-title" id="toggle"><strong id="wizard-label">✦ Alquimago</strong><small id="mood">tranquilo</small><span aria-hidden="true">⌃</span></button></section>`;
    this.$panel = this.shadowRoot.getElementById('panel');
    this.$character = this.shadowRoot.getElementById('character');
    this.$content = this.shadowRoot.getElementById('content');
    this.$thought=this.shadowRoot.getElementById('thought');
    this.$thought.addEventListener('click',()=>{this.state.open=true;this.state.tab=this.selectedProject&&Date.now()-this.lastSpokenAt<18000?1:5;this.render();});
    this.shadowRoot.getElementById('close-panel').addEventListener('click',()=>{this.state.open=false;this.render();});
    this.$tabs = this.shadowRoot.getElementById('tabs');
    this.$feedback = this.shadowRoot.getElementById('feedback');
    this.shadowRoot.getElementById('toggle').addEventListener('click', () => this.toggle());
    this.$character.addEventListener('pointerdown', e => this.onPointerDown(e));
    this.$character.addEventListener('pointermove', e => this.onPointerMove(e));
    this.$character.addEventListener('pointerleave',()=>{this.hoverStroke={...freshStroke(),lastTriggeredAt:this.hoverStroke.lastTriggeredAt};});
    this.$character.addEventListener('pointerup', e => this.onPointerUp(e));
    this.$character.addEventListener('pointercancel', () => { this.pointerStart = null; });
    this.$character.addEventListener('contextmenu',e=>{e.preventDefault();this.state.open=true;this.state.tab=0;this.render();});
    this.$character.addEventListener('wheel',e=>{
      e.preventDefault();
      const sprite=this.$character.querySelector('svg');
      if(!sprite)return;
      this.wheelAngle=(this.wheelAngle||0)+(e.deltaY>0?20:-20);
      sprite.style.transform='rotate('+this.wheelAngle+'deg)';
      clearTimeout(this.wheelTimer);
      this.wheelTimer=setTimeout(()=>{sprite.style.transform='';this.wheelAngle=0;},750);
    },{passive:false});
    this.$tabs.addEventListener('click', e => {
      const button = e.target.closest('button[data-tab]');
      if (button) { this.state.tab = Number(button.dataset.tab); this.render(); }
    });
    this.$content.addEventListener('click', e => this.onContentClick(e));
    this.$content.addEventListener('change',e=>{
      if(e.target?.id==='alquimago-skin-choice'){
        const chosen=this.skinProfiles.find(x=>x.id===e.target.value);
        if(chosen){
          this.selectedSkin=chosen.id;this.skin=normalizeSkin(chosen);this.applySkin();
          this.message='Skin "'+chosen.label+'" selecionada. '+(this.config.memory.mode==='publish'?'Publique para salvar.':'');
          this.renderHeader();
        }
      }
      if(e.target?.id==='toggle-cortex'){
        this.behaviorAllowed=!!e.target.checked;
        this.message=this.behaviorAllowed?'Iniciativas ativadas.':'Iniciativas pausadas.';
        this.renderHeader();
      }
      if(e.target?.id==='cortex-mode'){
        if(['silencioso','equilibrado','brincalhao'].includes(e.target.value)){
          this.behaviorMode=e.target.value;
          this.message='Temperamento ajustado para '+this.behaviorMode+'.';
          this.renderHeader();
        }
      }
      if(e.target?.id==='toggle-llm'){
        this.modelEnabled=this.modelAvailable&&!!e.target.checked;
        this.message=this.modelEnabled?'IA generativa ativada para esta sessão. Suas próximas perguntas poderão ser enviadas ao serviço autorizado.':'Modo contextual local ativado.';
        this.renderHeader();
      }
      if(e.target?.id==='toggle-proactive'){
        this.observeProjects=!!e.target.checked;
        if(!this.observeProjects)this.cancelProjectHover();
        this.message=this.observeProjects?'Observação de projetos ativada.':'Observação proativa pausada.';
        this.renderHeader();
      }
    });
    this.$content.addEventListener('submit',e=>{
      if(e.target?.id!=='alquimago-chat-form')return;
      e.preventDefault();
      const input=e.target.querySelector('input[name="message"]');
      if(!input)return;
      this.sendMessage(input.value);
    });
    if (!this.desktop && this.state.position) this.moveTo(this.state.position.x, this.state.position.y);
    this.render();
    this.lastSpoken=this.config.identity.greeting;this.lastSpokenAt=Date.now();this.updateThought();
    this.startObservation();
    this.studioHandler=event=>{
      const d=event?.detail;
      if(!d||typeof d.section!=='string')return;
      this.studioInfo={
        section:d.section.slice(0,35),
        projects:Number.isFinite(d.projects)?Math.max(0,Math.min(9999,d.projects)):0,
        pages:Number.isFinite(d.pages)?Math.max(0,Math.min(9999,d.pages)):0,
        editing:d.editing===true
      };
      this.inspectPage(true);
    };
    window.addEventListener('alquimago:studio-context',this.studioHandler);
    this.activityHandler=event=>{
      const data=event?.detail;
      if(data?.type==='published'&&typeof data.revision==='string'){
        this.action('publish','pub-'+encodeURIComponent(data.revision).slice(0,100));
      }
    };
    window.addEventListener('alquimago:activity',this.activityHandler);
    this.publishDialogHandler=event=>{
      if(event?.detail?.open===true){
        this.dataset.publishing='true';
        this.state.open=false;
        this.render();
      }else delete this.dataset.publishing;
    };
    window.addEventListener('alquimago:publish-dialog',this.publishDialogHandler);
    window.dispatchEvent(new Event('alquimago:request-context'));
    if(CONFIG_URL)void loadConfig(CONFIG_URL,{origin:location.origin}).then(async config=>{
      this.config=config;
      this.modelAvailable=config.llm.enabled&&!!validateModelEndpoint(config.llm.endpoint,{pageUrl:location.href});
      if(config.knowledge.file){
        try{this.knowledge=await loadKnowledge(config.knowledge.file,{pageUrl:location.href});}
        catch{this.knowledge=normalizeKnowledge(null);}
      }
      this.behaviorAllowed=config.behavior.enabled;this.behaviorMode=config.behavior.mode;
      this.observeProjects=config.proactive.projectHover;
      this.skinProfiles=config.appearance.skins;
      this.selectedSkin=config.appearance.selectedSkin;
      this.skin=normalizeSkin(this.skinProfiles.find(entry=>entry.id===this.selectedSkin)||config.appearance.skin);
      if(config.language.file){
        try{
          this.language=await loadLanguage(config.language.file,{pageUrl:location.href});
          const samples=this.language.intentSamples||{};
          for(const [intent,phrases] of Object.entries(samples)){
            if(!INTENTS.includes(intent)||!Array.isArray(phrases))continue;
            for(const example of phrases.slice(0,12))
              if(typeof example==='string'&&example.length<=120)teachNeural(this.neural,example,intent);
          }
          this.neural.learned=0;
        }catch{this.language=normalizeLanguage(null)}
      }
      this.dialogue=config.memory.mode==='publish'?[]:readDialogue(storage(),config.memory.namespace);
      this.message=config.identity.greeting;
      this.lastSpoken=config.identity.greeting;this.lastSpokenAt=Date.now();
      this.neural=config.memory.mode==='publish'?this.neural:(readNeural(storage(),config.memory.namespace)||this.neural);
      this.preferences=config.memory.mode==='publish'?blankPreferences():readPreferences(storage(),config.memory.namespace);
      let saved=config.memory.mode==='publish'?cleanMemory(null):readMemory(storage(),config.memory.namespace);
      let loadedCortex=config.memory.mode==='publish'?null:readCortex(storage(),config.memory.namespace);
      // The Studio always starts from its last published snapshot; no local drafts
      // survive a refresh unless the user explicitly publishes via GitHub.
      if(config.memory.remoteSnapshot&&(config.memory.mode==='publish'||!Object.keys(saved.brain).length)){
        const published=await readPublicSnapshot(config.memory.remoteSnapshot,{pageUrl:location.href});
        if(published?.brain&&typeof published.brain==='object'){
          saved=cleanMemory(published);
          if(published.preferences)this.preferences=cleanPreferences(published.preferences);
          if(published.behavior)loadedCortex=cleanCortex(published.behavior);
          if(published.neural){
            const restored=restoreNeuralModel(published.neural);
            if(restored)this.neural=upgradeNeuralSeed(restored);
          }
        }
      }
      if(!this.isConnected)return;
      this.configReady=true;
      this.cortex=createCortexRuntime(loadedCortex||createCortex());
      this.cortexStart=Date.now();
      this.state.brain=passTime(restoreBrain(saved.brain),Math.max(0,Date.now()-(saved.brain?.lastSeen||Date.now())));
      this.applySkin();
      if(saved.position){this.state.position=saved.position;if(!this.desktop)this.moveTo(saved.position.x,saved.position.y);}
      this.render();
    }).catch(()=>{this.message='Configuração não disponível; usando padrão seguro.';if(this.isConnected)this.renderHeader();});
    this.timer = setInterval(() => { this.state.brain = passTime(this.state.brain, 10000); this.save();this.onIdleTick(); this.renderHeader(); }, 10000);
  }
  disconnectedCallback(){
    if(this.timer)clearInterval(this.timer);
    if(this.wheelTimer)clearTimeout(this.wheelTimer);
    if(this.speechTimer)clearTimeout(this.speechTimer);
    this.modelAbort?.abort();this.modelSequence++;
    if(this.expressionTimer)clearTimeout(this.expressionTimer);
    if(this.observeTimer)clearTimeout(this.observeTimer);
    if(this.observer)this.observer.disconnect();
    if(this.routeHandler){window.removeEventListener('hashchange',this.routeHandler);window.removeEventListener('popstate',this.routeHandler);}
    if(this.studioHandler)window.removeEventListener('alquimago:studio-context',this.studioHandler);
    if(this.activityHandler)window.removeEventListener('alquimago:activity',this.activityHandler);
    if(this.publishDialogHandler)window.removeEventListener('alquimago:publish-dialog',this.publishDialogHandler);
    if(this.pointerOverHandler)document.removeEventListener('pointerover',this.pointerOverHandler);
    if(this.pointerOutHandler)document.removeEventListener('pointerout',this.pointerOutHandler);
    this.cancelProjectHover();
    if(this.skinAdapter?.dispose)this.skinAdapter.dispose();
    this.closeOrb();
    this.timer=null;this.observer=null;this.observeTimer=null;
  }
  onIdleTick(){
    if(!this.configReady||!this.isConnected)return;
    const now=Date.now(),page=this.activePage||{};
    const issues=this.suggestions.filter(x=>!['route','studio','editor'].includes(x.id));
    const active=document.activeElement;
    const typing=active instanceof Element&&!!active.closest('input,textarea,select,[contenteditable="true"]');
    const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    const info={
      route:this.desktop?'desktop':page.route||'home',
      issues:issues.length,
      hasBrokenMedia:(page.brokenImages||0)>0,
      hasAccessibilityIssue:(page.missingAlt||0)>0,
      visibleProject:!!this.selectedProject,
      working:!!this.studioInfo?.editing,
      editorVisible:!!this.studioInfo?.editing,
      panelOpen:this.state.open,
      userBusy:typing||now-this.lastUserActivity<25000,
      idleSeconds:(now-this.lastUserActivity)/1000,
      hidden:document.hidden,
      reducedMotion:reduced,
      playful:this.behaviorMode==='brincalhao',
      quiet:this.behaviorMode==='silencioso',
      brain:this.state.brain,
      enabled:this.behaviorAllowed&&now-this.cortexStart>45000,
      cooldownMs:this.config.behavior.minIntervalMs,
      dailyLimit:this.config.behavior.maxPerDay
    };
    const outcome=tickCortex(this.cortex,info,now);
    if(!outcome.action)return;
    const action=outcome.action;
    const topic=issues[0]?.title||'a apresentação do projeto';
    const lines={
      dica:'Percebi algo sobre '+topic+'. Posso mostrar uma sugestão.',
      observar:'Estou observando a estrutura pública desta página.',
      investigar:'Esta seção tem detalhes que podemos explorar juntos.',
      acenar:'Saudações do seu familiar arcano! ✧',
      brilhar:'Uma pequena runa se acendeu. ✦',
      brincar:'Que tal brincar com o orbe arcano?',
      meditar:'Vou recuperar um pouco de energia arcana.',
      celebrar:'Uma etapa concluída merece uma pequena celebração. ✦',
      curiosidade:'Encontrei uma ideia que vale investigar.',
      pensar:'Tenho algumas alternativas para a próxima melhoria.',
      estudar:'Vou observar o que já está apresentado publicamente.',
      poção:'Uma poção de criatividade está borbulhando. ⚗',
      alongar:'Uma pequena pausa entre projetos pode ser interessante.',
      descansar:'Vou repousar um instante.',
      acolher:'Se precisar, estou por aqui para sugerir melhorias.'
    };
    this.lastAutoDecision={action,context:info.route,at:now,used:false};
    if(['dica','brincar'].includes(action))
      this.pendingQuestion={kind:action==='brincar'?'play':'page-insight',at:now};
    this.lastSpoken=lines[action]||outcome.reason||'Um novo pensamento arcano.';
    this.lastSpokenAt=now;
    this.message=this.lastSpoken;
    this.updateThought();
    this.save();
  }
  closeOrb(){
    if(this.orbFrame)cancelAnimationFrame(this.orbFrame);
    this.orbFrame=0;this.orbState=null;
    if(this.orbField)this.orbField.remove();
    this.orbField=null;this.orbElement=null;
  }
  startOrb(){
    if(this.orbField){this.closeOrb();return;}
    if(!this.config.behavior.toy)return;
    const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    const field=document.createElement('div');field.className='arcane-orb-field';
    field.setAttribute('aria-label','Área de brincadeira do orbe arcano');
    const ball=document.createElement('button');ball.type='button';
    ball.className='arcane-orb';ball.setAttribute('aria-label','Arremessar o orbe arcano');
    ball.textContent='✦';
    const close=document.createElement('button');close.type='button';
    close.className='orb-close';close.textContent='×';close.setAttribute('aria-label','Guardar orbe');
    close.addEventListener('click',()=>this.closeOrb());
    field.append(ball,close);this.shadowRoot.querySelector('.shell').appendChild(field);
    this.orbField=field;this.orbElement=ball;this.orbState=createOrb();
    this.orbStopAt=performance.now()+20000;
    const render=()=>{if(this.orbElement&&this.orbState)
      this.orbElement.style.transform='translate('+Math.round(this.orbState.x-11)+'px,'+
      Math.round(this.orbState.y-11)+'px)';};
    render();
    let down=null;
    ball.addEventListener('pointerdown',e=>{
      e.preventDefault();e.stopPropagation();
      ball.setPointerCapture(e.pointerId);
      const rect=field.getBoundingClientRect();
      down={x:e.clientX,y:e.clientY,t:performance.now(),rect};
    });
    ball.addEventListener('pointermove',e=>{
      if(!down||!this.orbState)return;
      e.preventDefault();e.stopPropagation();
      this.orbState.x=Math.max(this.orbState.radius,Math.min(165-this.orbState.radius,e.clientX-down.rect.left));
      this.orbState.y=Math.max(this.orbState.radius,Math.min(112-this.orbState.radius,e.clientY-down.rect.top));
      render();
    });
    ball.addEventListener('pointercancel',()=>{down=null;});
    ball.addEventListener('pointerup',e=>{
      e.preventDefault();e.stopPropagation();
      if(down&&this.orbState){
        const elapsed=Math.max(40,performance.now()-down.t);
        const velocityX=(e.clientX-down.x)/elapsed*18;
        const velocityY=(e.clientY-down.y)/elapsed*18;
        this.orbState=tossOrb(this.orbState,
          Math.abs(velocityX)<.5?4:velocityX,
          Math.abs(velocityY)<.5?-7:velocityY);
        this.orbStopAt=performance.now()+18000;
      }
      down=null;
    });
    let previous=performance.now();
    const frame=now=>{
      if(!this.orbField||!this.isConnected)return;
      if(now>=this.orbStopAt){this.closeOrb();return;}
      if(!document.hidden&&!reduced&&!down){
        const dt=Math.min(2,(now-previous)/16.667);
        this.orbState=stepOrb(this.orbState,165,112,dt);
        render();
      }
      previous=now;this.orbFrame=requestAnimationFrame(frame);
    };
    this.orbFrame=requestAnimationFrame(frame);
    this.message='Orbe arcano invocado! Arraste e solte para arremessar.';
    this.renderHeader();
  }
  applySkin(){
    const skin=this.skin||normalizeSkin(null);
    const url=skin.src?safeSkinUrl(skin,location.href):null;
    if(this.skinAdapter?.dispose){try{this.skinAdapter.dispose()}catch{/* optional renderer */}}
    this.skinAdapter=null;
    this.$character.replaceChildren();
    if(skin.type==='image'&&url){
      const img=document.createElement('img');
      img.src=url;img.alt='';
      img.className='arcane-skin-image';
      img.decoding='async';
      this.$character.appendChild(img);
      return;
    }
    if(skin.type==='model3d'&&url){
      // The host (React/desktop) may register a Three.js renderer that accepts
      // glTF/GLB and uses named morph targets. No library is loaded implicitly.
      const adapter=window.AlquimagoSkinRenderers?.model3d;
      if(typeof adapter==='function'){
        try{
          const instance=adapter({host:this.$character,url,shapeKeys:skin.shapeKeys});
          if(instance&&typeof instance==='object')this.skinAdapter=instance;
          return;
        }catch{/* fall back to built-in SVG */ }
      }
    }
    this.$character.innerHTML=SVG;
  }
  projectPointerOver(e){
    if(this.desktop||!this.observeProjects||!this.config.features.pageAudit)return;
    const target=e.target;
    if(!(target instanceof Element))return;
    const card=target.closest('[data-alquimago-project]');
    if(!card||card===this.hoverSeen)return;
    if(card.closest('alquimago-familiar')||target.closest('input,textarea,[contenteditable="true"]'))return;
    this.cancelProjectHover();
    const meta=projectMeta(card);
    if(!meta)return;
    this.lastUserActivity=Date.now();
    const key=projectIdentity(meta);
    if(!shouldCommentProject(this.hoverCount,key,Date.now(),{cooldownMs:this.config.proactive.cooldownMs}))return;
    this.hoverSeen=card;
    this.hoverStart=setTimeout(async()=>{
      this.hoverStart=null;
      if(!this.isConnected||!card.isConnected||document.hidden||!this.observeProjects)return;
      const advice=projectAdvice(meta);if(!advice)return;
      const cover=card.querySelector('img');
      if(cover){
        const metrics=await inspectCover(cover,{pageUrl:location.href});
        if(metrics){
          advice.metrics=metrics;
          advice.tips=[...new Set([imageMetricAdvice(metrics),...advice.tips])].slice(0,4);
          advice.comment+=' '+imageMetricAdvice(metrics);
          advice.disclaimer='Observações de cor/luz por amostragem local e metadados; não há reconhecimento semântico de objetos.';
        }
      }
      if(!this.isConnected||!card.isConnected)return;
      advice.orderedTips=rankTips(advice.tips,advice.category,this.preferences);
      this.selectedProject=advice;
      this.hoverCount[key]=Date.now();
      this.lastSpoken=advice.comment;
      this.lastSpokenAt=Date.now();
      this.message='Dica sobre '+advice.title;
      this.updateThought();
      if(this.state.open&&this.state.tab===1)this.render();
    },this.config.proactive.delayMs);
  }
  cancelProjectHover(){
    if(this.hoverStart){clearTimeout(this.hoverStart);this.hoverStart=null;}
    this.hoverSeen=null;
  }
  projectPointerOut(e){
    if(!(e.target instanceof Element))return;
    const card=e.target.closest('[data-alquimago-project]');
    if(card&&card===this.hoverSeen&&!card.contains(e.relatedTarget))this.cancelProjectHover();
  }
  startObservation(){
    if(this.desktop||!this.isConnected)return;
    this.routeHandler=()=>this.inspectPage(true);
    this.pointerOverHandler=e=>this.projectPointerOver(e);
    this.pointerOutHandler=e=>this.projectPointerOut(e);
    document.addEventListener('pointerover',this.pointerOverHandler,{passive:true});
    document.addEventListener('pointerout',this.pointerOutHandler,{passive:true});
    window.addEventListener('hashchange',this.routeHandler);
    window.addEventListener('popstate',this.routeHandler);
    if(typeof MutationObserver!=='undefined'){
      this.observer=new MutationObserver(()=>{
        if(this.observeTimer)return;
        this.observeTimer=setTimeout(()=>{this.observeTimer=null;this.inspectPage(false);},1400);
      });
      this.observer.observe(document.body,{childList:true,subtree:true});
    }
    this.inspectPage(true);
  }
  inspectPage(navigated=false){
    if(this.desktop||!this.isConnected)return;
    const next=readPublicPage(document,location.href);
    if(!navigated&&samePageSignature(next,this.activePage))return;
    const routeChanged=this.activePage?.signature!==next.signature;
    this.activePage=next;
    this.audit=auditPage();
    this.suggestions=suggestionsFromPage(next);
    if(this.studioInfo?.editing){
      this.suggestions.unshift({
        id:'studio',title:'Studio • '+this.studioInfo.section,
        description:'Projeto em edição com '+this.studioInfo.projects+' projetos e '+this.studioInfo.pages+' páginas personalizadas. Revise a prévia antes da publicação.'
      });
      this.suggestions=this.suggestions.slice(0,6);
    }
    if(routeChanged){
      this.message='Reconheci a página: '+next.route+'. Tenho '+this.suggestions.length+' sugestão(ões).';
    }
    this.updateThought();
    if(this.state.open&&this.state.tab===1)this.render();
    else this.renderHeader();
  }
  updateThought(){
    if(!this.$thought)return;
    const tip=this.suggestions.find(x=>!['route','editor'].includes(x.id))||this.suggestions[0];
    const spoken=this.lastSpoken&&Date.now()-this.lastSpokenAt<14500?this.lastSpoken:null;
    this.$thought.textContent=spoken?spoken.slice(0,90):tip?'✦ '+tip.title:'';
    this.$thought.hidden=!!this.state.open&&this.state.tab===5||(!spoken&&!tip);
  }
  save(){
    if(this.config.memory.mode==='publish')return;
    writeMemory(storage(),{brain:this.state.brain,position:this.state.position},this.config.memory.namespace);
    writeCortex(storage(),this.config.memory.namespace,this.cortex.state);
  }
  snapshot(){return this.configReady?{...JSON.parse(exportBackup({brain:this.state.brain,position:this.state.position})),neural:serializeNeuralModel(this.neural),preferences:cleanPreferences(this.preferences),behavior:cleanCortex(this.cortex.state),selectedSkin:this.selectedSkin}:null;}
  moveTo(x, y) {
    const maxX = Math.max(0, innerWidth - 125), maxY = Math.max(0, innerHeight - 166);
    const left = Math.max(0, Math.min(maxX, x)), top = Math.max(0, Math.min(maxY, y));
    this.style.left = left + 'px'; this.style.top = top + 'px'; this.style.right = 'auto'; this.style.bottom = 'auto';
    this.state.position = { x: left, y: top };
  }
  onPointerDown(e) {
    if (e.button !== 0) return;
    this.lastUserActivity=Date.now();
    const box=this.getBoundingClientRect();
    this.pointerStart={x:e.clientX,y:e.clientY,left:box.left,top:box.top,dx:0,dy:0,moved:false};
    if(this.desktop&&e.altKey){
      try{void window.__TAURI__?.window?.getCurrentWindow()?.startDragging();}catch{/* platform optional */}
    }
    this.$character.setPointerCapture(e.pointerId);
  }
  onPointerMove(e) {
    if(!this.pointerStart){
      if(e.pointerType==='mouse'&&e.buttons===0){
        const rect=this.$character.getBoundingClientRect();
        const result=updateHeadStroke(this.hoverStroke,{
          x:e.clientX-rect.left,
          head:e.clientY-rect.top<rect.height*.71,
          pressed:false,
          time:Date.now()
        });
        this.hoverStroke=result.state;
        if(result.triggered){this.action('stroke');this.spawnAffection();}
      }
      return;
    }
    const dx=e.clientX-this.pointerStart.x,dy=e.clientY-this.pointerStart.y;
    this.pointerStart.dx=dx;this.pointerStart.dy=dy;
    // Short strokes are caresses. Intentional longer drags relocate the mascot.
    if(this.config.features.dragging&&Math.hypot(dx,dy)>72)this.pointerStart.moved=true;
    if(this.pointerStart.moved&&!this.desktop)this.moveTo(this.pointerStart.left+dx,this.pointerStart.top+dy);
  }
  onPointerUp(e) {
    const data = this.pointerStart; this.pointerStart = null;
    if (!data) return;
    if(data.moved){if(!this.desktop)this.save();}
    else if(Math.abs(data.dx)>13&&Math.abs(data.dx)<72&&Math.abs(data.dy)<58){this.action('stroke');this.spawnAffection();}
    else {this.action('pet');this.spawnAffection();if(!this.desktop){this.state.tab=5;this.state.open=true;this.render();}}
    if (this.$character.hasPointerCapture(e.pointerId)) this.$character.releasePointerCapture(e.pointerId);
  }
  spawnAffection(){
    const node=document.createElement('span');
    node.className='affection-burst';node.textContent='♥ ✦ ♥';
    this.$character.appendChild(node);
    setTimeout(()=>node.remove(),950);
  }
  sendMessage(text){
    this.lastUserActivity=Date.now();
    const user=safeChatText(text);
    if(!user)return;
    const command=recognizeStudioCommand(user,this.config.commands.publishPhrase);
    if(command==='prepare-publish'){
      // Only an explicit submit inside the familiar can request the existing
      // publisher. The phrase is never an authentication factor or approval.
      const allowed=!this.desktop&&this.config.memory.mode==='publish'&&this.studioInfo?.editing===true;
      const reply=allowed?
        'Encontrei o comando! ⚗ Vou abrir a revisão da publicação. Confira as alterações e confirme no Studio. A frase não substitui sua autorização GitHub.':
        'Esse comando está disponível apenas no Local Studio desbloqueado. Ele não publica sozinho.';
      this.dialogue=[...this.dialogue,{role:'user',text:user},{role:'familiar',text:reply}].slice(-24);
      this.lastUserText='';this.lastNeuralIntent='';this.pendingQuestion=null;
      this.message=reply;this.lastSpoken=reply;this.lastSpokenAt=Date.now();
      this.state.tab=5;this.state.open=true;this.render();
      if(allowed)window.dispatchEvent(new CustomEvent('alquimago:request-publish',{
        detail:{source:'chat',action:'review-only'}
      }));
      return;
    }
    const prediction=neuralPredict(this.neural,user);
    this.lastUserText=user;this.lastNeuralIntent=prediction.intent;
    const response=respondToChat(user,{
      pending:this.pendingQuestion,
      knowledge:this.knowledge,lastProjectId:this.lastProjectId,
      focusTitle:this.selectedProject?.title||'',
      neuralIntent:prediction.confidence>=.55?prediction.intent:null,
      name:this.config.identity.name,mood:currentMood(this.state.brain),
      level:levelFromXp(this.state.brain.xp),xp:this.state.brain.xp,
      page:this.activePage?.route||'desktop',suggestions:this.suggestions
    });
    const canGenerate=this.modelAvailable&&this.modelEnabled&&!this.modelBusy&&
      !['private','math','followup','decline','clarify','navigate','empty','project-fact','project-list','project-info'].includes(response.intent)&&
      user.length>=3;
    if(canGenerate){
      const history=this.dialogue.slice(-8);
      const project=this.knowledge.projects.find(p=>p.id===(response.projectId||this.lastProjectId))||null;
      const request=++this.modelSequence;
      this.modelBusy=true;
      this.pendingQuestion=null;
      this.lastUserText='';this.lastNeuralIntent='';
      this.dialogue=[...this.dialogue,{role:'user',text:user},
        {role:'familiar',text:'Consultando o modelo de linguagem…'}].slice(-24);
      this.state.tab=5;this.state.open=true;this.render();
      this.modelAbort?.abort();
      const controller=new AbortController();this.modelAbort=controller;
      const timer=setTimeout(()=>controller.abort(),18000);
      void askLanguageModel({
        endpoint:this.config.llm.endpoint,prompt:user,history,project,
        pageUrl:location.href,signal:controller.signal
      }).then(answer=>{
        if(!this.isConnected||request!==this.modelSequence)return;
        this.dialogue[this.dialogue.length-1]={role:'familiar',text:answer.reply};
        this.message=answer.reply;
        this.lastSpoken=answer.reply;this.lastSpokenAt=Date.now();
      }).catch(error=>{
        if(!this.isConnected||request!==this.modelSequence)return;
        const reason=error?.name==='AbortError'?
         'A consulta demorou demais.':error instanceof Error?error.message:'Não consegui conectar à IA.';
        const fallback=reason+' Resposta local: '+response.reply;
        this.dialogue[this.dialogue.length-1]={role:'familiar',text:fallback};
        this.message=fallback;
      }).finally(()=>{
        clearTimeout(timer);
        if(request===this.modelSequence&&this.isConnected){
          this.modelBusy=false;this.render();
          const log=this.$content.querySelector('.chat-history');
          if(log)log.scrollTop=log.scrollHeight;
        }
      });
      return;
    }
    this.pendingQuestion=pendingFromReply(response);
    if(response.projectId)this.lastProjectId=response.projectId;
    if(['math','followup','decline','clarify'].includes(response.intent)){
      this.lastUserText='';this.lastNeuralIntent='';
    }
    if(response.store!==false&&response.intent!=='empty'&&typeof this.language.responses?.[response.intent]==='string'){
      response.reply=this.language.responses[response.intent].replace(/\{(name|xp|page|level)\}/g,(_,key)=>({
        name:this.config.identity.name,xp:String(this.state.brain.xp),
        page:this.activePage?.route||'desktop',level:String(levelFromXp(this.state.brain.xp))
      })[key]||'');
    }
    if(response.action)this.action(response.action);
    let destination=null;
    if(response.intent==='navigate'&&!this.desktop){
      const names={galeria:'portfolio',portfolio:'portfolio',contato:'contato',sobre:'sobre',inicio:'inicio',home:'inicio'};
      const hash=names[response.target];
      const options=findSameOriginLinks();
      destination=options.find(link=>new URL(link.href).hash.toLowerCase().includes('/'+hash))||null;
      response.reply=destination?'Encontrei '+response.target+'. Abrindo esta seção do site…':'Não encontrei '+response.target+' na navegação disponível. Você pode conferir a aba Rotas.';
    }
    if(response.store===false){this.lastUserText='';this.lastNeuralIntent='';}
    if(response.store!==false){
      this.dialogue=[...this.dialogue,{role:'user',text:user},{role:'familiar',text:response.reply}].slice(-24);
      if(this.config.memory.mode!=='publish')writeDialogue(storage(),this.config.memory.namespace,this.dialogue);
    }else{
      this.dialogue=[...this.dialogue,{role:'familiar',text:response.reply}].slice(-24);
    }
    this.message=response.reply;
    this.lastSpoken=response.reply;this.lastSpokenAt=Date.now();
    if(this.skinAdapter?.setExpression){
      this.skinAdapter.setExpression('talk');
      clearTimeout(this.speechTimer);
      this.speechTimer=setTimeout(()=>this.skinAdapter?.setExpression(skinExpression(currentMood(this.state.brain))),850);
    }
    this.state.tab=5;this.state.open=true;this.render();
    const log=this.$content.querySelector('.chat-history');
    if(log)log.scrollTop=log.scrollHeight;
    this.$content.querySelector('input[name="message"]')?.focus();
    if(destination&&new URL(destination.href).origin===location.origin)location.assign(destination.href);
  }
    action(name,detail=''){
    this.lastUserActivity=Date.now();
    const before=this.state.brain.xp;
    const pageKey=name==='explore'?encodeURIComponent(routeSignature(location.href)).slice(0,120):name==='publish'?detail:'';
    this.state.brain=applyAction(this.state.brain,name,Date.now(),pageKey);
    const earned=this.state.brain.xp-before;
    const messages={stroke:'Hmm… mais um carinho no chapéu! ✧',brew:'Elixir alquímico preparado! ✨',explore:'Nova rota estudada. ✦',publish:'Projeto publicado! Magia de verdade. ✦'};
    this.message=(this.config.messages[name]||messages[name]||'Runas reorganizadas.')+(earned?' +'+earned+' XP':'');
    this.save();this.render();
    if(['pet','stroke'].includes(name)&&this.skinAdapter?.setExpression){
      this.skinAdapter.setExpression('pet');
      clearTimeout(this.expressionTimer);
      this.expressionTimer=setTimeout(()=>this.skinAdapter?.setExpression(skinExpression(currentMood(this.state.brain))),900);
    }
  }
  toggle() { if (this.desktop) return; this.state.open = !this.state.open; this.render(); }
  renderHeader() {
    const mood=currentMood(this.state.brain);
    this.shadowRoot.getElementById('wizard-title').textContent='✦ '+this.config.identity.name+' · v0.8.1';
    this.shadowRoot.getElementById('wizard-label').textContent='✦ '+this.config.identity.name;
    this.shadowRoot.getElementById('wizard-subtitle').textContent=this.config.identity.subtitle+(this.config.memory.mode==='publish'?' · rascunho até publicar':'');
    this.style.setProperty('--violet',this.config.appearance.accent);
    this.style.setProperty('--gold',this.config.appearance.gold);
    this.shadowRoot.getElementById('mood').textContent = mood;
    this.shadowRoot.getElementById('level').textContent = `Nível ${levelFromXp(this.state.brain.xp)}`;
    this.$character.dataset.mood = mood;
    if(this.skinAdapter?.setExpression){try{this.skinAdapter.setExpression(skinExpression(mood))}catch{/* optional 3D adapter */}}
    this.$feedback.textContent = this.message || MOODS[mood];
    this.updateThought();
  }
  render() {
    const flags=this.config.features;
    const allowed=[flags.actions,flags.pageAudit,flags.routes,flags.projectFiles,flags.assistants,flags.dialogue];
    if(!allowed[this.state.tab])this.state.tab=[5,1,0].find(index=>allowed[index])??0;
    this.setAttribute('data-position',this.config.appearance.position);
    this.$panel.classList.toggle('open', this.state.open);
    this.renderHeader();
    this.$tabs.replaceChildren();
    for(const item of MAIN_TABS.filter(item=>allowed[item.index])){
      const button=document.createElement('button');
      button.type='button';
      button.className='tab'+(item.index===this.state.tab?' selected':'');
      button.dataset.tab=String(item.index);
      button.setAttribute('aria-pressed',String(item.index===this.state.tab));
      button.textContent=this.language.tabs[item.key]||item.key;
      this.$tabs.appendChild(button);
    }
    this.$content.replaceChildren();
    const add = (html) => { const node = document.createElement('div'); node.innerHTML = html; this.$content.appendChild(node); return node; };
    if (this.state.tab === 0) {
      const b = this.state.brain;
      add(`<div class="line"><span>Energia mágica</span><small>${Math.round(b.energy)}%</small></div><div class="stat"><div class="bar" style="width:${b.energy}%"></div></div><div class="line"><span>Curiosidade</span><small>${Math.round(b.curiosity)}%</small></div><div class="stat"><div class="bar" style="width:${b.curiosity}%"></div></div><div class="line"><span>Foco</span><small>${Math.round(b.focus)}%</small></div><div class="stat"><div class="bar" style="width:${b.focus}%"></div></div><div class="muted">${b.interactions} interações • ${b.xp} XP</div><p class="muted">Arraste o dedo suavemente sobre o personagem para fazer carinho; arraste mais longe para movê-lo. Carinhos não geram XP infinito.</p><div class="actions"><button class="action" data-action="pet">♡ Carinho</button><button class="action" data-action="play">✧ Brincar</button><button class="action" data-action="brew">⚗ Poção</button><button class="action" data-action="focus">◈ Foco</button><button class="action" data-action="rest">☾ Meditar</button><button class="action" data-action="orb-toy">◉ Orbe arcano</button></div>
      <details class="arcane-advanced arcane-cortex">
      <summary>🧠 Cérebro e autonomia</summary>
      <p class="muted" id="cortex-summary">Rede pulsada local, com decisões e memória comportamental.</p>
      <label class="arcane-toggle"><input type="checkbox" id="toggle-cortex"> Permitir iniciativas discretas</label>
      <label class="arcane-control-label">Temperamento
        <select id="cortex-mode"><option value="silencioso">Silencioso</option><option value="equilibrado">Equilibrado</option><option value="brincalhao">Brincalhão</option></select>
      </label>
      <p class="muted" id="cortex-last">Nenhuma iniciativa recente.</p>
      <div class="actions"><button class="action" data-action="cortex-like">✓ Gostei</button>
      <button class="action" data-action="cortex-dislike">✕ Menos disso</button></div>
      <p class="muted">Sem controlar navegação, publicação ou campos do site. Pausado quando há interação ativa.</p>
      </details><details class="arcane-advanced"><summary>⚙ Ajustes e ferramentas</summary>
      <div class="actions"><button class="action" data-action="go-routes">Rotas internas</button>
      <button class="action" data-action="go-files">Arquivos públicos</button>
      <button class="action" data-action="go-ai">Continuar com IA</button></div>
      <label class="arcane-toggle"><input type="checkbox" id="toggle-proactive"> Comentários proativos em projetos</label>
      <div class="actions"><button class="action" data-action="export-memory">Exportar memória</button>
      <button class="action" data-action="import-memory">Restaurar</button>
      <button class="action" data-action="reset-memory">Zerar dados</button></div>
      <div class="muted">Aparência: <span id="arcane-skin-label"></span></div>
      </details>`);if(this.config.memory.mode==='publish')add('<div class="session-note">Estas mudanças só serão mantidas se você publicar. <button type="button" class="action primary" data-action="open-publish">Publicar alterações</button> Recarregar descarta o rascunho.</div>');
    } else if (this.state.tab === 1) {
      if (this.desktop) add('<p class="muted">No desktop, o familiar não lê outras janelas. A leitura de projetos será um módulo futuro com permissão explícita.</p>');
      else {
        this.audit=auditPage();
        const a = this.audit;
        const wrapper = add(`<div class="line"><b>Diagnóstico superficial</b></div><div class="muted" id="page-title"></div><div class="line"><span>Elementos de navegação</span><b>${a.links}</b></div><div class="line"><span>Botões</span><b>${a.buttons}</b></div><div class="line"><span>Imagens sem atributo alt</span><b>${a.missingAlt}</b></div><div class="line"><span>IDs duplicados</span><b>${a.duplicateIds}</b></div><div class="line"><span>Imagens com falha</span><b>${a.brokenImages}</b></div><div class="actions"><button class="action" data-action="audit">↻ Atualizar</button><button class="action primary" data-action="copy-audit">Copiar relatório</button></div>`);
        wrapper.querySelector('#page-title').textContent=a.title;
        const intro=document.createElement('p');intro.className='muted';intro.textContent='Análise contextual: somente estrutura da página e rota atual, nunca valores digitados ou mensagens.';this.$content.appendChild(intro);
        if(this.selectedProject){
          const tip=this.selectedProject;
          const card=document.createElement('section');card.className='insight';
          const heading=document.createElement('b');heading.textContent='✦ '+tip.label;
          const explanation=document.createElement('p');explanation.textContent=tip.comment;
          const details=document.createElement('p');details.className='muted';details.textContent=tip.disclaimer;
          card.append(heading,explanation,details);
          for(const point of (tip.orderedTips||rankTips(tip.tips,tip.category,this.preferences)).slice(0,3)){
            const row=document.createElement('p');row.className='muted';row.textContent='• '+point.text;card.appendChild(row);
          }
          const actions=document.createElement('div');actions.className='actions';
          for(const [useful,label] of [[true,'✓ Dica útil'],[false,'✕ Não priorizar']] ){
            const rate=document.createElement('button');rate.type='button';rate.className='action';
            rate.dataset.tipFeedback=useful?'yes':'no';
            rate.dataset.tipIndex=String((tip.orderedTips||rankTips(tip.tips,tip.category,this.preferences))[0]?.index??0);
            rate.textContent=label;actions.appendChild(rate);
          }
          card.appendChild(actions);
          const copy=document.createElement('button');copy.className='action';copy.type='button';
          copy.dataset.action='copy-project-advice';copy.textContent=this.language.ui.copy;
          card.appendChild(copy);
          this.$content.appendChild(card);
        }
        const title=document.createElement('div');title.className='line';title.innerHTML='<b>Sugestões do familiar</b>';this.$content.appendChild(title);
        for(const [i,tip] of this.suggestions.entries()){
          const box=document.createElement('div');box.className='insight';
          const heading=document.createElement('b');heading.textContent='✦ '+tip.title;
          const detail=document.createElement('span');detail.textContent=tip.description;
          const copy=document.createElement('button');copy.type='button';copy.className='action';copy.dataset.insight=String(i);copy.textContent='Pedir ajuda à IA ↗';copy.style.marginTop='7px';
          box.append(heading,detail,document.createElement('br'),copy);this.$content.appendChild(box);
        }
        const explore=document.createElement('button');explore.type='button';explore.className='action primary';explore.dataset.action='explore';explore.textContent='✧ Explorar esta rota';this.$content.appendChild(explore);
      }
    } else if (this.state.tab === 2) {
      add('<button type="button" class="action" data-action="go-actions">← Voltar às interações</button>');
      if (this.desktop) add('<p class="muted">Abra a versão web do Alquimago no seu projeto React para navegar pelas páginas desse site.</p>');
      else {
        this.links = findSameOriginLinks();
        add(`<p class="muted">Rotas do site atual. A navegação será feita somente quando você escolher.</p>`);
        if (!this.links.length) add('<p>Nenhuma outra rota encontrada.</p>');
        this.links.forEach((link, i) => {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'list-item'; button.dataset.navigate = String(i);
          button.textContent = link.label || link.href;
          button.title = link.href;
          this.$content.appendChild(button);
        });
      }
    } else if(this.state.tab===3){
      add('<button type="button" class="action" data-action="go-actions">← Voltar às interações</button>');
      if(this.desktop)add('<p class="muted">Escolha uma pasta para analisar textos autorizados. Nenhuma pasta é lida automaticamente.</p><div class="actions"><button class="action primary" data-action="choose-folder">Escolher pasta</button></div>');
      else add('<p class="muted">Só os arquivos públicos listados na configuração do projeto são acessados.</p><div class="actions"><button class="action primary" data-action="read-files">Ler arquivos</button></div>');
      if(!this.projectFiles.length)add('<p class="muted">Nenhum arquivo examinado ainda.</p>');
      for(const entry of this.projectFiles){
        const item=document.createElement('div');item.className='line';
        const label=document.createElement('span');label.textContent=entry.file.slice(0,75);
        const result=document.createElement('small');result.textContent=entry.status==='read'?String(entry.bytes)+' bytes':entry.status;
        item.append(label,result);this.$content.appendChild(item);
      }
    } else if(this.state.tab===4){
      add('<button type="button" class="action" data-action="go-actions">← Voltar às interações</button>');
      add('<p class="muted">Para questões que ultrapassem meu diálogo local, posso preparar um resumo e abrir ChatGPT ou Gemini, sempre por escolha do usuário.</p><div class="actions"><button class="action primary" data-action="chatgpt">ChatGPT ↗</button><button class="action" data-action="gemini">Gemini ↗</button></div>');
    } else if(this.state.tab===5){
      const history=document.createElement('div');
      history.className='chat-history';
      history.setAttribute('role','log');
      history.setAttribute('aria-label','Diálogo local');
      const lines=this.dialogue.length?this.dialogue:[{role:'familiar',text:this.config.identity.greeting}];
      for(const item of lines){
        const bubble=document.createElement('div');
        bubble.className='chat-bubble '+(item.role==='user'?'from-user':'from-familiar');
        bubble.textContent=item.text;
        history.appendChild(bubble);
      }
      this.$content.appendChild(history);
      add('<form id="alquimago-chat-form" class="chat-form" autocomplete="off"><label for="alquimago-message" class="sr-only">Mensagem para o familiar</label><input name="message" id="alquimago-message" maxlength="320" placeholder="Converse com seu familiar..." aria-label="Sua mensagem" required><button type="submit" class="chat-send" aria-label="Enviar mensagem">➤</button></form>');
      if(this.pendingQuestion&&Date.now()-this.pendingQuestion.at<300000){
        add('<div class="chat-suggestions" aria-label="Responder à pergunta"><button type="button" data-say="sim">✓ Sim</button><button type="button" data-say="não">✕ Não</button></div>');
      }else{
        add('<div class="chat-suggestions"><button type="button" data-say="OIE!">Olá</button><button type="button" data-say="Como faço carinho?">Carinho</button><button type="button" data-say="Quanto XP tenho?">XP</button><button type="button" data-say="Quanto é 2 + 2?">Matemática</button></div>');
      }
      const teacher=document.createElement('div');teacher.className='neural-teach';
      const lbl=document.createElement('label');lbl.textContent='Ensinar o significado da última mensagem:';
      const chooser=document.createElement('select');chooser.id='alquimago-teach';
      const intentLabels={greeting:'Saudação',identity:'Identidade',status:'XP e status',pet:'Carinho',play:'Brincar',brew:'Poção',rest:'Descanso',navigate:'Navegação',insight:'Sugestão',help:'Ajuda',mood:'Humor',thanks:'Agradecimento'};
      for(const intent of INTENTS){
        const option=document.createElement('option');option.value=intent;option.textContent=this.language.intentLabels?.[intent]||intentLabels[intent]||intent;
        option.selected=intent===this.lastNeuralIntent;chooser.appendChild(option);
      }
      const teach=document.createElement('button');teach.type='button';teach.dataset.action='teach-neural';teach.textContent='Ensinar';
      teach.disabled=!this.lastUserText;
      teacher.append(lbl,chooser,teach);
      const lesson=document.createElement('details');lesson.className='neural-lesson';
      const summary=document.createElement('summary');summary.textContent='✦ Ensinar uma frase';
      lesson.append(summary,teacher);this.$content.appendChild(lesson);
      if(this.modelAvailable){
        const consent=document.createElement('label');
        consent.className='arcane-ai-consent';
        const choice=document.createElement('input');choice.type='checkbox';
        choice.id='toggle-llm';choice.checked=this.modelEnabled;
        choice.disabled=this.modelBusy;
        const details=document.createElement('span');
        details.textContent='Usar IA generativa (opcional). Cada nova pergunta poderá ser enviada ao serviço configurado. Não envie dados privados.';
        consent.append(choice,details);
        this.$content.appendChild(consent);
      }
      const message=document.createElement('p');message.className='muted';
      message.textContent='Cérebro local: 96 entradas · 24 neurônios internos · 12 intenções. Correções ensinadas: '+this.neural.learned+'. Não é uma IA generativa.';
      this.$content.appendChild(message);
      if(this.config.memory.mode==='publish')add('<div class="session-note">As conversas e mudanças de XP são temporárias. Clique em Publicar no Studio para salvar; recarregar descarta o que não foi publicado.</div>');
      history.scrollTop=history.scrollHeight;
    }
    const cortexToggle=this.$content.querySelector('#toggle-cortex');
    if(cortexToggle)cortexToggle.checked=this.behaviorAllowed;
    const cortexMode=this.$content.querySelector('#cortex-mode');
    if(cortexMode)cortexMode.value=this.behaviorMode;
    const cortexStats=this.$content.querySelector('#cortex-summary');
    if(cortexStats){
      const stats=cortexSummary(this.cortex.state);
      cortexStats.textContent=stats.neurons+' neurônios • '+stats.synapses.toLocaleString('pt-BR')+
        ' conexões • '+stats.sensors+' sensores • '+stats.motors+' ações. '+stats.feedback+' aprendizados.';
    }
    const last=this.$content.querySelector('#cortex-last');
    if(last)last.textContent=this.lastAutoDecision?
      'Última iniciativa: '+this.lastAutoDecision.action+'. '+(this.lastAutoDecision.used?'Feedback registrado.':'Diga se foi útil.') :
      'O cérebro ainda não tomou nenhuma iniciativa nesta sessão.';
    const orbButton=this.$content.querySelector('[data-action="orb-toy"]');
    if(orbButton){
      orbButton.textContent=this.orbField?'Guardar orbe':'◉ Orbe arcano';
      if(!this.config.behavior.toy)orbButton.remove();
    }
    for(const button of this.$content.querySelectorAll('[data-action="cortex-like"],[data-action="cortex-dislike"]'))
      button.disabled=!this.lastAutoDecision||this.lastAutoDecision.used;
    const proactivity=this.$content.querySelector('#toggle-proactive');
    if(proactivity)proactivity.checked=this.observeProjects;
    const skinLabel=this.$content.querySelector('#arcane-skin-label');
    if(skinLabel){
      skinLabel.textContent='';
      const select=document.createElement('select');
      select.id='alquimago-skin-choice';
      select.setAttribute('aria-label','Skin do familiar');
      for(const entry of this.skinProfiles){
        const option=document.createElement('option');
        option.value=entry.id;
        option.textContent=entry.label;
        select.appendChild(option);
      }
      select.value=this.selectedSkin;
      skinLabel.appendChild(select);
    }
    const chatInput=this.$content.querySelector('input[name="message"]');
    if(chatInput)chatInput.placeholder=this.language.ui.message;
    const sendButton=this.$content.querySelector('.chat-send');
    if(sendButton)sendButton.setAttribute('aria-label',this.language.ui.send);
    const teachButton=this.$content.querySelector('[data-action="teach-neural"]');
    if(teachButton)teachButton.textContent=this.language.ui.learn;
    const teachLabel=this.$content.querySelector('.neural-teach label');
    if(teachLabel)teachLabel.textContent=this.language.ui.learnTitle;
    const closeButton=this.shadowRoot.getElementById('close-panel');
    if(closeButton)closeButton.setAttribute('aria-label',this.language.ui.close);
    if(this.config.memory.mode==='publish'){
      const reset=this.$content.querySelector('[data-action="reset-memory"]');
      if(reset)reset.textContent='Zerar rascunho do mago';
    }
    if(!flags.memoryTools)this.$content.querySelectorAll('[data-action="export-memory"],[data-action="import-memory"],[data-action="reset-memory"]').forEach(button=>button.remove());
  }
  createPrompt() {
    const a = this.desktop ? null : auditPage();
    return ['Sou o Alquimago, um familiar digital local. Preciso de assistência para o projeto do usuário.',
      'Contexto: ' + (a ? `${a.title} (${location.origin}${a.path})` : 'Aplicativo desktop Alquimago'),
      a ? `Diagnóstico básico: ${a.links} links, ${a.buttons} botões, ${a.images} imagens, ${a.missingAlt} imagens sem alt, ${a.duplicateIds} IDs repetidos.` : '',
      ...this.suggestions.slice(0,4).map(tip=>'Sugestão de melhoria: '+tip.title+' — '+tip.description),
      this.studioInfo?.editing?'Editor integrado: '+this.studioInfo.section+'; '+this.studioInfo.projects+' projetos; '+this.studioInfo.pages+' páginas.':'',
      this.config.assistant.projectContext?'Contexto: '+this.config.assistant.projectContext:'',
      ...this.config.assistant.guidelines.map(rule=>'Orientação: '+rule),
      ...this.projectFiles.filter(file=>file.status==='read').slice(0,4).map(file=>'Arquivo público '+file.file+': '+file.excerpt.slice(0,700)),
      'Objetivo: primeiro pergunte qual mudança o usuário deseja realizar. Preserve o visual atual até receber instruções.',
      'Não suponha acesso ao repositório nem a arquivos privados. Solicite permissão antes de publicar alterações.'].filter(Boolean).join('\n');
  }
  async copy(text) {
    try { await navigator.clipboard.writeText(text); this.message = 'Resumo copiado! Cole na conversa escolhida.'; }
    catch { this.message = 'Sem acesso à área de transferência. Use o botão em HTTPS ou copie manualmente.'; }
    this.renderHeader();
  }
  onContentClick(e) {
    const button = e.target.closest('button'); if (!button) return;
    if (button.dataset.navigate !== undefined) {
      const link = this.links[Number(button.dataset.navigate)];
      if(link && new URL(link.href).origin===location.origin){location.assign(link.href);this.message='Abrindo '+link.label+'…';this.renderHeader();}
      return;
    }
    if(button.dataset.say){this.sendMessage(button.dataset.say);return;}
    if(button.dataset.insight!==undefined){
      const tip=this.suggestions[Number(button.dataset.insight)];
      if(tip){
        window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
        void this.copy(this.createPrompt()+'\n\nMelhoria solicitada: '+tip.title+' — '+tip.description);
      }
      return;
    }
    if(button.dataset.tipFeedback&&this.selectedProject){
      const i=Number(button.dataset.tipIndex);
      this.preferences=learnTip(this.preferences,this.selectedProject.category,i,button.dataset.tipFeedback==='yes');
      if(this.config.memory.mode!=='publish')writePreferences(storage(),this.config.memory.namespace,this.preferences);
      this.message=button.dataset.tipFeedback==='yes'?'Vou priorizar dicas desse tipo.':'Vou reduzir dicas desse tipo.';
      this.selectedProject.orderedTips=rankTips(this.selectedProject.tips,this.selectedProject.category,this.preferences);
      this.render();return;
    }
    if(button.dataset.action==='cortex-like'||button.dataset.action==='cortex-dislike'){
      const choice=this.lastAutoDecision;
      if(!choice||choice.used)return;
      const positive=button.dataset.action==='cortex-like';
      rewardCortex(this.cortex,choice.action,choice.context,positive?1:-1,Date.now());
      choice.used=true;
      this.lastUserActivity=Date.now();
      this.save();
      this.message=positive?'Aprendi: mais iniciativas como essa.':'Aprendi: menos desse comportamento.';
      this.render();return;
    }
    if(button.dataset.action==='orb-toy'){
      this.lastUserActivity=Date.now();
      this.startOrb();this.render();return;
    }
    const action = button.dataset.action;
    if (!action) return;
    if (['pet','stroke','play','brew','focus','rest','explore'].includes(action)) return this.action(action);
    if(['go-routes','go-files','go-ai','go-actions'].includes(action)){
      const target={ 'go-routes':2,'go-files':3,'go-ai':4,'go-actions':0 }[action];
      this.state.tab=target;this.render();return;
    }
    if(action==='copy-project-advice'){
      const a=this.selectedProject;
      if(a)void this.copy(a.label+'\n'+a.comment+'\n'+a.tips.join('\n')+'\n'+a.disclaimer);
      return;
    }
    if(action==='open-publish'){
      this.state.open=false;this.render();
      window.dispatchEvent(new Event('alquimago:request-publish'));
      return;
    }
    if(action==='teach-neural'){
      if(!this.lastUserText)return;
      const selected=this.$content.querySelector('#alquimago-teach')?.value;
      if(!INTENTS.includes(selected))return;
      if(!teachNeural(this.neural,this.lastUserText,selected))return;
      const corrected=neuralPredict(this.neural,this.lastUserText);
      if(this.config.memory.mode!=='publish')writeNeural(storage(),this.config.memory.namespace,this.neural);
      this.lastNeuralIntent=selected;
      const labels={greeting:'saudação',identity:'identidade',status:'status',pet:'carinho',play:'brincadeira',brew:'poção',rest:'descanso',navigate:'navegação',insight:'sugestão',help:'ajuda',mood:'humor',thanks:'agradecimento'};
      const reply='Aprendi: agora reconheço essa frase como '+(labels[selected]||selected)+'. Confiança: '+Math.round(corrected.confidence*100)+'%. '+(this.config.memory.mode==='publish'?'Publique para manter esse aprendizado.':'O aprendizado foi salvo.');
      this.dialogue=[...this.dialogue,{role:'familiar',text:reply}].slice(-24);
      if(this.config.memory.mode!=='publish')writeDialogue(storage(),this.config.memory.namespace,this.dialogue);
      this.message=reply;
      this.render();
      return;
    }
    if(action==='reset-memory'){
      // Hard reloads must keep persistent progress. Reset is always deliberate.
      const allowed=typeof window.confirm==='function'&&window.confirm(
        'Reiniciar XP, atributos e conversa deste Alquimago? Apenas os dados deste navegador e desta instalação serão redefinidos. O portfólio e o GitHub não serão alterados.'
      );
      if(!allowed)return;
      this.state.brain=restoreBrain(null);
      this.neural=seedNeuralModel();
      this.lastProjectId=null;this.pendingQuestion=null;
      this.preferences=blankPreferences();
      this.cortex=createCortexRuntime(createCortex());this.lastAutoDecision=null;
      this.lastUserText='';this.lastNeuralIntent='';
      this.state.position=null;
      this.dialogue=[];
      this.lastSpoken=null;
      this.lastSpokenAt=0;
      this.hoverStroke=freshStroke();
      this.style.left='';
      this.style.top='';
      this.style.right='';
      this.style.bottom='';
      // Write a fresh memory rather than deleting the key; otherwise a
      // public project-memory snapshot would immediately restore old XP.
      this.save();
      if(this.config.memory.mode!=='publish'){
        writeDialogue(storage(),this.config.memory.namespace,[]);
        writeNeural(storage(),this.config.memory.namespace,this.neural);
        writePreferences(storage(),this.config.memory.namespace,this.preferences);
      }
      this.message=this.config.memory.mode==='publish'?'Rascunho zerado. Publique para manter; recarregar recupera a última versão publicada.':'Memória local reiniciada. O projeto não foi alterado.';
      this.state.tab=0;
      this.render();
      return;
    }
    if(action==='export-memory'){
      const blob=new Blob([JSON.stringify(this.snapshot()||cleanMemory(null),null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='alquimago-memory.json';a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      this.message='Backup da memória exportado.';this.renderHeader();return;
    }
    if(action==='import-memory'){
      const picker=document.createElement('input');picker.type='file';picker.accept='.json,application/json';
      picker.onchange=async()=>{try{
        const file=picker.files?.[0];if(!file||file.size>180000)return;
        const raw=await file.text(),state=parseBackup(raw);
        const imported=JSON.parse(raw);
        this.state.brain=restoreBrain(state.brain);this.state.position=state.position;
        this.neural=restoreNeuralModel(imported.neural)||seedNeuralModel();
        this.cortex=createCortexRuntime(imported.behavior||createCortex());
        this.save();
        if(this.config.memory.mode!=='publish')writeNeural(storage(),this.config.memory.namespace,this.neural);
        this.message=this.config.memory.mode==='publish'?'Memória importada para o rascunho. Publique para manter.':'Memória e aprendizado restaurados neste dispositivo.';
        this.render();
      }catch{this.message='Arquivo de memória inválido.';this.renderHeader();}};
      picker.click();return;
    }
    if(action==='read-files'){
      this.message='Lendo recursos autorizados...';this.renderHeader();
      void inspectProjectFiles(this.config.project.files,{pageUrl:location.href}).then(files=>{
        this.projectFiles=files;this.message=files.filter(f=>f.status==='read').length+' arquivo(s) lido(s).';this.render();
      });return;
    }
    if(action==='choose-folder'){
      const picker=document.createElement('input');picker.type='file';picker.multiple=true;picker.setAttribute('webkitdirectory','');
      picker.onchange=async()=>{
        const selection=Array.from(picker.files||[]).filter(f=>/\.(json|md|txt|ts|tsx|js|mjs|html|css|csv)$/i.test(f.name)).slice(0,20);
        const records=[];
        for(const file of selection){
          const name=file.webkitRelativePath||file.name;
          if(file.size>64000){records.push({file:name,status:'oversized'});continue;}
          try{const body=await file.text();records.push({file:name,status:'read',bytes:file.size,excerpt:body.slice(0,2000)});}
          catch{records.push({file:name,status:'unavailable'});}
        }
        this.projectFiles=records;this.message=records.filter(f=>f.status==='read').length+' arquivo(s) lido(s).';this.render();
      };
      picker.click();return;
    }
    if (action === 'audit') { this.audit = auditPage(); this.action('study'); return; }
    if (action === 'copy-audit') return this.copy(this.createPrompt());
    if (action === 'chatgpt' || action === 'gemini') {
      const destination = action === 'chatgpt' ? 'https://chatgpt.com/' : 'https://gemini.google.com/';
      // Abertura explicitamente solicitada, sem automatizar páginas de terceiros.
      window.open(destination, '_blank', 'noopener,noreferrer');
      void this.copy(this.createPrompt());
    }
  }
}
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (!customElements.get(TAG)) customElements.define(TAG, AlquimagoFamiliar);
  window.Alquimago = {
    version: '0.8.1',
    mount(target = document.body, mode = 'web') {
      const el = document.createElement(TAG);
      if (mode === 'desktop') el.setAttribute('data-mode', 'desktop');
      target.appendChild(el);
      return el;
    },
    destroy(){document.querySelectorAll(TAG).forEach(el=>el.remove());},
    exportState(){const el=document.querySelector(TAG);return el?.snapshot?.()||null;}
  };
  const autoMount = () => {
    if (window.ALQUIMAGO_AUTO_MOUNT === false || document.querySelector(TAG)) return;
    const slot = document.getElementById('alquimago-desktop');
    if (slot) window.Alquimago.mount(slot, 'desktop');
    else window.Alquimago.mount(document.body, 'web');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount, { once: true });
  else autoMount();
}
