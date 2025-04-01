import{C as K,r as o,b as z,c as Y,D as F,k as ee,O as te,m as $,d as j,I as ne,u as re,j as p,s as ae,S as W,a as oe}from"./index-D79ODXG6.js";import{R as se}from"./index.esm-Bs_wFQVw.js";import{T as le}from"./button.esm-DxtYD5lW.js";import{L as ie}from"./languages-hCqfiUtr.js";function ce(e){return e.replace(/\s+/g," ").replace(`
`,"").substring(1)}const ue=({errors:e,textLength:t})=>{const r=100-e*100/t;return{percentage:r.toFixed(2)+"%",roundPercentage:Math.round(r)+"%"}};var I=(e=>(e[e.cpm=0]="cpm",e[e.wpm=1]="wpm",e))(I||{}),D=(e=>(e[e.GOOD_VALUE=0]="GOOD_VALUE",e[e.BAD_VALUE=1]="BAD_VALUE",e))(D||{});const pe=({typeText:e,MilliSeconds:t,text:r})=>{const n={velocity:"",roundVelocity:""};if(e===I.wpm){const l=r.split(/\s+/).length/(t/6e4);n.velocity=l.toFixed(2),n.roundVelocity=""+Math.round(l)}else{const l=r.replace(/\s+/g," ").replace(`
`,"").length/(t/6e4);n.velocity=l.toFixed(2),n.roundVelocity=""+Math.round(l),console.log(l)}return n};function M(){return M=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},M.apply(this,arguments)}function B(e){"@babel/helpers - typeof";return B=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},B(e)}function de(e,t){if(B(e)!=="object"||e===null)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(B(n)!=="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function me(e){var t=de(e,"string");return B(t)==="symbol"?t:String(t)}function fe(e,t,r){return t=me(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function be(e){if(Array.isArray(e))return e}function ge(e,t){var r=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(r!=null){var n,a,l,c,s=[],m=!0,u=!1;try{if(l=(r=r.call(e)).next,t===0){if(Object(r)!==r)return;m=!1}else for(;!(m=(n=l.call(r)).done)&&(s.push(n.value),s.length!==t);m=!0);}catch(i){u=!0,a=i}finally{try{if(!m&&r.return!=null&&(c=r.return(),Object(c)!==c))return}finally{if(u)throw a}}return s}}function G(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function ye(e,t){if(e){if(typeof e=="string")return G(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return G(e,t)}}function ve(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function he(e,t){return be(e)||ge(e,t)||ye(e,t)||ve()}var xe={label:"p-button-label",icon:function(t){var r=t.props,n=t.label;return j("p-button-icon p-c",{"p-button-icon-left":r.iconPos==="left"&&n,"p-button-icon-right":r.iconPos==="right"&&n})},root:function(t){var r=t.props,n=t.hasIcon,a=t.hasLabel;return j("p-button p-togglebutton p-component",{"p-button-icon-only":n&&!a,"p-highlight":r.checked,"p-disabled":r.disabled},r.className)}},A=K.extend({defaultProps:{__TYPE:"ToggleButton",id:null,onIcon:null,offIcon:null,onLabel:"Yes",offLabel:"No",iconPos:"left",style:null,className:null,checked:!1,tabIndex:0,tooltip:null,tooltipOptions:null,onChange:null,onFocus:null,onBlur:null,children:void 0},css:{classes:xe}});function H(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),r.push.apply(r,n)}return r}function _e(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?H(Object(r),!0).forEach(function(n){fe(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):H(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}var X=o.memo(o.forwardRef(function(e,t){var r=o.useContext(z),n=A.getProps(e,r),a=o.useRef(null),l=o.useState(!1),c=he(l,2),s=c[0],m=c[1],u=A.setMetaData({props:n,state:{focused:s}}),i=u.ptm,g=u.cx,y=u.isUnstyled;Y(A.css.styles,y,{name:"togglebutton"});var h=n.onLabel&&n.onLabel.length>0&&n.offLabel&&n.offLabel.length>0,f=n.onIcon&&n.offIcon,v=h?n.checked?n.onLabel:n.offLabel:"&nbsp;",w=n.checked?n.onIcon:n.offIcon,T=function(b){!n.disabled&&n.onChange&&n.onChange({originalEvent:b,value:!n.checked,stopPropagation:function(){b.stopPropagation()},preventDefault:function(){b.preventDefault()},target:{name:n.name,id:n.id,value:!n.checked}})},d=function(b){b.keyCode===32&&(T(b),b.preventDefault())},P=function(b){m(!0),n.onFocus&&n.onFocus(b)},N=function(b){m(!1),n.onBlur&&n.onBlur(b)},x=function(){if(f){var b=$({className:g("icon",{label:v})},i("icon"));return ne.getJSXIcon(w,_e({},b),{props:n})}return null};o.useImperativeHandle(t,function(){return{props:n,focus:function(){return F.focusFirstElement(a.current)},getElement:function(){return a.current}}}),ee(function(){n.autoFocus&&F.focusFirstElement(a.current)});var L=te.isNotEmpty(n.tooltip),E=n.disabled?-1:n.tabIndex,J=x(),q=$({className:g("label")},i("label")),Q=$({ref:a,id:n.id,className:g("root",{hasIcon:f,hasLabel:h}),style:n.style,onClick:T,onFocus:P,onBlur:N,onKeyDown:d,tabIndex:E,role:"button","aria-pressed":n.checked,"data-p-highlight":n.checked,"data-p-disabled":n.disabled},A.getOtherProps(n),i("root"));return o.createElement(o.Fragment,null,o.createElement("div",Q,J,o.createElement("span",q,v),o.createElement(se,null)),L&&o.createElement(le,M({target:a,content:n.tooltip,pt:i("tooltip")},n.tooltipOptions)))}));X.displayName="ToggleButton";function Xe({service:e,roomId:t,setStateToggle:r,labelStart:n}){const[a,l]=o.useState(!1),{userName:c}=re(),s=async m=>{const{value:u}=m.target;l(u);const i=u?W.READY:W.NOT_READY;r&&r(i),e&&await ae[e]({userName:c??"",roomId:t,socketMessage:i})};return p.jsx(X,{onLabel:"I Ready",offLabel:n||"I Not Ready",checked:a,pt:{root:{style:{background:`${a?"var(--highlight-bg)":"var(--focus-ring)"}`}}},onChange:s})}function V(){return V=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},V.apply(this,arguments)}function R(e){"@babel/helpers - typeof";return R=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},R(e)}function we(e,t){if(R(e)!=="object"||e===null)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(R(n)!=="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Te(e){var t=we(e,"string");return R(t)==="symbol"?t:String(t)}function Pe(e,t,r){return t=Te(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var Oe={root:function(t){var r=t.props;return r.mode==="indeterminate"?j("p-progressbar p-component p-progressbar-indeterminate"):j("p-progressbar p-component p-progressbar-determinate")},value:"p-progressbar-value p-progressbar-value-animate",label:"p-progressbar-label",container:"p-progressbar-indeterminate-container"},je=`
@layer primereact {
  .p-progressbar {
      position: relative;
      overflow: hidden;
  }
  
  .p-progressbar-determinate .p-progressbar-value {
      height: 100%;
      width: 0%;
      position: absolute;
      display: none;
      border: 0 none;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
  }
  
  .p-progressbar-determinate .p-progressbar-label {
      display: inline-flex;
  }
  
  .p-progressbar-determinate .p-progressbar-value-animate {
      transition: width 1s ease-in-out;
  }
  
  .p-progressbar-indeterminate .p-progressbar-value::before {
        content: '';
        position: absolute;
        background-color: inherit;
        top: 0;
        left: 0;
        bottom: 0;
        will-change: left, right;
        -webkit-animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
                animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
  }
  
  .p-progressbar-indeterminate .p-progressbar-value::after {
      content: '';
      position: absolute;
      background-color: inherit;
      top: 0;
      left: 0;
      bottom: 0;
      will-change: left, right;
      -webkit-animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
              animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
      -webkit-animation-delay: 1.15s;
              animation-delay: 1.15s;
  }
}

@-webkit-keyframes p-progressbar-indeterminate-anim {
  0% {
    left: -35%;
    right: 100%; }
  60% {
    left: 100%;
    right: -90%; }
  100% {
    left: 100%;
    right: -90%; }
}
@keyframes p-progressbar-indeterminate-anim {
  0% {
    left: -35%;
    right: 100%; }
  60% {
    left: 100%;
    right: -90%; }
  100% {
    left: 100%;
    right: -90%; }
}

@-webkit-keyframes p-progressbar-indeterminate-anim-short {
  0% {
    left: -200%;
    right: 100%; }
  60% {
    left: 107%;
    right: -8%; }
  100% {
    left: 107%;
    right: -8%; }
}
@keyframes p-progressbar-indeterminate-anim-short {
  0% {
    left: -200%;
    right: 100%; }
  60% {
    left: 107%;
    right: -8%; }
  100% {
    left: 107%;
    right: -8%; }
}
`,Ne={value:function(t){var r=t.props,n=Math.max(r.value,2),a=r.value?r.color:"transparent";return r.mode==="indeterminate"?{backgroundColor:r.color}:{width:n+"%",display:"flex",backgroundColor:a}}},S=K.extend({defaultProps:{__TYPE:"ProgressBar",__parentMetadata:null,id:null,value:null,showValue:!0,unit:"%",style:null,className:null,mode:"determinate",displayValueTemplate:null,color:null,children:void 0},css:{classes:Oe,styles:je,inlineStyles:Ne}});function U(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),r.push.apply(r,n)}return r}function Ee(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?U(Object(r),!0).forEach(function(n){Pe(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):U(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}var Se=o.memo(o.forwardRef(function(e,t){var r=oe(),n=o.useContext(z),a=S.getProps(e,n),l=S.setMetaData(Ee({props:a},a.__parentMetadata)),c=l.ptm,s=l.cx,m=l.isUnstyled;Y(S.css.styles,m,{name:"progressbar"});var u=o.useRef(null),i=function(){if(a.showValue&&a.value!=null){var f=a.displayValueTemplate?a.displayValueTemplate(a.value):a.value+a.unit;return f}return null},g=function(){var f=i(),v=r({className:j(a.className,s("root")),style:a.style,role:"progressbar","aria-valuemin":"0","aria-valuenow":a.value,"aria-valuemax":"100"},S.getOtherProps(a),c("root")),w=r({className:s("value"),style:{width:a.value+"%",display:"flex",backgroundColor:a.color}},c("value")),T=r({className:s("label")},c("label"));return o.createElement("div",V({id:a.id,ref:u},v),o.createElement("div",w,f!=null&&o.createElement("div",T,f)))},y=function(){var f=r({className:j(a.className,s("root")),style:a.style,role:"progressbar","aria-valuemin":"0","aria-valuenow":a.value,"aria-valuemax":"100"},S.getOtherProps(a),c("root")),v=r({className:s("container")},c("container")),w=r({className:s("value"),style:{backgroundColor:a.color}},c("value"));return o.createElement("div",V({id:a.id,ref:u},f),o.createElement("div",v,o.createElement("div",w)))};if(o.useImperativeHandle(t,function(){return{props:a,getElement:function(){return u.current}}}),a.mode==="determinate")return g();if(a.mode==="indeterminate")return y();throw new Error(a.mode+" is not a valid mode for the ProgressBar. Valid values are 'determinate' and 'indeterminate'")}));Se.displayName="ProgressBar";const Ie="_timer_13w88_1",De={timer:Ie};function Je({finish:e}){const[t,r]=o.useState(3);return o.useEffect(()=>{const n=setInterval(()=>{r(t-1)},1e3);return t===0&&(e&&e(),window.clearInterval(n)),()=>{window.clearInterval(n)}},[t]),p.jsx("div",{children:p.jsx("span",{className:De.timer,children:t})})}const Be="_container_41bn7_1",Re="_inputHidden_41bn7_15",Le="_textTyped_41bn7_27",Ae="_textToType_41bn7_37",ke="_space_41bn7_45",Ve="_spaceWrong_41bn7_47",$e="_indicator_41bn7_89",Ce="_indicatorWrong_41bn7_97",Me="_prev_41bn7_75",_={container:Be,inputHidden:Re,textTyped:Le,textToType:Ae,space:ke,spaceWrong:Ve,indicator:$e,indicatorWrong:Ce,prev:Me};function qe({textReceived:e,handleSetPercentage:t,isInactive:r,intervalPercentage:n,finish:a,inactiveUser:l,handleError:c}){const[s,m]=o.useState({charTyped:"",charToType:e[0],textRest:e.substring(1),textWithNormalSpace:ce(e)}),u=o.useRef({value:0}),i=o.useRef({value:null}),g=o.useRef({lastIndexTyped:0,seconds:0}),y=o.useRef({index:0}),[h,f]=o.useState(!1),v=o.useRef(null),w=()=>{let d;y.current.index>=s.textWithNormalSpace.length?d=100:d=Math.floor(y.current.index*100/s.textWithNormalSpace.length),u.current.value=d,t(d)},T=d=>{const{value:P}=d.currentTarget,N=P[P.length-1];if(N===(s==null?void 0:s.charToType))if(N===`
`){f(!1),w();const x=s.textWithNormalSpace[y.current.index],L=s.textRest.indexOf(x);m(E=>({...E,charTyped:E.charTyped+`
`+" ".repeat(L),charToType:x,textRest:E.textRest.substring(L+1)})),y.current.index++}else f(!1),w(),y.current.index++,m(x=>({...x,charTyped:x.charTyped+N,charToType:x.textRest[0],textRest:x.textRest.substring(1)}));else f(!0),c==null||c()};return o.useEffect(()=>((n||a||l)&&(i.current.value=setInterval(()=>{var d;n&&n((u==null?void 0:u.current.value)??0),(u==null?void 0:u.current.value)===100&&((d=i==null?void 0:i.current)!=null&&d.value&&clearInterval(i==null?void 0:i.current.value),a==null||a()),g.current.lastIndexTyped===y.current.index?g.current.seconds++:(g.current.lastIndexTyped=y.current.index,g.current.seconds=0),r&&g.current.seconds>=r&&(async()=>{try{await(l==null?void 0:l())}catch(P){alert(P)}})()},1e3)),()=>{var d;(d=i==null?void 0:i.current)!=null&&d.value&&clearInterval(i==null?void 0:i.current.value)}),[]),p.jsx(p.Fragment,{children:p.jsxs("div",{className:_.container,children:[p.jsx("textarea",{className:_.inputHidden,onInput:T,onBlur:()=>{var d;return(d=v==null?void 0:v.current)==null?void 0:d.focus()},ref:v,autoFocus:!0}),p.jsx("pre",{className:_.prev,children:p.jsx("code",{children:s?p.jsxs(p.Fragment,{children:[p.jsx("span",{className:_.textTyped,children:s.charTyped}),p.jsx("span",{className:` ${_.indicator}
                ${h?_.indicatorWrong:""}
                ${s.charToType===`
`?h?_.spaceWrong:_.space:""} `,children:s.charToType}),p.jsx("span",{className:_.textToType,children:s.textRest})]}):""})})]})})}const Fe="_container_br27b_1",We="_valueName_br27b_21",Ge="_value_br27b_21",He="_wrongValue_br27b_39",k={container:Fe,valueName:We,value:Ge,wrongValue:He};function C({valueName:e,value:t,color:r}){return p.jsxs("div",{className:k.container,children:[p.jsx("span",{className:k.valueName,children:e}),p.jsx("span",{className:r===D.GOOD_VALUE?k.value:k.wrongValue,children:t})]})}function Qe({language:e,text:t,errors:r,timeMilliseconds:n}){const a=t.length,l=e===ie.NORMAL_TEXT?I.wpm:I.cpm,{roundPercentage:c}=ue({errors:r,textLength:a}),{roundVelocity:s}=pe({MilliSeconds:n,text:t,typeText:l});return p.jsxs("section",{children:[p.jsx(C,{valueName:l===I.cpm?"CPM":"WPM",value:s,color:D.GOOD_VALUE}),p.jsx(C,{valueName:"Perc.",value:c,color:D.GOOD_VALUE}),p.jsx(C,{valueName:"Errors",value:r.toString(),color:D.BAD_VALUE})]})}export{Se as P,Qe as S,Je as T,qe as W,Xe as a};
