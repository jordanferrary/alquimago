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
import {normalizeLessons,readLessons,writeLessons,approveLesson,recallLesson,summarizeApprovedFiles} from './learning.mjs';
import {createAffect,affectSignal,setAffectMusic,affectTick} from './affect.mjs';

const TAG = 'alquimago-familiar';
const STYLE = `
.familiar-title{display:none!important}


/* Visitor mode is a living character, not a floating stat/minigame widget. */
:host([data-public-mode="true"]) .familiar-title,
:host([data-public-mode="true"]) .panel{display:none!important}
:host([data-public-mode="true"]) .thought{
 display:block;position:relative;max-width:min(260px,calc(100vw - 24px));
 padding:10px 13px;border:1px solid #a887d6;
 border-radius:13px 13px 3px 13px;
 background:linear-gradient(130deg,#2d1b42f5,#191027f5);
 color:#f9eefe;box-shadow:0 8px 22px #12071f83;
 font:500 11px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;
 text-align:left;cursor:default;pointer-events:none;
 overflow-wrap:anywhere;user-select:none;
}
:host([data-public-mode="true"]) .thought[hidden]{display:none!important}
@media(max-width:520px){
 :host([data-public-mode="true"]) .thought{max-width:min(220px,calc(100vw - 24px));font-size:10.5px}
}
.character .arc-mouth{transform-box:fill-box;transform-origin:50% 50%;transition:transform .3s ease,stroke-width .3s ease}
.character[data-reaction="sad"] .arc-mouth,
.character[data-reaction="angry"] .arc-mouth{transform:scaleY(-1)}
.character[data-reaction="angry"] .eyes{animation:none;transform:scaleY(.7);transform-origin:center}
.character[data-reaction="pet"] .eyes,
.character[data-reaction="happy"] .eyes{animation:none;transform:scaleY(.28);transform-origin:center}
.character[data-reaction="pet"] .arc-mouth,
.character[data-reaction="happy"] .arc-mouth{stroke-width:2.5;transform:scale(1.18)}
.character[data-reaction="surprised"] .eyes{animation:none;transform:scale(1.1);transform-origin:center}
.character[data-reaction="surprised"] .arc-mouth{stroke-width:3;transform:scaleY(1.6)}
.character[data-reaction="tired"] .eyes{animation:none;transform:scaleY(.35);transform-origin:center}
.character[data-reaction="curious"] .eyes{animation:none;transform:translateY(-1px)}
@media(prefers-reduced-motion:reduce){.character .arc-mouth{transition:none!important}}

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



.reviewed-learning{margin:12px 0}
.reviewed-learning label{display:block;margin:9px 0 5px;color:#ecd7ff;font:600 11px system-ui}
.reviewed-learning input,.reviewed-learning textarea{
 box-sizing:border-box;width:100%;border:1px solid #805a9c;background:#130d1d;
 color:#fff;font:12px/1.5 system-ui;border-radius:9px;padding:9px;
}
.reviewed-learning textarea{resize:vertical;max-height:200px}
.reviewed-learning .actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}

/* v0.9: conversation-first design, high contrast and carefully bounded chat. */
.panel{
 width:min(400px,calc(100vw - 20px))!important;
 background:linear-gradient(150deg,#241532 0%,#141022 72%,#0e0b17 100%)!important;
 border:1px solid #ac80df99!important;border-radius:20px!important;
 box-shadow:0 18px 52px #070310c9,0 0 0 1px #e3c4ff0a inset!important;
 backdrop-filter:none!important;max-height:min(70dvh,650px)!important;
}
.panel-header{padding:15px 17px 12px!important;background:#2b1c3a!important;border-bottom:1px solid #6f50906b}
.panel-header .row b{font:700 14px/1.3 system-ui!important;letter-spacing:.025em}
.panel-header .subtitle{font-size:11px;opacity:.9}
.tabs{background:#1d1429;padding:8px 10px!important;border-bottom:1px solid #5b3a7855}
.tab{font:600 12px/1.3 system-ui!important;border-radius:11px!important;padding:9px 10px!important;
 color:#d3bfe8!important}
.tab.selected{background:#7653a3!important;color:#fff!important;box-shadow:0 2px 10px #0905106b}
.content{
 max-height:none!important;min-height:0!important;flex:1 1 auto!important;
 padding:13px 15px 15px!important;overflow-y:auto!important;
 overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#8a62ab #1b1426;
}
.chat-history{max-height:min(290px,34dvh)!important;min-height:80px!important;
 scrollbar-width:thin;scrollbar-color:#8a62ab #1b1426}
.chat-bubble{font:12px/1.65 system-ui!important;padding:10px 12px!important;
 border-radius:14px!important}
.chat-bubble.from-familiar{background:#30203e!important;border-color:#7954a0a6!important}
.chat-bubble.from-user{background:#63408e!important;border-color:#9969ca!important}
.chat-form{gap:8px;margin-top:11px}
.chat-form input{padding:12px!important;background:#120c1d!important;border:1px solid #8963af!important;
 border-radius:12px!important;font-size:12px!important}
.chat-send{height:41px!important;min-width:42px!important;border-radius:12px!important}
.chat-suggestions button{background:#32213e!important;border-color:#76548b!important;
 color:#f4e6ff!important;font-size:11px!important;padding:7px 10px!important}
.neural-lesson{background:#21162c!important;border-color:#765b9366!important}
.thought{font:11px/1.45 system-ui!important;background:#25182feb!important;
 max-width:225px!important;border-color:#9e73be!important}
.panel .action:focus-visible,.panel button:focus-visible,.panel input:focus-visible,
.panel select:focus-visible{outline:2px solid #f2cbff;outline-offset:2px}
@media(max-width:520px){
 .panel{width:min(355px,calc(100vw - 12px))!important;max-height:min(66dvh,580px)!important}
 .panel-header{padding:12px!important}
 .content{padding:10px 12px!important}
 .chat-history{max-height:26dvh!important}
}
@media(prefers-reduced-motion:reduce){.character{animation:none!important}.character .arc-sigils{animation:none!important}}

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

/* GRIMORIO 2.0 — a real creator workspace rather than a 360px widget. */
:host([data-public-mode="false"]:not([data-mode="desktop"])) .panel{
 position:fixed!important;
 right:clamp(152px,11vw,194px)!important;left:auto!important;
 top:auto!important;bottom:16px!important;
 width:min(790px,calc(100vw - 188px))!important;
 height:min(710px,calc(100dvh - 32px))!important;
 min-height:360px!important;max-height:calc(100dvh - 32px)!important;
 border:1px solid #9169bd!important;border-radius:24px!important;
 background:linear-gradient(145deg,#24162f 0%,#160f23 45%,#0e0b19 100%)!important;
 box-shadow:0 25px 85px #07020cdb,0 0 0 1px #d4a7fa21 inset!important;
 isolation:isolate;overflow:hidden!important;backdrop-filter:none!important;
}
:host([data-public-mode="false"]) .panel.open{display:flex!important;flex-direction:column!important}
:host([data-public-mode="false"]) .panel.expanded{
 right:clamp(18px,3vw,45px)!important;
 width:min(1100px,calc(100vw - 72px))!important;
}
:host([data-position="bottom-left"][data-public-mode="false"]) .panel{
 right:auto!important;left:clamp(152px,11vw,194px)!important
}
:host([data-position="bottom-left"][data-public-mode="false"]) .panel.expanded{
 left:clamp(18px,3vw,45px)!important;right:auto!important
}
:host([data-public-mode="false"]) .panel-header{
 flex:0 0 auto!important;padding:19px 23px 17px!important;
 background:radial-gradient(ellipse at 5% 0%,#74439930,transparent 67%),#22152f!important;
 border-bottom:1px solid #8662a74d!important
}
:host([data-public-mode="false"]) .panel-header .row{
 display:flex!important;align-items:center!important;justify-content:flex-start!important;
 gap:12px!important
}
.grimoire-brand-mark{
 width:43px;height:43px;display:grid;place-items:center;flex:0 0 43px;
 border:1px solid #b984e28c;border-radius:13px;color:#f4d8ff;
 background:radial-gradient(circle at 32% 21%,#8152b2,#482664 76%);
 box-shadow:0 7px 22px #8b50b831;font:24px/1 system-ui
}
.grimoire-brand{display:flex;flex-direction:column;min-width:0;gap:2px;flex:1}
.grimoire-kicker{color:#cba1e9;font:700 9px/1.4 system-ui;letter-spacing:.14em}
:host([data-public-mode="false"]) .panel-header .grimoire-brand b{
 font:750 22px/1.18 system-ui!important;color:#fff0ff;letter-spacing:-.025em!important
}
:host([data-public-mode="false"]) .panel-header .subtitle{
 margin:7px 0 0 55px;color:#bba6cb;font-size:11px!important;line-height:1.45!important
}
:host([data-public-mode="false"]) .panel-header .badge{
 padding:6px 10px;font-size:10px;border-radius:999px;
 background:#423056;border-color:#9570b38e;color:#ead7ff;white-space:nowrap
}
:host([data-public-mode="false"]) .panel-close{
 flex:0 0 34px;width:34px;height:34px;border-radius:10px;
 background:#342145;border:1px solid #8f63ad;color:#f7ddff;
 transition:background .15s,border-color .15s;cursor:pointer
}
:host([data-public-mode="false"]) .panel-close:hover{background:#5e3c79;border-color:#bf90de}
.grimoire-size-toggle{font:22px/1 system-ui!important}
.grimoire-layout{
 flex:1 1 auto;min-height:0;min-width:0;display:grid;
 grid-template-columns:164px minmax(0,1fr);overflow:hidden
}
:host([data-public-mode="false"]) .panel .grimoire-layout>.tabs{
 min-height:0!important;min-width:0!important;
 display:flex!important;flex-direction:column!important;align-items:stretch!important;
 gap:7px!important;grid-template-columns:none!important;
 padding:20px 11px!important;margin:0!important;
 background:linear-gradient(180deg,#21152f,#160e22)!important;
 border-bottom:0!important;border-right:1px solid #66487864;
 overflow-y:auto!important;overflow-x:hidden!important;
}
:host([data-public-mode="false"]) .grimoire-layout .tab{
 width:100%;display:flex;align-items:center;justify-content:flex-start;
 gap:10px;flex:0 0 auto!important;padding:12px 13px!important;
 text-align:left;min-height:46px!important;
 background:transparent!important;border:1px solid transparent!important;
 color:#c7b4d8!important;border-radius:12px!important;
 font:650 12px/1.3 system-ui!important;
 transition:background .15s,border-color .15s,color .15s
}
.grimoire-nav-icon{
 flex:0 0 24px;height:24px;width:24px;display:grid;place-items:center;
 border-radius:7px;background:#ffffff0b;color:#c49de0;font:16px/1 system-ui
}
:host([data-public-mode="false"]) .grimoire-layout .tab.selected{
 background:linear-gradient(105deg,#69428e9a,#4e306e7c)!important;
 border-color:#a679cf7d!important;color:#fff!important;
 box-shadow:inset 3px 0 #d398f6!important
}
:host([data-public-mode="false"]) .grimoire-layout .tab:hover{
 background:#764d962b!important;border-color:#9e74b553!important
}
:host([data-public-mode="false"]) .grimoire-layout .tab:focus-visible,
:host([data-public-mode="false"]) .panel-close:focus-visible,
:host([data-public-mode="false"]) .chat-send:focus-visible,
:host([data-public-mode="false"]) .chat-suggestions button:focus-visible{
 outline:2px solid #e9b8ff!important;outline-offset:2px!important
}
:host([data-public-mode="false"]) .grimoire-layout>.content{
 flex:1 1 auto!important;min-width:0!important;min-height:0!important;
 max-height:none!important;overflow:auto!important;
 background:radial-gradient(ellipse at 92% 4%,#6e448b18,transparent 62%),#150f21;
 padding:22px!important;scrollbar-gutter:stable
}
:host([data-public-mode="false"]) .grimoire-layout>.content:has(.grimoire-conversation){
 padding:0!important;overflow:hidden!important;scrollbar-gutter:auto
}
.grimoire-conversation{
 display:flex;flex-direction:column;height:100%;min-height:0;min-width:0;
 overflow:hidden
}
.grimoire-conversation-header{
 flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;
 gap:12px;padding:16px 22px 14px;border-bottom:1px solid #5c407145;
 background:#22172e6b
}
.grimoire-conversation-title{display:flex;flex-direction:column;gap:4px;min-width:0}
.grimoire-conversation-title>span{
 font:700 9px/1.3 system-ui;letter-spacing:.14em;color:#bd90db
}
.grimoire-conversation-title strong{
 font:750 15px/1.3 system-ui;color:#f6eaff
}
.grimoire-mood-indicator{display:block;color:#b9e2f0;font:600 10px/1.5 system-ui;letter-spacing:0}
.grimoire-answer-source{
 display:block;max-width:52%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
 border:1px solid #7c589a73;background:#352448;color:#dabcf0;
 padding:6px 9px;border-radius:999px;font:600 10px/1.3 system-ui
}
:host([data-public-mode="false"]) .grimoire-conversation .chat-history{
 flex:1 1 auto!important;min-height:0!important;max-height:none!important;
 overflow-y:auto!important;overscroll-behavior:contain;
 margin:0!important;padding:24px 24px 20px!important;
 display:flex;flex-direction:column;align-items:stretch;gap:13px!important;
 border:0!important;border-radius:0!important;
 background:transparent!important;scrollbar-gutter:stable!important
}
:host([data-public-mode="false"]) .chat-bubble{
 max-width:min(86%,540px)!important;
 padding:13px 16px!important;font:500 13px/1.65 system-ui!important;
 border-radius:16px!important;box-shadow:0 4px 18px #06021146!important;
 overflow-wrap:anywhere;white-space:pre-wrap
}
:host([data-public-mode="false"]) .chat-bubble.from-familiar{
 background:linear-gradient(135deg,#362347,#251932)!important;
 border:1px solid #765391a6!important;border-radius:5px 17px 17px 17px!important;
 color:#f3e9ff
}
:host([data-public-mode="false"]) .chat-bubble.from-user{
 background:linear-gradient(130deg,#8353b1,#633d92)!important;
 border:1px solid #b28bdb!important;border-radius:17px 17px 5px 17px!important;
 color:#fff
}
.grimoire-composer{
 flex:0 0 auto;display:flex;flex-direction:column;gap:10px;
 padding:13px 22px 15px;background:linear-gradient(180deg,#1c132a,#20132e);
 border-top:1px solid #76529062
}
:host([data-public-mode="false"]) .grimoire-composer .chat-form{
 display:flex!important;align-items:stretch!important;gap:10px!important;
 margin:0!important;padding:0!important;border:0!important
}
:host([data-public-mode="false"]) .grimoire-composer .chat-form input{
 flex:1;min-width:0;min-height:48px!important;
 background:#100b1a!important;border:1px solid #8967a8!important;
 border-radius:13px!important;color:#fff;font:500 13px/1.4 system-ui!important;
 padding:13px 16px!important
}
:host([data-public-mode="false"]) .grimoire-composer .chat-form input:focus{
 border-color:#cb94f4!important;box-shadow:0 0 0 3px #a26ed82b!important
}
:host([data-public-mode="false"]) .grimoire-composer .chat-send{
 flex:0 0 51px;min-width:51px!important;min-height:48px!important;height:auto!important;
 display:grid;place-items:center;border-radius:13px!important;
 background:linear-gradient(135deg,#a16bd9,#7047a1)!important;
 border:1px solid #c396e6!important;color:#fff;font-size:19px
}
:host([data-public-mode="false"]) .grimoire-composer .chat-suggestions{
 display:flex;gap:7px!important;flex-wrap:wrap;margin:0!important
}
:host([data-public-mode="false"]) .grimoire-composer .chat-suggestions button{
 border-radius:999px!important;font:600 10px/1.3 system-ui!important;
 padding:7px 11px!important;color:#dfc8ef!important;
 border:1px solid #8763a484!important;background:#4530548a!important
}
:host([data-public-mode="false"]) .grimoire-composer .chat-suggestions button:hover{
 background:#62447d!important;border-color:#bd8bdf!important
}
.grimoire-mentor{
 flex:0 0 auto;max-height:min(29dvh,240px);
 overflow-y:auto;background:#1c142b;border-top:1px solid #64497b5e;
 color:#d7c3e8
}
.grimoire-mentor>summary{
 list-style:none;cursor:pointer;padding:13px 22px;
 display:flex;align-items:center;gap:8px;
 font:700 11px/1.45 system-ui;color:#e9d2f7
}
.grimoire-mentor>summary::-webkit-details-marker{display:none}
.grimoire-mentor>summary:after{content:'⌄';margin-left:auto;font-size:14px;color:#b99aca}
.grimoire-mentor[open]>summary:after{content:'⌃'}
.grimoire-mentor>summary:hover{background:#39234775}
.grimoire-mentor>.neural-teach,.grimoire-mentor>.neural-lesson,
.grimoire-mentor>.arcane-ai-consent,.grimoire-mentor>.session-note,
.grimoire-mentor>.grimoire-diagnostics{margin:9px 18px!important}
.grimoire-conversation>.alquimago-lesson-review{
 flex:0 0 auto;margin:10px 20px;max-height:min(26dvh,240px);overflow-y:auto
}
:host([data-public-mode="false"]) .panel:has(.grimoire-conversation)>.feedback{display:none!important}
:host([data-public-mode="false"]) .panel>.feedback{
 flex:0 0 auto;min-height:36px;max-height:60px;padding:10px 20px;
 font:11px/1.4 system-ui;color:#bca6cb;background:#170e22
}
@media(max-width:1010px){
 :host([data-public-mode="false"]:not([data-mode="desktop"])) .panel{
  width:min(700px,calc(100vw - 172px))!important;right:148px!important
 }
 :host([data-position="bottom-left"][data-public-mode="false"]) .panel{
  left:148px!important;right:auto!important
 }
 :host([data-public-mode="false"]) .grimoire-layout{grid-template-columns:146px minmax(0,1fr)}
}
@media(max-width:760px){
 :host([data-public-mode="false"]:not([data-mode="desktop"])) .panel,
 :host([data-position="bottom-left"][data-public-mode="false"]) .panel{
  top:9px!important;left:9px!important;right:9px!important;bottom:9px!important;
  width:calc(100vw - 18px)!important;height:calc(100dvh - 18px)!important;
  min-height:0!important;max-height:calc(100dvh - 18px)!important;
  border-radius:17px!important
 }
 :host([data-public-mode="false"]) .panel.expanded{left:9px!important;right:9px!important;width:calc(100vw - 18px)!important}
 :host([data-public-mode="false"]) .grimoire-layout{
  display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)
 }
 :host([data-public-mode="false"]) .panel .grimoire-layout>.tabs{
  flex-direction:row!important;gap:7px!important;overflow-x:auto!important;overflow-y:hidden!important;
  border-bottom:1px solid #66487864!important;border-right:0!important;padding:9px 12px!important
 }
 :host([data-public-mode="false"]) .grimoire-layout .tab{
  width:auto!important;min-width:0!important;min-height:40px!important;
  padding:9px 11px!important;flex:1 0 auto!important;justify-content:center
 }
 :host([data-public-mode="false"]) .panel-header{padding:12px 13px!important}
 .grimoire-brand-mark{width:36px;height:36px;flex-basis:36px}
 :host([data-public-mode="false"]) .panel-header .grimoire-brand b{font-size:18px!important}
 :host([data-public-mode="false"]) .panel-header .subtitle{margin-left:0;font-size:10px!important}
 :host([data-public-mode="false"]) .grimoire-conversation-header{padding:10px 13px}
 :host([data-public-mode="false"]) .grimoire-conversation .chat-history{padding:15px 13px!important}
 :host([data-public-mode="false"]) .grimoire-composer{padding:10px 12px}
 :host([data-public-mode="false"]) .chat-bubble{font-size:12px!important;max-width:92%!important}
 .grimoire-mentor>summary{padding:10px 13px}
}
@media(max-width:410px){
 :host([data-public-mode="false"]) .panel-header .badge{display:none}
 .grimoire-kicker{font-size:8px}
 .grimoire-answer-source{max-width:44%;font-size:9px}
 .grimoire-conversation-title strong{font-size:13px}
 :host([data-public-mode="false"]) .grimoire-layout .tab{font-size:10px!important;gap:5px;padding:8px!important}
 .grimoire-nav-icon{width:18px;height:18px;flex-basis:18px}
}
@media(prefers-reduced-motion:reduce){
 :host([data-public-mode="false"]) .grimoire-layout .tab,
 :host([data-public-mode="false"]) .panel-close{transition:none!important}
}


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
const ORB_EXPRESSIONS={
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
const SVG=[
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
    this.lessons=normalizeLessons(null);this.lessonDraft=null;this.fileContextAllowed=false;this.lastAnswerSource='Pronto para conversar';
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
    this.affect=createAffect((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0,Date.now());
    this.affectTicker=null;this.musicHandler=null;
    this.pageEmotion=null;this.pageAwayAt=0;this.pageActivityAt=Date.now();this.pageReactions=null;

    this.pageReactionTimer=null;this.pageLeaveTimer=null;this.pageSelectTimer=null;this.pageHeadStart=0;
    this.pageLastReaction=Object.create(null);this.pageLastMouse=null;
    this.publicMessage='';this.publicUntil=0;this.publicLastSpokenAt=0;
    this.publicPriority=0;this.publicSaidAt=Object.create(null);
    this.publicLineTimer=null;this.publicIntroTimer=null;this.publicSpeechCount=0;
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
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><section class="shell"><div class="panel" id="panel" role="dialog" aria-label="Grimório do Alquimago" aria-modal="false"><header class="panel-header"><div class="row"><span class="grimoire-brand-mark" aria-hidden="true">✦</span><div class="grimoire-brand"><span class="grimoire-kicker">ALQUIMAGO / LOCAL STUDIO</span><b id="wizard-title">Grimório</b></div><span class="badge" id="level">Nível 1</span><button type="button" id="grimoire-size-toggle" aria-label="Expandir grimório" aria-pressed="false" title="Expandir ou restaurar tamanho" class="panel-close grimoire-size-toggle">⤢</button><button type="button" id="close-panel" aria-label="Fechar grimório" title="Fechar" class="panel-close">✕</button></div><div class="subtitle" id="wizard-subtitle">Conversa e aprendizado local</div></header><div class="grimoire-layout"><nav class="tabs" id="tabs" aria-label="Seções do grimório"></nav><div class="content" id="content"></div></div><div class="feedback" id="feedback" role="status"></div></div><button type="button" class="thought" id="thought" aria-label="Conversar com o familiar"></button><button type="button" class="character" id="character" aria-label="Interagir com Alquimago" title="Toque para carinho, deslize para acariciar ou arraste para mover">${SVG}</button><button type="button" class="familiar-title" id="toggle"><strong id="wizard-label">✦ Alquimago</strong><span aria-hidden="true">⌃</span></button></section>`;
    this.$panel = this.shadowRoot.getElementById('panel');
    this.$character = this.shadowRoot.getElementById('character');
    this.$content = this.shadowRoot.getElementById('content');
    this.$thought=this.shadowRoot.getElementById('thought');
    this.$thought.addEventListener('click',()=>{if(document.documentElement.dataset.alquimagoStudio!=='true')return;this.state.open=true;this.state.tab=this.selectedProject&&Date.now()-this.lastSpokenAt<18000?1:5;this.render();});
    this.shadowRoot.getElementById('close-panel').addEventListener('click',()=>{this.state.open=false;this.render();});
    this.grimoireExpanded=storage()?.getItem('alquimago-grimoire-expanded')==='true';
    this.$panel.classList.toggle('expanded',this.grimoireExpanded);
    const expand=this.shadowRoot.getElementById('grimoire-size-toggle');
    expand.setAttribute('aria-pressed',String(this.grimoireExpanded));
    expand.setAttribute('aria-label',this.grimoireExpanded?'Restaurar tamanho do grimório':'Expandir grimório');
    expand.textContent=this.grimoireExpanded?'⤡':'⤢';
    expand.addEventListener('click',()=>{
      this.grimoireExpanded=!this.grimoireExpanded;
      this.$panel.classList.toggle('expanded',this.grimoireExpanded);
      expand.setAttribute('aria-pressed',String(this.grimoireExpanded));
      expand.setAttribute('aria-label',this.grimoireExpanded?'Restaurar tamanho do grimório':'Expandir grimório');
      expand.textContent=this.grimoireExpanded?'⤡':'⤢';
      try{storage()?.setItem('alquimago-grimoire-expanded',String(this.grimoireExpanded))}catch{/* optional */}
    });
    this.$tabs = this.shadowRoot.getElementById('tabs');
    this.$feedback = this.shadowRoot.getElementById('feedback');
    this.shadowRoot.getElementById('toggle').addEventListener('click', () => this.toggle());
    this.$character.addEventListener('pointerdown', e => this.onPointerDown(e));
    this.$character.addEventListener('pointermove', e => this.onPointerMove(e));
    this.$character.addEventListener('pointerleave',()=>{this.hoverStroke={...freshStroke(),lastTriggeredAt:this.hoverStroke.lastTriggeredAt};this.pageHeadStart=0;});
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
      if(e.target?.id==='allow-gemini-file-context'){
        this.fileContextAllowed=!!e.target.checked;
        this.message=this.fileContextAllowed?'Posso compartilhar apenas os nomes de imports e exports dos arquivos que você já autorizou para leitura.':'Compartilhamento de metadados de arquivos desativado.';
        this.renderHeader();
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
      queueMicrotask(()=>{
       if(this.isConnected&&this.state.open&&this.state.tab===5)
        this.$content.querySelector('#alquimago-message')?.focus({preventScroll:true});
      });
    });
    if (!this.desktop && this.state.position) this.moveTo(this.state.position.x, this.state.position.y);
    this.render();
    this.lastSpoken=this.config.identity.greeting;this.lastSpokenAt=Date.now();this.updateThought();
    this.startObservation();
    this.startPageReactions();
    this.musicHandler=event=>{
      const playing=event?.detail?.playing===true;
      const justStarted=playing&&!this.affect.music;
      this.affect=setAffectMusic(this.affect,playing,Date.now());
      this.affect=affectTick(this.affect,Date.now());
      if(justStarted)this.speakPublic(
        "Oh, music! Activating my best floating-and-vibing mode.",
        'music:play',{priority:1,interval:150000,hold:5700}
      );
      if(this.isConnected)this.renderHeader();
    };
    window.addEventListener('alquimago:music-state',this.musicHandler);
    // Sync if the visitor pressed Play before the mascot finished loading.
    const media=document.querySelector('.music-widget audio');
    if(media instanceof HTMLAudioElement&&!media.paused&&!media.ended)
      this.musicHandler({detail:{playing:true}});
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
      // Approved lessons are private to this browser/site, including Studio
      // installations. Refresh and deploy do not erase them, and publish
      // snapshots never upload them as publicly readable JSON.
      this.lessons=readLessons(storage(),config.memory.namespace);
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
    this.timer = setInterval(() => { this.state.brain = passTime(this.state.brain, 10000); this.save();this.onIdleTick();this.tickPageReactions(); this.renderHeader(); }, 10000);
    // Runs quietly with no API calls or audio inspection.
    this.affectTicker=setInterval(()=>{
      if(!this.isConnected||document.hidden)return;
      this.affect=affectTick(this.affect,Date.now());
      this.renderHeader();
    },2600);
  }
  disconnectedCallback(){
    if(this.timer)clearInterval(this.timer);
    if(this.affectTicker)clearInterval(this.affectTicker);
    this.affectTicker=null;
    if(this.musicHandler)window.removeEventListener('alquimago:music-state',this.musicHandler);
    this.musicHandler=null;
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
    this.stopPageReactions();
    if(this.skinAdapter?.dispose)this.skinAdapter.dispose();
    this.closeOrb();
    this.timer=null;this.observer=null;this.observeTimer=null;
  }
  onIdleTick(){
    if(!this.configReady||!this.isConnected)return;
    if(this.isPublicVisitor())return;
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
    this.$character.dataset.expression='idle';
    // Procedural SVG animation adapter shares the same expression interface
    // as the GLB renderer, so Studio's Shape Key tester can preview both skins.
    const normalize=name=>{
      const raw=String(name||'idle').toLowerCase().replace(/[^a-z]/g,'');
      const aliases={stroke:'pet',affection:'pet',surprise:'surprised',anger:'angry',
        sleepy:'tired',meditating:'sleep',joy:'happy',focus:'focused',
        lookleft:'lookleft',lookright:'lookright',lookup:'lookup',lookdown:'lookdown'};
      const resolved=aliases[raw]||raw;
      return Object.prototype.hasOwnProperty.call(ORB_EXPRESSIONS,resolved)?resolved:'idle';
    };
    const apply=name=>{
      const key=normalize(name);
      this.$character.dataset.expression=key;
      const speed=key==='sleep'?6.3:key==='tired'?5.1:key==='excited'||key==='angry'||key==='surprised'?2.1:4.1;
      this.$character.style.setProperty('--orb-breath-duration',speed+'s');
      return key;
    };
    this.skinAdapter={
      setExpression:name=>{
        if(this.svgPreview&&Date.now()<this.svgPreview.until)return;
        if(name==='talk'){
          this.skinAdapter.previewExpression('talk',900);
          return;
        }
        apply(name);
      },
      previewExpression:(name,duration=2100)=>{
        if(this.svgPreviewTimer)clearTimeout(this.svgPreviewTimer);
        const key=apply(name);
        this.svgPreview={name:key,until:Date.now()+duration};
        this.svgPreviewTimer=setTimeout(()=>{
          this.svgPreview=null;this.svgPreviewTimer=null;
          if(this.isConnected)this.renderHeader();
        },duration);
      },
      dispose:()=>{
        if(this.svgPreviewTimer)clearTimeout(this.svgPreviewTimer);
        this.svgPreviewTimer=null;this.svgPreview=null;
      }
    };
  }
  projectPointerOver(e){
    if(this.isPublicVisitor()){
      const card=e.target instanceof Element?e.target.closest('.gallery-card[data-alquimago-project]'):null;
      if(!card||card.closest('alquimago-familiar'))return;
      const name=(card.getAttribute('data-alquimago-project')||'').trim();
      if(!name)return;
      const line=/frankie/i.test(name)
       ?'Frankie is quite the star, huh? Go on, take a closer look!'
       :'This is '+name.slice(0,58)+'. Click to see the full project!';
      this.speakPublic(line,'hover:project:'+name,{hold:5800,interval:180000,priority:2});
      return;
    }
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
  isPublicVisitor(){
    return !this.desktop&&document.documentElement.dataset.alquimagoStudio!=='true';
  }
  // English-only personality layer for visitors. Never uses Gemini or the
  // Portuguese developer diagnostics, and never reads selected text content.
  speakPublic(line,key,options={}){
    if(!this.isPublicVisitor()||!this.isConnected||document.hidden||this.state.open)return false;
    const text=String(line||'').trim().slice(0,180);
    if(!text)return false;
    const now=Date.now(),priority=options.priority??1;
    const interval=options.interval??90000,hold=options.hold??5800;
    if(now-(this.publicSaidAt[key]||0)<interval)return false;
    if(now-this.publicLastSpokenAt<8500&&priority<=this.publicPriority)return false;
    this.publicSaidAt[key]=now;this.publicLastSpokenAt=now;this.publicPriority=priority;
    this.publicSpeechCount++;
    this.publicMessage=text;this.publicUntil=now+hold;
    if(this.publicLineTimer)clearTimeout(this.publicLineTimer);
    this.publicLineTimer=setTimeout(()=>{
      this.publicLineTimer=null;
      this.publicMessage='';this.publicPriority=0;this.updateThought();
    },hold);
    this.updateThought();
    return true;
  }
  speakForReaction(trigger){
    if(!this.isPublicVisitor())return;
    const mood=this.affect?.expression||'idle';
    // The internal mood selects the tone; interactions merely provide context.
    const calm=['serene','breath','idle','sleep','tired'].includes(mood);
    const tense=['angry','worried','surprised'].includes(mood);
    const words={
      sad:calm?["I will be here, keeping the pixels peaceful.","Enjoy your adventure beyond this tab!"]:
        ["Leaving already? My tiny circuits will miss the company.","Off to another tab? I'll guard the artwork."],
      happy:calm?["Welcome back. Everything is nicely in orbit.","You're back! I saved the calm vibes for you."]:
        ["Welcome back! The art missed you. Probably.","My sensors picked up your return!"],
      angry:tense?["Copying text? My copyright sensors are watching!","Careful with those sacred words, human!"]:
        ["Found a sentence worth keeping? Interesting.","Research mode? I can respect that."],
      pet:["Easy on the headset! Those are premium sensors.","Oh! A head pat. My circuits approve."],
      surprised:tense?["Whoa! That cursor nearly scrambled my sensors!","Easy there, speedster!"]:
        ["Fast cursor! My scanners almost missed it.","Impressive pointer speed. Very futuristic."],
      tired:calm?["Quiet mode feels nice right now.","A little floating recharge sounds perfect."]:
        ["Even a tiny robot deserves a dramatic yawn.","Power-saving mode, but make it stylish."]
    };
    const lines=words[trigger];
    if(!lines)return;
    const priority={angry:5,pet:7,happy:6,sad:4,surprised:3,tired:1}[trigger]||1;
    const interval={sad:90000,happy:50000,angry:95000,pet:26000,surprised:110000,tired:180000}[trigger]||60000;
    this.speakPublic(lines[this.publicSpeechCount%lines.length],'reaction:'+trigger,
      {priority,interval,hold:trigger==='angry'?6900:4700});
  }
  // Only describe features that actually exist on the current page.
  publicSceneTip(){
    if(!this.isPublicVisitor()||document.hidden)return;
    const project=document.querySelector('main[data-alquimago-project].project-page');
    const title=project?.getAttribute('data-alquimago-project')||'';
    const video=project?.querySelector('.project-video-poster,.project-video-embed');
    const comparison=project?.querySelector('.comparison-block input[type="range"]');
    const gallerySearch=document.querySelector('.gallery .search input,.toolbar input[aria-label="Search for projects"]');
    const galleryCard=document.querySelector('.gallery-card[data-alquimago-project]');
    if(video)return this.speakPublic(
      /frankie/i.test(title)?'Frankie looks amazing, right? Try the video player to see more!':
      'Psst! There is a video in this project. Press Play to explore it.',
      'feature:video:'+title,{hold:6800,interval:120000,priority:2});
    if(comparison)return this.speakPublic(
      'Drag the before-and-after slider! Even my magic wand cannot do that.',
      'feature:comparison:'+title,{hold:6600,interval:120000,priority:2});
    if(/frankie/i.test(title))return this.speakPublic(
      'Frankie is stealing the spotlight again. Honestly, can you blame him?',
      'feature:frankie',{hold:6700,interval:120000,priority:2});
    if(project&&title)return this.speakPublic(
      'Welcome to '+title.slice(0,55)+'! Explore the details—every artwork has a story.',
      'feature:project:'+title,{hold:6500,interval:160000,priority:2});
    if(gallerySearch)return this.speakPublic(
      'Looking for something? Try the project search. Even my crystal ball has filters!',
      'feature:search',{hold:7300,interval:180000,priority:1});
    if(galleryCard)return this.speakPublic(
      'See something you like? Open a project to discover the whole artwork.',
      'feature:gallery',{hold:6800,interval:180000,priority:1});
    return this.speakPublic(
      'Welcome, curious traveler! Take a look around. I guard the pixels here.',
      'feature:welcome',{hold:6100,interval:300000,priority:1});
  }
  updateThought(){
    if(!this.$thought)return;
    if(this.isPublicVisitor()){
      const active=this.publicMessage&&Date.now()<this.publicUntil;
      this.$thought.textContent=active?this.publicMessage:'';
      this.$thought.hidden=!active;
      this.$thought.tabIndex=-1;
      this.$thought.setAttribute('aria-live','polite');
      this.$thought.setAttribute('aria-label',active?'Alquimago says: '+this.publicMessage:'Alquimago message');
      return;
    }
    this.$thought.tabIndex=0;
    this.$thought.removeAttribute('aria-live');
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

  // Local, ephemeral gestures. Neither selected text nor mouse coordinates
  // are stored, transferred or provided to the language model.
  reactPageEmotion(name,duration=1600,priority=1,cooldown=2500){
    if(!this.isConnected||this.desktop||document.hidden)return;
    const now=Date.now();
    if(now-(this.pageLastReaction[name]||0)<cooldown)return;
    if(this.pageEmotion&&this.pageEmotion.until>now&&this.pageEmotion.priority>priority)return;
    this.pageLastReaction[name]=now;
    this.pageEmotion={name,until:now+duration,priority};
    // Event is a stimulus, NOT a command to show that named expression.
    this.affect=affectSignal(this.affect,name,now);
    this.affect=affectTick(this.affect,now);
    this.speakForReaction(name);
    this.renderHeader();
    if(this.pageReactionTimer)clearTimeout(this.pageReactionTimer);
    this.pageReactionTimer=setTimeout(()=>{
      this.pageReactionTimer=null;
      if(this.isConnected)this.renderHeader();
    },duration+40);
  }
  tickPageReactions(){
    if(this.desktop||document.hidden||this.pageAwayAt)return;
    const silentFor=Date.now()-this.pageActivityAt;
    if(silentFor>65000)this.reactPageEmotion('tired',4500,1,50000);
  }
  startPageReactions(){
    if(this.desktop||this.pageReactions)return;
    const listeners=[];
    const on=(target,type,callback,options)=>{
      target.addEventListener(type,callback,options);
      listeners.push(()=>target.removeEventListener(type,callback,options));
    };
    const touchActivity=()=>{this.pageActivityAt=Date.now()};
    const ignored=node=>{
      const element=node?.nodeType===1?node:node?.parentElement;
      return !!element?.closest?.('input,textarea,select,[contenteditable],.editor-overlay,.studio-dock-anchor,[role="dialog"]');
    };
    on(document.documentElement,'mouseleave',()=>{
      if(document.hidden)return;
      this.pageAwayAt=Date.now();
      if(this.pageLeaveTimer)clearTimeout(this.pageLeaveTimer);
      this.pageLeaveTimer=setTimeout(()=>{
        this.pageLeaveTimer=null;
        if(this.pageAwayAt&&this.isConnected)this.reactPageEmotion('sad',2700,5,24000);
      },420);
    });
    on(document.documentElement,'mouseenter',()=>{
      if(!this.pageAwayAt)return;
      const awayFor=Date.now()-this.pageAwayAt;
      this.pageAwayAt=0;touchActivity();
      if(this.pageLeaveTimer)clearTimeout(this.pageLeaveTimer);
      this.pageLeaveTimer=null;
      if(awayFor>420)this.reactPageEmotion('happy',1700,8,1200);
      else this.renderHeader();
    });
    on(document,'selectionchange',()=>{
      if(this.pageSelectTimer)clearTimeout(this.pageSelectTimer);
      this.pageSelectTimer=setTimeout(()=>{
        this.pageSelectTimer=null;
        if(document.hidden||document.documentElement.dataset.alquimagoStudio==='true')return;
        const selection=window.getSelection();
        if(!selection||selection.isCollapsed||!selection.rangeCount)return;
        if(ignored(selection.anchorNode)||ignored(selection.focusNode))return;
        this.reactPageEmotion('angry',2500,5,11000);
      },180);
    });
    on(window,'pointermove',event=>{
      if(event.pointerType!=='mouse')return;
      touchActivity();
      if(event.buttons!==0)return;
      const previous=this.pageLastMouse;
      this.pageLastMouse={x:event.clientX,y:event.clientY,at:performance.now()};
      if(!previous||document.hidden||ignored(event.target))return;
      const dt=performance.now()-previous.at;
      if(dt<12||dt>95)return;
      const distance=Math.hypot(event.clientX-previous.x,event.clientY-previous.y);
      if(distance/dt<2.7||distance<80)return;
      const rect=this.$character.getBoundingClientRect();
      if(event.clientX<rect.left-180||event.clientX>rect.right+180||
         event.clientY<rect.top-180||event.clientY>rect.bottom+180)return;
      this.reactPageEmotion('surprised',1100,3,8500);
    },{passive:true});
    on(document,'pointerdown',touchActivity,{passive:true});
    on(document,'keydown',touchActivity,{passive:true});
    on(window,'scroll',()=>{
      touchActivity();
      if(!this.pageAwayAt)this.reactPageEmotion('curious',1300,1,14500);
    },{passive:true});
    on(document,'click',event=>{
      if(!(event.target instanceof Element)||ignored(event.target))return;
      if(event.target.closest('[data-alquimago-project],a[href],button'))
        this.reactPageEmotion('focused',1450,2,4200);
    },{passive:true});
    const navigation=()=>{
      touchActivity();
      this.reactPageEmotion('curious',2100,2,3000);
      // Wait for the React route to render its real media before suggesting it.
      if(this.publicIntroTimer)clearTimeout(this.publicIntroTimer);
      this.publicIntroTimer=setTimeout(()=>{
        this.publicIntroTimer=null;
        this.publicSceneTip();
      },1900);
    };
    on(document,'pointerover',event=>{
      if(!this.isPublicVisitor()||!(event.target instanceof Element))return;
      if(event.target.closest('.project-video-poster')){
        this.speakPublic('Found the video! Press Play to see the project in motion.',
          'feature:video-hover:'+location.hash,{priority:3,interval:210000,hold:6200});
      }else if(event.target.closest('.comparison-block input[type="range"]')){
        this.speakPublic('Try dragging that slider. Before and after, wizard-approved!',
          'feature:comparison-hover:'+location.hash,{priority:2,interval:210000,hold:6300});
      }
    },{passive:true});
    on(window,'hashchange',navigation);
    on(window,'popstate',navigation);
    on(document,'visibilitychange',()=>{
      if(document.hidden){this.pageEmotion=null;this.pageAwayAt=0}
      else {touchActivity();this.renderHeader()}
    });
    this.pageReactions=listeners;
    // Speak at most once when the initial interface has rendered.
    if(this.publicIntroTimer)clearTimeout(this.publicIntroTimer);
    this.publicIntroTimer=setTimeout(()=>{
      this.publicIntroTimer=null;
      if(this.isConnected)this.publicSceneTip();
    },4500);
  }
  stopPageReactions(){
    for(const remove of this.pageReactions||[])remove();
    this.pageReactions=null;
    for(const timer of [this.pageReactionTimer,this.pageLeaveTimer,this.pageSelectTimer])
      if(timer)clearTimeout(timer);
    this.pageReactionTimer=null;this.pageLeaveTimer=null;this.pageSelectTimer=null;
    if(this.publicLineTimer)clearTimeout(this.publicLineTimer);
    if(this.publicIntroTimer)clearTimeout(this.publicIntroTimer);
    this.publicLineTimer=null;this.publicIntroTimer=null;
    this.publicMessage='';this.publicUntil=0;
    this.pageEmotion=null;this.pageAwayAt=0;this.pageLastMouse=null;
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
        const overHead=e.clientY-rect.top<rect.height*.71;
        const result=updateHeadStroke(this.hoverStroke,{
          x:e.clientX-rect.left,
          head:overHead,
          pressed:false,
          time:Date.now()
        });
        this.hoverStroke=result.state;
        if(overHead){
          if(!this.pageHeadStart)this.pageHeadStart=Date.now();
          if(Date.now()-this.pageHeadStart>480){
            this.reactPageEmotion('pet',1250,6,4000);
          }
        }else this.pageHeadStart=0;
        if(result.triggered)this.reactPageEmotion('pet',1600,7,3000);
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
    const data=this.pointerStart;this.pointerStart=null;
    if(!data)return;
    if(data.moved){
      if(!this.desktop)this.save();
    }else{
      this.reactPageEmotion('pet',1500,7,600);
      if(!this.desktop&&document.documentElement.dataset.alquimagoStudio==='true'){
        this.state.tab=5;this.state.open=true;this.render();
      }
    }
    if(this.$character.hasPointerCapture(e.pointerId))this.$character.releasePointerCapture(e.pointerId);
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
    const approved=recallLesson(user,this.lessons);
    const prediction=approved?{intent:'approved-lesson',confidence:1}:neuralPredict(this.neural,user);
    this.lastUserText=user;this.lastNeuralIntent=prediction.intent;
    const response=approved?{...approved,store:true}:respondToChat(user,{
      pending:this.pendingQuestion,
      knowledge:this.knowledge,lastProjectId:this.lastProjectId,
      focusTitle:this.selectedProject?.title||'',
      neuralIntent:prediction.confidence>=.55&&
       !/\b(qual|quais|como|porque|por que|quando|onde|explique|diferenca|diferença|what|why|how|which)\b/.test(String(user).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())
       ?prediction.intent:null,
      name:this.config.identity.name,mood:currentMood(this.state.brain),
      level:levelFromXp(this.state.brain.xp),xp:this.state.brain.xp,
      approvedLessons:this.lessons?.lessons?.length||0,neuralCorrections:this.neural?.learned||0,
      page:this.activePage?.route||'desktop',suggestions:this.suggestions
    });
    const known=['private','math','followup','decline','clarify','navigate','empty',
      'project-fact','project-list','project-info','approved-lesson','studio-guide',
      'greeting','identity','status','pet','play','brew','rest','help','mood','thanks','self-learning'];
    const canGenerate=this.modelAvailable&&this.modelEnabled&&!this.modelBusy&&
      !known.includes(response.intent)&&user.length>=3;
    if(canGenerate){
      const history=this.dialogue.slice(-8);
      const project=this.knowledge.projects.find(p=>p.id===(response.projectId||this.lastProjectId))||null;
      const request=++this.modelSequence;
      this.modelBusy=true;this.lastAnswerSource='Aguardando Gemini';
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
        files:this.fileContextAllowed?summarizeApprovedFiles(this.projectFiles):[],
        pageUrl:location.href,signal:controller.signal
      }).then(answer=>{
        if(!this.isConnected||request!==this.modelSequence)return;
        this.dialogue[this.dialogue.length-1]={role:'familiar',text:answer.reply};
        this.message=answer.reply;
        this.lessonDraft={question:user,answer:answer.reply,source:'Gemini (revisado pelo usuário)'};
        this.lastAnswerSource='Gemini · ainda não aprendido';
        this.lastSpoken=answer.reply;this.lastSpokenAt=Date.now();
      }).catch(error=>{
        if(!this.isConnected||request!==this.modelSequence)return;
        const reason=error?.name==='AbortError'?
         'A consulta demorou demais.':error instanceof Error?error.message:'Não consegui conectar à IA.';
        const fallback=reason+' Resposta local: '+response.reply;
        this.lastAnswerSource='Resposta local · Gemini indisponível';
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
    this.lastAnswerSource=response.intent==='approved-lesson'?'Memória aprovada · offline':'Cérebro local · sem Gemini';
    if(response.store!==false&&response.intent!=='empty'){
      this.lessonDraft={question:user,answer:['project-fact','project-info','project-list'].includes(response.intent)?response.reply:'',source:'ensinado manualmente'};
    }
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
  toggle() { if (this.desktop||document.documentElement.dataset.alquimagoStudio!=='true') return; this.state.open = !this.state.open; this.render(); }
  renderHeader() {
    const mood=currentMood(this.state.brain);
    this.shadowRoot.getElementById('wizard-title').textContent='Grimório';
    this.shadowRoot.getElementById('wizard-label').textContent='✦ '+this.config.identity.name;
    this.shadowRoot.getElementById('wizard-subtitle').textContent='Conversa, lições aprovadas e ferramentas do familiar';
    this.style.setProperty('--violet',this.config.appearance.accent);
    this.style.setProperty('--gold',this.config.appearance.gold);

    this.shadowRoot.getElementById('level').textContent = `Nível ${levelFromXp(this.state.brain.xp)}`;
    this.$character.dataset.mood = mood;
    const internal=this.affect?.expression||skinExpression(mood);
    const effective=this.skin?.type==='model3d'&&internal==='serene'?'breath':internal;
    this.$character.dataset.reaction=''; // Legacy hardwired CSS must not override the chosen face.
    this.$character.dataset.affect=internal;
    this.$character.dataset.music=this.affect?.music?'playing':'paused';
    // Visible creator-only diagnostic of the affect model, not a claim
    // that the mascot experiences human emotions.
    const moodLabel=this.$content?.querySelector('.grimoire-mood-indicator');
    if(moodLabel){
      const moodNames={serene:'Sereno',breath:'Tranquilo',idle:'Neutro',happy:'Alegre',
        pet:'Afetuoso',love:'Carinhoso',excited:'Animado',curious:'Curioso',
        focused:'Concentrado',thinking:'Pensativo',surprised:'Surpreso',
        worried:'Preocupado',angry:'Irritado',sad:'Triste',tired:'Cansado',sleep:'Sonolento'};
      moodLabel.textContent='Humor interno: '+(moodNames[internal]||internal)+
        (this.affect?.music?' · Música tocando':'');
    }
    if(!this.skinAdapter)this.$character.dataset.expression=effective;
    if(this.skinAdapter?.setExpression){
      try{this.skinAdapter.setExpression(effective)}catch{/* optional renderer */}
    }
    this.$feedback.textContent = this.message || MOODS[mood];
    this.updateThought();
  }
  render() {
    // Public visitors interact with the familiar, but only Local Studio unlocks
    // the Grimório, Gemini, diagnostics and teaching controls. This is a UI
    // boundary, not backend authentication: the Gemini API gateway is public.
    const studioMode=document.documentElement.dataset.alquimagoStudio==='true';
    this.setAttribute('data-public-mode',String(!studioMode));
    if(!studioMode){this.modelEnabled=false;this.modelAvailable=false;this.state.open=false;}
    const flags=studioMode?this.config.features:{...this.config.features,
      dialogue:false,pageAudit:false,routes:false,projectFiles:false,assistants:false,memoryTools:false};
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
      const icon=document.createElement('span');
      icon.className='grimoire-nav-icon';
      icon.textContent=item.index===5?'◈':item.index===1?'◎':'✧';
      icon.setAttribute('aria-hidden','true');
      button.append(icon,document.createTextNode(this.language.tabs[item.key]||item.key));
      this.$tabs.appendChild(button);
    }
    this.$content.replaceChildren();
    const add = (html) => { const node = document.createElement('div'); node.innerHTML = html; this.$content.appendChild(node); return node; };
    if (this.state.tab === 0) {
      const b = this.state.brain;
      add(`<div class="line"><span>Energia mágica</span><small>${Math.round(b.energy)}%</small></div><div class="stat"><div class="bar" style="width:${b.energy}%"></div></div><div class="line"><span>Curiosidade</span><small>${Math.round(b.curiosity)}%</small></div><div class="stat"><div class="bar" style="width:${b.curiosity}%"></div></div><div class="line"><span>Foco</span><small>${Math.round(b.focus)}%</small></div><div class="stat"><div class="bar" style="width:${b.focus}%"></div></div><div class="muted">${b.interactions} interações • ${b.xp} XP</div><p class="muted">Arraste o dedo suavemente sobre o personagem para fazer carinho; arraste mais longe para movê-lo. Carinhos não geram XP infinito.</p><div class="actions"><button class="action" data-action="pet">♡ Carinho</button><button class="action" data-action="focus">◈ Foco</button><button class="action" data-action="rest">☾ Meditar</button></div>
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
      const conversation=document.createElement('section');conversation.className='grimoire-conversation';
      this.$content.appendChild(conversation);
      const heading=document.createElement('div');heading.className='grimoire-conversation-header';
      const headingText=document.createElement('div');headingText.className='grimoire-conversation-title';
      const eyebrow=document.createElement('span');eyebrow.textContent='CONVERSA ATIVA';
      const headingName=document.createElement('strong');headingName.textContent='Converse com o Alquimago';
      const moodHint=document.createElement('small');moodHint.className='grimoire-mood-indicator';
      moodHint.textContent='Humor interno: calculando…';
      headingText.append(eyebrow,headingName,moodHint);
      const source=document.createElement('span');source.className='grimoire-answer-source';
      source.textContent=this.lastAnswerSource||'Cérebro local';
      source.title='Origem da última resposta';
      heading.append(headingText,source);
      conversation.appendChild(heading);
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
      conversation.appendChild(history);
      add('<form id="alquimago-chat-form" class="chat-form" autocomplete="off"><label for="alquimago-message" class="sr-only">Mensagem para o familiar</label><input name="message" id="alquimago-message" maxlength="320" placeholder="Converse com seu familiar..." aria-label="Sua mensagem" required><button type="submit" class="chat-send" aria-label="Enviar mensagem">➤</button></form>');
      if(this.pendingQuestion&&Date.now()-this.pendingQuestion.at<300000){
        add('<div class="chat-suggestions" aria-label="Responder à pergunta"><button type="button" data-say="sim">✓ Sim</button><button type="button" data-say="não">✕ Não</button></div>');
      }else{
        add('<div class="chat-suggestions"><button type="button" data-say="O que você aprendeu?">Seu aprendizado</button><button type="button" data-say="Como mudar as cores do meu site?">Paleta de cores</button><button type="button" data-say="Quais projetos você conhece?">Projetos</button><button type="button" data-say="Quem é você?">Apresentação</button></div>');
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
      const summary=document.createElement('summary');summary.textContent='✦ Ensinar a reconhecer uma frase';
      lesson.append(summary,teacher);this.$content.appendChild(lesson);
      const lessonBox=document.createElement('details');
      lessonBox.className='neural-lesson reviewed-learning';
      const lessonTitle=document.createElement('summary');
      lessonTitle.textContent='📚 Ensinar um conhecimento verdadeiro';
      const note=document.createElement('p');note.className='muted';
      note.textContent='Revise a explicação antes de salvar. Só respostas aprovadas por você serão reutilizadas; elas ficam neste navegador e não são publicadas no GitHub.';
      const qLabel=document.createElement('label');qLabel.textContent='Pergunta';
      const question=document.createElement('input');question.id='lesson-question';
      question.maxLength=160;question.placeholder='O que o Alquimago deve saber?';
      question.value=this.lessonDraft?.question||'';
      const aLabel=document.createElement('label');aLabel.textContent='Resposta verificada';
      const answer=document.createElement('textarea');answer.id='lesson-answer';
      answer.rows=4;answer.maxLength=800;answer.placeholder='Explique com suas palavras ou revise o que o Gemini respondeu.';
      answer.value=this.lessonDraft?.answer||'';
      const controls=document.createElement('div');controls.className='actions';
      const approve=document.createElement('button');approve.type='button';
      approve.className='action primary';approve.dataset.action='approve-lesson';
      approve.textContent='✓ Aprovar e aprender';
      const remove=document.createElement('button');remove.type='button';
      remove.className='action';remove.dataset.action='clear-lessons';
      remove.textContent='Limpar lições';
      controls.append(approve,remove);
      lessonBox.append(lessonTitle,note,qLabel,question,aLabel,answer,controls);
      this.$content.appendChild(lessonBox);
      if(this.modelAvailable){
        const consent=document.createElement('label');
        consent.className='arcane-ai-consent';
        const choice=document.createElement('input');choice.type='checkbox';
        choice.id='toggle-llm';choice.checked=this.modelEnabled;
        choice.disabled=this.modelBusy;
        const details=document.createElement('span');
        details.textContent='Consultar o professor Gemini (opcional). Mensagens poderão ser enviadas ao serviço configurado. Não envie dados privados.';
        const share=document.createElement('label');share.className='arcane-ai-consent';
        const allow=document.createElement('input');allow.type='checkbox';
        allow.id='allow-gemini-file-context';allow.checked=this.fileContextAllowed;
        const context=document.createElement('span');
        context.textContent='Permitir compartilhar com o Gemini somente os nomes de imports/exports dos arquivos já lidos. Nenhum código bruto será enviado.';
        share.append(allow,context);
        consent.append(choice,details);
        this.$content.appendChild(consent);
        this.$content.appendChild(share);
      }
      const message=document.createElement('p');message.className='muted';
      message.textContent='Fonte: '+this.lastAnswerSource+' · '+this.lessons.lessons.length+' lições aprovadas neste navegador · '+this.knowledge.projects.length+' obras públicas.';
      this.$content.appendChild(message);
      if(this.config.memory.mode==='publish')add('<div class="session-note">As conversas e mudanças de XP são temporárias. Clique em Publicar no Studio para salvar; recarregar descarta o que não foi publicado.</div>');
      // A readable conversation occupies the available height. Teaching,
      // consent and technical controls live in a separate expandable section.
      const composer=document.createElement('div');composer.className='grimoire-composer';
      for(const node of this.$content.querySelectorAll('#alquimago-chat-form,.chat-suggestions'))
        composer.appendChild(node);
      conversation.appendChild(composer);
      const review=this.$content.querySelector('.alquimago-lesson-review');
      if(review)conversation.insertBefore(review,composer);
      const mentor=document.createElement('details');mentor.className='grimoire-mentor';
      mentor.open=Boolean(this.grimoireMentorOpen);
      mentor.addEventListener('toggle',()=>{this.grimoireMentorOpen=mentor.open});
      // Review after a teacher reply is a high-priority action, not hidden.
      const mentorSummary=document.createElement('summary');mentorSummary.textContent='✦ Mentor Gemini e treinamento';
      mentor.appendChild(mentorSummary);
      for(const node of this.$content.querySelectorAll('.neural-teach,.neural-lesson,.arcane-ai-consent,.session-note'))
        mentor.appendChild(node);
      const technical=Array.from(this.$content.children).find(node=>node.matches?.('p.muted'));
      if(technical){technical.classList.add('grimoire-diagnostics');mentor.appendChild(technical)}
      if(mentor.children.length>1)conversation.appendChild(mentor);
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
    const action = button.dataset.action;
    if (!action) return;
    if(['pet','stroke'].includes(action)){this.reactPageEmotion('pet',1600,7,500);return;}
    if(['focus','rest','explore'].includes(action))return this.action(action);
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
    if(action==='approve-lesson'){
      const question=this.$content.querySelector('#lesson-question')?.value||'';
      const answer=this.$content.querySelector('#lesson-answer')?.value||'';
      const result=approveLesson(this.lessons,question,answer,
        this.lessonDraft?.source||'ensinado manualmente');
      if(!result.ok){this.message=result.reason;this.renderHeader();return;}
      if(!writeLessons(storage(),this.config.memory.namespace,result.library)){
        this.message='Não consegui salvar a lição neste navegador. Verifique o armazenamento.';
        this.renderHeader();return;
      }
      this.lessons=result.library;this.lessonDraft=null;
      this.lastAnswerSource='Conhecimento aprovado · disponível offline';
      this.message='Conhecimento aprovado! Vou reutilizá-lo em perguntas semelhantes, mesmo depois de atualizações do site.';
      this.render();return;
    }
    if(action==='clear-lessons'){
      if(!window.confirm('Apagar todas as lições ensinadas neste navegador? Isso não altera o GitHub.'))return;
      const empty=normalizeLessons(null);
      if(!writeLessons(storage(),this.config.memory.namespace,empty)){
        this.message='Não consegui alterar as lições neste navegador.';this.renderHeader();return;
      }
      this.lessons=empty;this.lessonDraft=null;
      this.message='Lições locais apagadas. Os arquivos do projeto não foram alterados.';
      this.render();return;
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
    version: '0.10.0',
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
