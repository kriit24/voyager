"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6854],{5942:(e,l,t)=>{t.r(l),t.d(l,{default:()=>_e});var o=t(6252),n=t(3577),a=t(9963);const i={class:"voyager-table striped mt-0"},s=(0,o._)("th",{class:"hidden md:table-cell"},null,-1),r={class:"hidden md:table-cell"},d={class:"hidden md:table-cell"},u={class:"hidden md:table-cell"},c={class:"hidden md:table-cell"},p={class:"hidden md:table-cell"},_={class:"hidden md:table-cell"},m={class:"flex justify-end"},g={class:"hidden md:table-cell dd-handle cursor-move"},y={class:"h-5 w-5"},b={class:"hidden md:table-cell"},v=["onUpdate:modelValue"],h=["label"],f=["value"],w=["label"],D=["value"],k=["label"],S=["value"],V={class:"inline-flex items-center space-x-1"},U=["onUpdate:modelValue","disabled"],x={value:null},W={value:"edit"},C={value:"read"},M={class:"hidden md:table-cell"},F=["onUpdate:modelValue"],$={class:"hidden md:table-cell"},B=["onUpdate:modelValue","disabled"],T={class:"hidden md:table-cell"},j=["disabled","checked","value"],q={class:"hidden md:table-cell"},H=["onUpdate:modelValue","disabled"],Y={class:"flex flex-no-wrap space-x-1 justify-end"},K={class:"input-group mt-2"},R={class:"label mt-4"},I=["onUpdate:modelValue"],L={class:"input-group mt-2"},P={class:"label"},z=["onUpdate:modelValue"],O={class:"button"},J=["onClick"],N={class:"voyager-table"},A={class:"flex justify-end"},Q=["onUpdate:modelValue"],E={value:null},G=["onUpdate:modelValue","disabled"],X={value:"="},Z={value:"!="},ee={value:">="},le={value:">"},te={value:"<="},oe={value:"<"},ne={value:"like"},ae=["onUpdate:modelValue"],ie={class:"w-full"},se={class:"button"},re=["onClick"],de={class:"flex justify-end"},ue=["onClick"];var ce=t(9980);const pe={components:{draggable:t.n(ce)()},emits:["update:formfields","update:options","delete"],props:["computed","columns","relationships","formfields","options"],data(){return{colors:this.colors}},methods:{addFilter(){this.$refs.filters_collapsible.open();var e=this.options;this.isArray(e.filters)||(e.filters=[]),e.filters.push({name:"",column:null,operator:"=",value:"",color:"accent",icon:null}),this.$emit("update:options",e)},removeFilter(e){var l=this.options;l.filters.splice(e,1),this.$emit("update:options",l)},getRelatedBread(e){if("relationship"==e.type){let l=e.column.split(".")[0],t=this.relationships.where("method",l).first();if(t&&t.hasOwnProperty("bread")&&t.bread)return t.bread}return null}},render:function(e,l,t,ce,pe,_e){const me=(0,o.up)("Icon"),ge=(0,o.up)("LanguageInput"),ye=(0,o.up)("LocalePicker"),be=(0,o.up)("SlideIn"),ve=(0,o.up)("draggable"),he=(0,o.up)("ColorPicker"),fe=(0,o.up)("IconPicker"),we=(0,o.up)("Modal"),De=(0,o.up)("Collapsible"),ke=(0,o.Q2)("tooltip");return(0,o.wg)(),(0,o.iD)("div",null,[(0,o._)("div",i,[(0,o._)("table",null,[(0,o._)("thead",null,[(0,o._)("tr",null,[s,(0,o._)("th",r,(0,n.toDisplayString)(e.__("voyager::generic.type")),1),(0,o._)("th",null,(0,n.toDisplayString)(e.__("voyager::generic.column")),1),(0,o._)("th",null,(0,n.toDisplayString)(e.__("voyager::generic.title")),1),(0,o._)("th",d,(0,n.toDisplayString)(e.__("voyager::builder.link_to")),1),(0,o._)("th",u,(0,n.toDisplayString)(e.__("voyager::builder.searchable")),1),(0,o._)("th",c,(0,n.toDisplayString)(e.__("voyager::builder.orderable")),1),(0,o._)("th",p,(0,n.toDisplayString)(e.__("voyager::builder.order_default")),1),(0,o._)("th",_,(0,n.toDisplayString)(e.__("voyager::generic.translatable")),1),(0,o._)("th",m,(0,n.toDisplayString)(e.__("voyager::generic.actions")),1)])]),(0,o.Wm)(ve,{tag:"tbody",modelValue:t.formfields,"onUpdate:modelValue":l[1]||(l[1]=l=>e.$emit("update:formfields",JSON.parse(JSON.stringify(l)))),"item-key":""},{item:(0,o.w5)((({element:i,index:s})=>[(0,o._)("tr",null,[(0,o.wy)((0,o._)("td",g,[(0,o._)("div",y,[(0,o.Wm)(me,{icon:"selector"})])],512),[[ke,e.__("voyager::generic.move")]]),(0,o._)("td",b,(0,n.toDisplayString)(e.getFormfieldByType(i.type).name),1),(0,o._)("td",null,[(0,o.wy)((0,o._)("select",{class:"input small w-full","onUpdate:modelValue":e=>i.column=e},[e.getFormfieldByType(i.type).allow_columns?((0,o.wg)(),(0,o.iD)("optgroup",{key:0,label:e.__("voyager::builder.columns")},[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(t.columns,((e,l)=>((0,o.wg)(),(0,o.iD)("option",{key:"column_"+l,value:{column:e,type:"column"}},(0,n.toDisplayString)(e),9,f)))),128))],8,h)):(0,o.kq)("v-if",!0),e.getFormfieldByType(i.type).allow_computed_props&&t.computed.length>0?((0,o.wg)(),(0,o.iD)("optgroup",{key:1,label:e.__("voyager::builder.computed")},[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(t.computed,((e,l)=>((0,o.wg)(),(0,o.iD)("option",{key:"computed_"+l,value:{column:e,type:"computed"}},(0,n.toDisplayString)(e),9,D)))),128))],8,w)):(0,o.kq)("v-if",!0),((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(t.relationships,((l,t)=>((0,o.wg)(),(0,o.iD)(o.HY,{key:"relationship_"+t},[e.getFormfieldByType(i.type).allow_relationship_props?((0,o.wg)(),(0,o.iD)("optgroup",{key:0,label:l.method},[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(l.columns,((e,t)=>((0,o.wg)(),(0,o.iD)("option",{key:"column_"+t,value:{column:l.method+"."+e,type:"relationship"}},(0,n.toDisplayString)(l.method+"."+e),9,S)))),128))],8,k)):(0,o.kq)("v-if",!0)],64)))),128))],8,v),[[a.vModelSelect,i.column]])]),(0,o._)("td",null,[(0,o.Wm)(ge,{class:"input small w-full",type:"text",placeholder:"Title",modelValue:i.title,"onUpdate:modelValue":e=>i.title=e},null,8,["modelValue","onUpdate:modelValue"])]),(0,o._)("td",V,[(0,o.wy)((0,o._)("select",{class:"input small w-full","onUpdate:modelValue":e=>i.link_to=e,disabled:null===_e.getRelatedBread(i.column)&&"relationship"==i.column.type},[(0,o._)("option",x,(0,n.toDisplayString)(e.__("voyager::generic.nothing")),1),(0,o._)("option",W,(0,n.toDisplayString)(e.__("voyager::generic.edit")),1),(0,o._)("option",C,(0,n.toDisplayString)(e.__("voyager::generic.read")),1)],8,U),[[a.vModelSelect,i.link_to]]),null!==_e.getRelatedBread(i.column)?(0,o.wy)(((0,o.wg)(),(0,o.j4)(me,{key:0,icon:"information-circle",size:6},null,512)),[[ke,e.__("voyager::builder.links_to_bread")]]):(0,o.kq)("v-if",!0),null===_e.getRelatedBread(i.column)&&"relationship"==i.column.type?(0,o.wy)(((0,o.wg)(),(0,o.j4)(me,{key:1,icon:"information-circle",size:6,class:"text-red-500"},null,512)),[[ke,e.__("voyager::builder.cannot_link")]]):(0,o.kq)("v-if",!0)]),(0,o._)("td",M,[(0,o.wy)((0,o._)("input",{class:"input",type:"checkbox","onUpdate:modelValue":e=>i.searchable=e},null,8,F),[[a.vModelCheckbox,i.searchable]])]),(0,o._)("td",$,[(0,o.wy)((0,o._)("input",{class:"input",type:"checkbox","onUpdate:modelValue":e=>i.orderable=e,disabled:"column"!==i.column.type},null,8,B),[[a.vModelCheckbox,i.orderable]])]),(0,o._)("td",T,[(0,o.wy)((0,o._)("input",{class:"input",type:"radio",disabled:"column"!==i.column.type,checked:t.options.default_order_column&&t.options.default_order_column==i.column,"onUpdate:modelValue":l[0]||(l[0]=e=>t.options.default_order_column=e),value:i.column},null,8,j),[[a.vModelRadio,t.options.default_order_column]])]),(0,o._)("td",q,[(0,o.wy)((0,o._)("input",{type:"checkbox",class:"input","onUpdate:modelValue":e=>i.translatable=e,disabled:!e.getFormfieldByType(i.type).can_be_translated},null,8,H),[[a.vModelCheckbox,i.translatable]])]),(0,o._)("td",Y,[(0,o.Wm)(be,{title:e.__("voyager::generic.options")},{actions:(0,o.w5)((()=>[(0,o.Wm)(ye)])),opener:(0,o.w5)((()=>[(0,o._)("button",O,[(0,o.Wm)(me,{icon:"cog"}),(0,o._)("span",null,(0,n.toDisplayString)(e.__("voyager::generic.options")),1)])])),default:(0,o.w5)((()=>[((0,o.wg)(),(0,o.j4)((0,o.LL)(e.getFormfieldByType(i.type).builder_component),{options:i.options,"onUpdate:options":e=>i.options=e,column:i.column,columns:t.columns,action:"list-options"},null,8,["options","onUpdate:options","column","columns"])),(0,o._)("div",K,[(0,o._)("label",R,(0,n.toDisplayString)(e.__("voyager::generic.component")),1),(0,o.wy)((0,o._)("input",{type:"text",class:"input w-full","onUpdate:modelValue":e=>i.component=e},null,8,I),[[a.vModelText,i.component]])]),(0,o._)("div",L,[(0,o._)("label",P,(0,n.toDisplayString)(e.__("voyager::generic.classes")),1),(0,o.wy)((0,o._)("input",{type:"text",class:"input w-full","onUpdate:modelValue":e=>i.options.classes=e},null,8,z),[[a.vModelText,i.options.classes]])])])),_:2},1032,["title"]),(0,o._)("button",{class:"button",onClick:l=>e.$emit("delete",s)},[(0,o.Wm)(me,{icon:"trash",class:"text-red-500"}),(0,o._)("span",null,(0,n.toDisplayString)(e.__("voyager::generic.delete")),1)],8,J)])])])),_:1},8,["modelValue"])])]),(0,o.Wm)(De,{title:`${e.__("voyager::generic.filters")} (${t.options.filters.length||0})`,closed:"",ref:"filters_collapsible"},{actions:(0,o.w5)((()=>[(0,o._)("button",{class:"button small",onClick:l[2]||(l[2]=(0,a.withModifiers)(((...e)=>_e.addFilter&&_e.addFilter(...e)),["stop"]))},[(0,o.Wm)(me,{icon:"plus",class:"text-green-500"})])])),default:(0,o.w5)((()=>[(0,o._)("div",N,[(0,o._)("table",null,[(0,o._)("thead",null,[(0,o._)("tr",null,[(0,o._)("th",null,(0,n.toDisplayString)(e.__("voyager::generic.name")),1),(0,o._)("th",null,(0,n.toDisplayString)(e.__("voyager::generic.column")),1),(0,o._)("th",null,(0,n.toDisplayString)(e.__("voyager::generic.operator")),1),(0,o._)("th",null,(0,n.toDisplayString)(e.__("voyager::builder.value_or_scope")),1),(0,o._)("th",null,(0,n.toDisplayString)(e.__("voyager::generic.color")),1),(0,o._)("th",null,(0,n.toDisplayString)(e.__("voyager::generic.icon")),1),(0,o._)("th",A,(0,n.toDisplayString)(e.__("voyager::generic.actions")),1)])]),(0,o._)("tbody",null,[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(t.options.filters,((l,i)=>((0,o.wg)(),(0,o.iD)("tr",{key:"filter-"+i},[(0,o._)("td",null,[(0,o.Wm)(ge,{class:"input small w-full",type:"text",placeholder:e.__("voyager::generic.name"),modelValue:l.name,"onUpdate:modelValue":e=>l.name=e},null,8,["placeholder","modelValue","onUpdate:modelValue"])]),(0,o._)("td",null,[(0,o.wy)((0,o._)("select",{class:"input small w-full","onUpdate:modelValue":e=>l.column=e},[(0,o._)("option",E,(0,n.toDisplayString)(e.__("voyager::generic.none")),1),((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(t.columns,(e=>((0,o.wg)(),(0,o.iD)("option",{key:e},(0,n.toDisplayString)(e),1)))),128))],8,Q),[[a.vModelSelect,l.column]])]),(0,o._)("td",null,[(0,o.wy)((0,o._)("select",{class:"input small w-full","onUpdate:modelValue":e=>l.operator=e,disabled:null===l.column},[(0,o._)("option",X,(0,n.toDisplayString)(e.__("voyager::builder.operators.equals")),1),(0,o._)("option",Z,(0,n.toDisplayString)(e.__("voyager::builder.operators.not_equals")),1),(0,o._)("option",ee,(0,n.toDisplayString)(e.__("voyager::builder.operators.bigger_than")),1),(0,o._)("option",le,(0,n.toDisplayString)(e.__("voyager::builder.operators.bigger")),1),(0,o._)("option",te,(0,n.toDisplayString)(e.__("voyager::builder.operators.smaller_than")),1),(0,o._)("option",oe,(0,n.toDisplayString)(e.__("voyager::builder.operators.smaller")),1),(0,o._)("option",ne,(0,n.toDisplayString)(e.__("voyager::builder.operators.like")),1)],8,G),[[a.vModelSelect,l.operator]])]),(0,o._)("td",null,[(0,o.wy)((0,o._)("input",{type:"text",class:"input small w-full","onUpdate:modelValue":e=>l.value=e},null,8,ae),[[a.vModelText,l.value]])]),(0,o._)("td",null,[(0,o.Wm)(he,{modelValue:l.color,"onUpdate:modelValue":e=>l.color=e,size:2,"add-none":""},null,8,["modelValue","onUpdate:modelValue"])]),(0,o._)("td",null,[(0,o.Wm)(we,{ref:`filter_icon_modal_${i}`,title:e.__("voyager::generic.select_icon")},{opener:(0,o.w5)((()=>[(0,o._)("div",ie,[(0,o._)("button",se,[(0,o.Wm)(me,{class:"my-1 content-center",icon:l.icon?l.icon:"ban",key:i+(l.icon?l.icon:"ban")},null,8,["icon"])])])])),actions:(0,o.w5)((()=>[(0,o._)("button",{class:"button",onClick:t=>{l.icon=null,e.$refs["filter_icon_modal_"+i].close()}},(0,n.toDisplayString)(e.__("voyager::generic.none")),9,re)])),default:(0,o.w5)((()=>[(0,o.Wm)(fe,{onSelect:t=>{l.icon=t,e.$refs[`filter_icon_modal_${i}`].close()}},null,8,["onSelect"])])),_:2},1032,["title"])]),(0,o._)("td",de,[(0,o._)("button",{class:"button small",onClick:(0,a.withModifiers)((e=>_e.removeFilter(i)),["stop"])},[(0,o.Wm)(me,{icon:"trash",class:"text-red-500"})],8,ue)])])))),128))])])])])),_:1},8,["title"])])}},_e=pe}}]);