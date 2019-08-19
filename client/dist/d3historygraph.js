(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{88:function(t,e,i){"use strict";i.r(e);var s=i(52),a=i(53),h=i(55),r=i(79),n=i(81),o=i(80),c=i(84),l=i(87),m=i(85),p=i(86);var d={date:"%d.%m.%Y",dateTime:"%a %b %e %X %Y",days:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],months:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],periods:["AM","PM"],shortDays:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],shortMonths:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],time:"%H:%M:%S"};i.d(e,"GraphLineComponent",function(){return g}),s.timeFormatDefaultLocale(d);class g{constructor(t){this.lineas=t,this.bisectDate=s.bisector(t=>t.timestamp).right,this.bisectValue=s.bisector(t=>t.price).right,this.svgWidth=800,this.svgHeight=300,this.margin={top:30,right:40,bottom:50,left:60},this.width=this.svgWidth-this.margin.left-this.margin.right,this.height=this.svgHeight-this.margin.top-this.margin.bottom,this.originalCircle={cx:-150,cy:-15,r:20},this.chartProps={},this.lineGraphElement=document.getElementById("linechart"),this.titleGraph="",this.ngOnInit()}getLine1(){return new h.a(t=>{this.linea1=this.lineas[0],t.next(this.lineas[0])})}getTitles(){return new h.a(t=>{let e="";this.lineas.forEach(t=>{t.name&&(e=""===e?t.name:e+" / "+t.name)}),this.titleGraph=e,t.next(e)})}ngOnInit(){this.getTitles().pipe(Object(o.a)(t=>this.getLine1()),Object(c.a)(t=>this.defineChart$()),Object(c.a)(t=>Object(r.a)(this.lineas)),Object(o.a)(t=>this.drawLine$(t)),Object(l.a)(1e3),Object(m.a)(t=>this.addToolTips$(t)),Object(m.a)(t=>this.addEventsArea()),Object(p.a)(()=>Object(n.a)("error"))).subscribe(t=>{this.addTitleGraph()})}deleteSvg(){s.select(this.lineGraphElement).remove()}defineChart$(){return new h.a(t=>{this.defineChart(),t.next(!0)})}defineChart(){this.svgViewport=s.select(this.lineGraphElement).append("svg").style("background","white").attr("viewBox",`0 0 ${this.svgWidth} ${this.svgHeight}`),this.chartProps.xScale=s.scaleTime().domain(s.extent(this.linea1.timePriceArray,t=>new Date(t.timestamp).getTime())).range([0,this.width]).clamp(!0),this.svgViewport.on("mousedown.zoom",null).on("touchstart.zoom",null).on("touchmove.zoom",null).on("touchend.zoom",null),this.chartProps.yScale=s.scaleLinear().domain([0,s.max(this.lineas,t=>1.1*Math.max(...t.timePriceArray.map(t=>t.price)))]).range([this.height,0]).clamp(!0),this.xAxis=s.axisBottom(this.chartProps.xScale),this.yAxis=s.axisLeft(this.chartProps.yScale),this.zoom=s.zoom().scaleExtent([1,1/0]).translateExtent([[0,0],[this.width,this.height]]).extent([[0,0],[this.width,this.height]]).on("zoom",this.zoomFunction.bind(this)),this.innerSpace=this.svgViewport.append("g").attr("class","inner_space").attr("transform","translate("+this.margin.left+","+this.margin.top+")").call(this.zoom.bind(this));const t=s.timeFormat("%d/%m %H:%M");this.gX=this.innerSpace.append("g").attr("class","axis axis--x").attr("transform","translate(0,"+this.height+")").call(this.xAxis.ticks(6).tickFormat(t)),this.gY=this.innerSpace.append("g").attr("class","axis axis--y").call(this.yAxis),this.originalLine=s.line().x(t=>{if(t.timestamp instanceof Date)return this.chartProps.xScale(t.timestamp.getTime())}).y(t=>this.chartProps.yScale(t.price)),this.scaledLine=s.line().x(t=>{if(t.timestamp instanceof Date)return this.newxScale(t.timestamp.getTime())}).y(t=>this.newyScale(t.price))}addEventsArea(){return new h.a(t=>{this.view=this.innerSpace.append("rect").attr("class","zoom").attr("width",this.width).attr("height",this.height).on("mouseover",()=>{this.focus.style("display",null)}).on("mouseout",()=>{this.focus.style("display","none")}).on("mousemove",this.mousemove.bind(this)).on("touchstart",this.touchStart.bind(this)).on("touchmove",this.touchStart.bind(this)).on("touchend",()=>{this.focus.style("display",null)}),t.next(!0)})}drawLine$(t){return new h.a(e=>{this.drawLine(t),e.next(t)})}drawLine(t){t.timePriceArray.forEach(t=>{t.timestamp=a(t.timestamp).toDate()}),this.lineSvg=this.innerSpace.append("path").datum(t.timePriceArray).attr("class","linegraph").style("stroke","black").attr("d",this.originalLine.bind(this)(t.timePriceArray))}zoomFunction(){this.newxScale=s.event.transform.rescaleX(this.chartProps.xScale),this.newyScale=s.event.transform.rescaleY(this.chartProps.yScale),this.gX.call(this.xAxis.scale(this.newxScale)),this.gY.call(this.yAxis.scale(this.newyScale)),this.lineSvg.call(this.xAxis.scale(this.newxScale)),this.lineSvg.call(this.yAxis.scale(this.newyScale)),this.d3eventtransform=s.event.transform,this.changeLine(),this.moveToolTip()}changeLine(){this.lineSvg.attr("d",this.scaledLine.bind(this))}addTitleGraph(){this.titleSvg=this.innerSpace.append("text").attr("x",this.margin.left).attr("y",260).attr("class","graphic_title_text").attr("text-anchor","left").text(this.titleGraph)}addToolTips$(t){return new h.a(e=>{this.addToolTips(t),e.next(!0)})}addToolTips(t){this.focus=this.innerSpace.append("g").attr("class","this.focus").style("display","none"),this.focus.append("line").attr("class","x-hover-line hover-line").attr("y1",0).attr("y2",this.height).attr("pointer-events","none"),this.focus.append("line").attr("class","y-hover-line hover-line").attr("x1",this.width).attr("x2",this.width).attr("pointer-events","none"),this.focus.append("circle").attr("r",2).attr("pointer-events","none"),this.focus.append("text").attr("x",15).attr("dy",".31em")}touchStart(t,e,i){this.focus.style("display",null),this.mousemove(t,e,i)}mousemove(t,e,i){let a;a=this.newxScale?this.newxScale.invert(s.mouse(i[e])[0]):this.chartProps.xScale.invert(s.mouse(i[e])[0]);const h=this.bisectDate(this.linea1.timePriceArray,a,1),r=this.linea1.timePriceArray[h-1],n=this.linea1.timePriceArray[h];this.d=a.getTime()-r.timestamp.getTime()>n.timestamp.getTime()-a.getTime()?n:r,this.moveToolTip()}moveToolTip(){this.newxScale?this.focus.attr("transform",`translate(${this.newxScale(new Date(this.d.timestamp))},${this.newyScale(this.d.price)})`):this.focus.attr("transform",`translate(${this.chartProps.xScale(new Date(this.d.timestamp))},${this.chartProps.yScale(this.d.price)})`);const t=this.focus.select("text").text(()=>`${a(this.d.timestamp).format("DD/MM HH:mm")}h: ${Math.round(10*this.d.price)/10}`).node().getBBox();this.focus.selectAll("rect").remove();this.focus.append("rect").attr("x",t.x).attr("y",t.y).attr("width",t.width).attr("height",t.height).style("fill","white").style("fill-opacity",".3").style("stroke","#666").style("stroke-width","1.5px");let e=0;e=this.newyScale?this.newyScale(this.d.price):this.chartProps.yScale(this.d.price),this.focus.select(".x-hover-line").attr("y2",this.height-e),this.focus.select(".y-hover-line").attr("x2",this.width+this.width)}}}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZDMtdGltZWZvcm1hdGRlZmF1bHRsb2NhbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2QzaGlzdG9yeWdyYXBoLnRzIl0sIm5hbWVzIjpbImQzX3RpbWVmb3JtYXRkZWZhdWx0bG9jYWxlIiwiZGF0ZSIsImRhdGVUaW1lIiwiZGF5cyIsIm1vbnRocyIsInBlcmlvZHMiLCJzaG9ydERheXMiLCJzaG9ydE1vbnRocyIsInRpbWUiLCJfX3dlYnBhY2tfcmVxdWlyZV9fIiwiZCIsIl9fd2VicGFja19leHBvcnRzX18iLCJkM2hpc3RvcnlncmFwaF9HcmFwaExpbmVDb21wb25lbnQiLCJleHRlcm5hbF9kM18iLCJbb2JqZWN0IE9iamVjdF0iLCJsaW5lYXMiLCJ0aGlzIiwiYmlzZWN0RGF0ZSIsInRpbWVzdGFtcCIsInJpZ2h0IiwiYmlzZWN0VmFsdWUiLCJwcmljZSIsInN2Z1dpZHRoIiwic3ZnSGVpZ2h0IiwibWFyZ2luIiwidG9wIiwiYm90dG9tIiwibGVmdCIsIndpZHRoIiwiaGVpZ2h0Iiwib3JpZ2luYWxDaXJjbGUiLCJjeCIsImN5IiwiciIsImNoYXJ0UHJvcHMiLCJsaW5lR3JhcGhFbGVtZW50IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInRpdGxlR3JhcGgiLCJuZ09uSW5pdCIsIk9ic2VydmFibGUiLCJvYiIsImxpbmVhMSIsIm5leHQiLCJ0aXRsZXMiLCJmb3JFYWNoIiwibGluZGF0YSIsIm5hbWUiLCJnZXRUaXRsZXMiLCJwaXBlIiwiT2JqZWN0IiwibWVyZ2VNYXAiLCJnZXRMaW5lMSIsInN3aXRjaE1hcCIsImxpbiIsImRlZmluZUNoYXJ0JCIsIm9rIiwiZnJvbSIsImRyYXdMaW5lJCIsImRlbGF5IiwiY29uY2F0TWFwIiwiYWRkVG9vbFRpcHMkIiwiYWRkRXZlbnRzQXJlYSIsImNhdGNoRXJyb3IiLCJvZiIsInN1YnNjcmliZSIsImFkZFRpdGxlR3JhcGgiLCJyZW1vdmUiLCJkZWZpbmVDaGFydCIsInN2Z1ZpZXdwb3J0IiwiYXBwZW5kIiwic3R5bGUiLCJhdHRyIiwieFNjYWxlIiwiZG9tYWluIiwidGltZVByaWNlQXJyYXkiLCJEYXRlIiwiZ2V0VGltZSIsInJhbmdlIiwiY2xhbXAiLCJvbiIsInlTY2FsZSIsIk1hdGgiLCJtYXgiLCJtYXAiLCJ2YWx1ZSIsInhBeGlzIiwieUF4aXMiLCJ6b29tIiwic2NhbGVFeHRlbnQiLCJJbmZpbml0eSIsInRyYW5zbGF0ZUV4dGVudCIsImV4dGVudCIsInpvb21GdW5jdGlvbiIsImJpbmQiLCJpbm5lclNwYWNlIiwiY2FsbCIsImZvcm1hdEV2ZXJkIiwiZ1giLCJ0aWNrcyIsInRpY2tGb3JtYXQiLCJnWSIsIm9yaWdpbmFsTGluZSIsIngiLCJ5Iiwic2NhbGVkTGluZSIsIm5ld3hTY2FsZSIsIm5ld3lTY2FsZSIsInZpZXciLCJmb2N1cyIsIm1vdXNlbW92ZSIsInRvdWNoU3RhcnQiLCJsaW5lIiwiZHJhd0xpbmUiLCJwb2ludCIsImV4dGVybmFsX21vbWVudF8iLCJ0b0RhdGUiLCJsaW5lU3ZnIiwiZGF0dW0iLCJ0cmFuc2Zvcm0iLCJyZXNjYWxlWCIsInJlc2NhbGVZIiwic2NhbGUiLCJkM2V2ZW50dHJhbnNmb3JtIiwiY2hhbmdlTGluZSIsIm1vdmVUb29sVGlwIiwidGl0bGVTdmciLCJ0ZXh0IiwiYWRkVG9vbFRpcHMiLCJqIiwibm9kZXMiLCJ4MCIsImludmVydCIsImkiLCJkMCIsImQxIiwiYmJveCIsInNlbGVjdCIsImZvcm1hdCIsInJvdW5kIiwibm9kZSIsImdldEJCb3giLCJzZWxlY3RBbGwiLCJuZXd5MiJdLCJtYXBwaW5ncyI6Im9MQThDZSxJQUFBQSxFQTVDdUMsQ0FDbERDLEtBQU0sV0FDTkMsU0FBVSxpQkFDVkMsS0FBTSxDQUNKLFVBQ0EsUUFDQSxTQUNBLFlBQ0EsU0FDQSxVQUNBLFVBRUZDLE9BQVEsQ0FDSixRQUNBLFVBQ0EsUUFDQSxRQUNBLE9BQ0EsUUFDQSxRQUNBLFNBQ0EsYUFDQSxVQUNBLFlBQ0EsYUFFSkMsUUFBUyxDQUFDLEtB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QUFNeEQsS0FBS1ksTUFBUVosS0FBS1kiLCJmaWxlIjoiZDNoaXN0b3J5Z3JhcGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUaW1lTG9jYWxlRGVmaW5pdGlvbiB9IGZyb20gJ2QzJztcblxuY29uc3QgdGltZWZvcm1hdGRlZmF1bHRsb2NhbGU6IFRpbWVMb2NhbGVEZWZpbml0aW9uID0ge1xuICAgIGRhdGU6ICclZC4lbS4lWScsXG4gICAgZGF0ZVRpbWU6ICclYSAlYiAlZSAlWCAlWScsXG4gICAgZGF5czogW1xuICAgICAgJ0RvbWluZ28nLFxuICAgICAgJ0x1bmVzJyxcbiAgICAgICdNYXJ0ZXMnLFxuICAgICAgJ01pw6lyY29sZXMnLFxuICAgICAgJ0p1ZXZlcycsXG4gICAgICAnVmllcm5lcycsXG4gICAgICAnU8OhYmFkbycsXG4gICAgXSxcbiAgICBtb250aHM6IFtcbiAgICAgICAgJ0VuZXJvJyxcbiAgICAgICAgJ0ZlYnJlcm8nLFxuICAgICAgICAnTWFyem8nLFxuICAgICAgICAnQWJyaWwnLFxuICAgICAgICAnTWF5bycsXG4gICAgICAgICdKdW5pbycsXG4gICAgICAgICdKdWxpbycsXG4gICAgICAgICdBZ29zdG8nLFxuICAgICAgICAnU2VwdGllbWJyZScsXG4gICAgICAgICdPY3R1YnJlJyxcbiAgICAgICAgJ05vdmllbWJyZScsXG4gICAgICAgICdEaWNpZW1icmUnLFxuICAgIF0sXG4gICAgcGVyaW9kczogWydBTScsICdQTSddLFxuICAgIHNob3J0RGF5czogWydEbycsICdMdScsICdNYScsICdNaScsICdKdScsICdWaScsICdTYSddLFxuICAgIHNob3J0TW9udGhzOiBbXG4gICAgICAgICdFbmUnLFxuICAgICAgICAnRmViJyxcbiAgICAgICAgJ01hcicsXG4gICAgICAgICdBYnInLFxuICAgICAgICAnTWF5JyxcbiAgICAgICAgJ0p1bicsXG4gICAgICAgICdKdWwnLFxuICAgICAgICAnQWdvJyxcbiAgICAgICAgJ1NlcCcsXG4gICAgICAgICdPY3QnLFxuICAgICAgICAnTm92JyxcbiAgICAgICAgJ0RpYycsXG4gICAgXSxcbiAgICB0aW1lOiAnJUg6JU06JVMnLFxufTtcbmV4cG9ydCBkZWZhdWx0IHRpbWVmb3JtYXRkZWZhdWx0bG9jYWxlO1xuIiwiaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBmcm9tLCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgY29uY2F0TWFwLCBkZWxheSwgbWVyZ2VNYXAsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCBJQ29pbkhpc3RvcnkgZnJvbSAnLi9jb2luLWhpc3RvcnkuaW50ZXJmYWNlJztcbmltcG9ydCB0aW1lRm9ybWF0RGVmYXVsdExvY2FsZSBmcm9tICcuL2QzLXRpbWVmb3JtYXRkZWZhdWx0bG9jYWxlJztcbmltcG9ydCBJVGltZVByaWNlIGZyb20gJy4vdGltZXByaWNlLmludGVyZmFjZSc7XG5cbmQzLnRpbWVGb3JtYXREZWZhdWx0TG9jYWxlKHRpbWVGb3JtYXREZWZhdWx0TG9jYWxlKTtcblxuaW50ZXJmYWNlIElTY2FsZXMge1xuICB4U2NhbGU6IGQzLlNjYWxlVGltZTxudW1iZXIsIG51bWJlcj47XG4gIHlTY2FsZTogZDMuU2NhbGVMaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xufVxuXG5leHBvcnQgY2xhc3MgR3JhcGhMaW5lQ29tcG9uZW50IHtcbiAgICBwdWJsaWMgZDogSVRpbWVQcmljZTtcbiAgICBwdWJsaWMgcGFuWDogYW55O1xuICAgIHB1YmxpYyBwYW5ZOiBhbnk7XG4gICAgcHVibGljIHNjYWxlTXVsdGlwbGllcjogYW55O1xuICAgIC8vIHB1YmxpYyBkM2V2ZW50dHJhbnNmb3JtOiBhbnkgPSB7IGs6IDEsIHg6IDAsIHk6IDAgfTtcbiAgICBwdWJsaWMgZDNldmVudHRyYW5zZm9ybTogYW55O1xuICAgIC8vIHB1YmxpYyBuZXd5U2NhbGU6IGQzLkF4aXNTY2FsZTxudW1iZXIgfCB7IHZhbHVlT2YoKTogbnVtYmVyOyB9PjtcbiAgICAvLyBwdWJsaWMgbmV3eFNjYWxlOiBkMy5BeGlzU2NhbGU8bnVtYmVyIHwgeyB2YWx1ZU9mKCk6IG51bWJlcjsgfT47XG4gICAgcHVibGljIG5ld3lTY2FsZTogYW55OyAvLyBhc2lnbmFyIGVuIGVsIGNvbnRydWN0b3IgbyBlcXVpdmFsZW50ZVxuICAgIHB1YmxpYyBuZXd4U2NhbGU6IGFueTtcbiAgICBwdWJsaWMgYmlzZWN0RGF0ZSA9IGQzLmJpc2VjdG9yKChkOiBJVGltZVByaWNlKSA9PiBkLnRpbWVzdGFtcCkucmlnaHQ7XG4gICAgcHVibGljIGJpc2VjdFZhbHVlID0gZDMuYmlzZWN0b3IoKGQ6IElUaW1lUHJpY2UpID0+IGQucHJpY2UpLnJpZ2h0O1xuICAgIHB1YmxpYyBzdmdXaWR0aCA9IDgwMDtcbiAgICBwdWJsaWMgc3ZnSGVpZ2h0ID0gMzAwO1xuICAgIHB1YmxpYyBtYXJnaW4gPSB7IHRvcDogMzAsIHJpZ2h0OiA0MCwgYm90dG9tOiA1MCwgbGVmdDogNjAgfTtcbiAgICBwdWJsaWMgd2lkdGggPSB0aGlzLnN2Z1dpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgIHB1YmxpYyBoZWlnaHQgPSB0aGlzLnN2Z0hlaWdodCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbTtcbiAgICBwdWJsaWMgb3JpZ2luYWxMaW5lOiBkMy5MaW5lPElUaW1lUHJpY2U+O1xuICAgIHB1YmxpYyBzY2FsZWRMaW5lOiBkMy5MaW5lPElUaW1lUHJpY2U+O1xuICAgIHB1YmxpYyBvcmlnaW5hbENpcmNsZSA9IHtcbiAgICBjeDogLTE1MCxcbiAgICBjeTogLTE1LFxuICAgIHI6IDIwLFxuICAgIH07XG4gICAgcHVibGljIGNoYXJ0UHJvcHMgPSB7fSBhcyBJU2NhbGVzO1xuICAgIHB1YmxpYyBnWDogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCB7fSwgbnVsbCwgdW5kZWZpbmVkPjtcbiAgICBwdWJsaWMgZ1k6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gICAgcHVibGljIGRyYXdlZExpbmVzOiBBcnJheTxkMy5TZWxlY3Rpb248U1ZHR0VsZW1lbnQsIHt9LCBudWxsLCB1bmRlZmluZWQ+PjtcbiAgICBwdWJsaWMgbGluZVN2ZzogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCB7fSwgbnVsbCwgdW5kZWZpbmVkPjtcbiAgICBwdWJsaWMgdmlldzogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCB7fSwgbnVsbCwgdW5kZWZpbmVkPjtcbiAgICBwdWJsaWMgaW5uZXJTcGFjZTogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCB7fSwgbnVsbCwgdW5kZWZpbmVkPjtcbiAgICBwdWJsaWMgc3ZnVmlld3BvcnQ6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gICAgcHVibGljIHRvb2x0aXA6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gICAgcHVibGljIHRvb2x0aXBUaXRsZTogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCB7fSwgbnVsbCwgdW5kZWZpbmVkPjtcbiAgICBwdWJsaWMgdG9vbHRpcFRleHQ6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gICAgcHVibGljIHRpdGxlU3ZnOiBkMy5TZWxlY3Rpb248U1ZHR0VsZW1lbnQsIHt9LCBudWxsLCB1bmRlZmluZWQ+O1xuICAgIHB1YmxpYyBmb2N1czogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCB7fSwgbnVsbCwgdW5kZWZpbmVkPjtcbiAgICBwdWJsaWMgem9vbTogZDMuWm9vbUJlaGF2aW9yPEVsZW1lbnQsIHt9PjtcbiAgICBwdWJsaWMgeEF4aXM6IGQzLkF4aXM8bnVtYmVyIHwgeyB2YWx1ZU9mKCk6IG51bWJlciB9PjtcbiAgICBwdWJsaWMgeUF4aXM6IGQzLkF4aXM8bnVtYmVyIHwgeyB2YWx1ZU9mKCk6IG51bWJlciB9PjtcbiAgICBwdWJsaWMgbGluZUdyYXBoRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5lY2hhcnQnKTtcbiAgICBwdWJsaWMgbGluZWExOiBJQ29pbkhpc3Rvcnk7XG4gICAgcHVibGljIHRpdGxlR3JhcGggPSAnJztcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGxpbmVhczogSUNvaW5IaXN0b3J5W10sXG4gICAgKSB7XG4gICAgICAgIHRoaXMubmdPbkluaXQoKTtcbiAgICB9XG4gICAgcHVibGljIGdldExpbmUxKCk6IE9ic2VydmFibGU8SUNvaW5IaXN0b3J5PiB7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxJQ29pbkhpc3Rvcnk+KChvYikgPT4ge1xuICAgICAgICAgICAgdGhpcy5saW5lYTEgPSB0aGlzLmxpbmVhc1swXTtcbiAgICAgICAgICAgIG9iLm5leHQodGhpcy5saW5lYXNbMF0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VGl0bGVzKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxzdHJpbmc+KChvYikgPT4ge1xuICAgICAgICAgICAgbGV0IHRpdGxlcyA9ICcnO1xuICAgICAgICAgICAgdGhpcy5saW5lYXMuZm9yRWFjaCgobGluZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGxpbmRhdGEubmFtZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aXRsZXMgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdGl0bGVzID0gbGluZGF0YS5uYW1lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGl0bGVzID0gdGl0bGVzICsgJyAvICcgKyBsaW5kYXRhLm5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRpdGxlR3JhcGggPSB0aXRsZXM7XG4gICAgICAgICAgICBvYi5uZXh0KHRpdGxlcyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5nZXRUaXRsZXMoKVxuICAgICAgICAucGlwZShcbiAgICAgICAgbWVyZ2VNYXAoKHRpdGxlcykgPT4gdGhpcy5nZXRMaW5lMSgpKSxcbiAgICAgICAgc3dpdGNoTWFwKChsaW4pID0+IHRoaXMuZGVmaW5lQ2hhcnQkKCkpLFxuICAgICAgICBzd2l0Y2hNYXAoKG9rKSA9PiBmcm9tKHRoaXMubGluZWFzKSksXG4gICAgICAgIG1lcmdlTWFwKChsaW4pID0+IHRoaXMuZHJhd0xpbmUkKGxpbikpLFxuICAgICAgICBkZWxheSgxMDAwKSxcbiAgICAgICAgY29uY2F0TWFwKChsaW4pID0+IHRoaXMuYWRkVG9vbFRpcHMkKGxpbikpLFxuICAgICAgICBjb25jYXRNYXAoKGxpbikgPT4gdGhpcy5hZGRFdmVudHNBcmVhKCkpLFxuICAgICAgICBjYXRjaEVycm9yKCgpID0+IG9mKCdlcnJvcicpKSxcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKChvaykgPT4ge1xuICAgICAgICB0aGlzLmFkZFRpdGxlR3JhcGgoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBkZWxldGVTdmcoKSB7XG4gICAgICAgIC8vIGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCkuc2VsZWN0KCdzdmcnKS5yZW1vdmUoKTtcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMubGluZUdyYXBoRWxlbWVudCkucmVtb3ZlKCk7XG4gICAgfVxuICAgIHB1YmxpYyBkZWZpbmVDaGFydCQoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxib29sZWFuPigob2IpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVmaW5lQ2hhcnQoKTtcbiAgICAgICAgICAgIG9iLm5leHQodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwdWJsaWMgZGVmaW5lQ2hhcnQoKSB7XG4gICAgICAgIHRoaXMuc3ZnVmlld3BvcnQgPSBkM1xuICAgICAgICAuc2VsZWN0KHRoaXMubGluZUdyYXBoRWxlbWVudClcbiAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kJywgJ3doaXRlJylcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBgMCAwICR7dGhpcy5zdmdXaWR0aH0gJHt0aGlzLnN2Z0hlaWdodH1gKTtcbiAgICAgICAgdGhpcy5jaGFydFByb3BzLnhTY2FsZSA9IGQzXG4gICAgICAgIC5zY2FsZVRpbWUoKVxuICAgICAgICAuZG9tYWluKGQzLmV4dGVudCh0aGlzLmxpbmVhMS50aW1lUHJpY2VBcnJheSwgKGQpID0+IG5ldyBEYXRlKGQudGltZXN0YW1wKS5nZXRUaW1lKCkpKVxuICAgICAgICAucmFuZ2UoWzAsIHRoaXMud2lkdGhdKVxuICAgICAgICAuY2xhbXAodHJ1ZSk7XG5cbiAgICAgICAgLy8gZGVzYWN0aXZvIGVsIHpvb20gZGVsIHN2ZyBwYXJhIHF1ZVxuICAgICAgICAvLyBubyBpbnRlcmZpZXJhIGNvbiBlbCB6b29tIGRlbCBsaW5lc3ZnXG4gICAgICAgIHRoaXMuc3ZnVmlld3BvcnQub24oJ21vdXNlZG93bi56b29tJywgbnVsbClcbiAgICAgICAgLm9uKCd0b3VjaHN0YXJ0Lnpvb20nLCBudWxsKVxuICAgICAgICAub24oJ3RvdWNobW92ZS56b29tJywgbnVsbClcbiAgICAgICAgLm9uKCd0b3VjaGVuZC56b29tJywgbnVsbCk7XG5cbiAgICAgICAgdGhpcy5jaGFydFByb3BzLnlTY2FsZSA9IGQzXG4gICAgICAgIC5zY2FsZUxpbmVhcigpXG4gICAgICAgIC5kb21haW4oW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIGQzLm1heChcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVhcyxcbiAgICAgICAgICAgICAgICAoZCkgPT4gTWF0aC5tYXgoLi4uZC50aW1lUHJpY2VBcnJheS5tYXAoKHZhbHVlKSA9PiB2YWx1ZS5wcmljZSkpICogMS4xLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgXSlcbiAgICAgICAgLnJhbmdlKFt0aGlzLmhlaWdodCwgMF0pXG4gICAgICAgIC5jbGFtcCh0cnVlKTtcblxuICAgICAgICB0aGlzLnhBeGlzID0gZDMuYXhpc0JvdHRvbSh0aGlzLmNoYXJ0UHJvcHMueFNjYWxlKTtcbiAgICAgICAgdGhpcy55QXhpcyA9IGQzLmF4aXNMZWZ0KHRoaXMuY2hhcnRQcm9wcy55U2NhbGUpO1xuICAgICAgICB0aGlzLnpvb20gPSBkMy56b29tKClcbiAgICAgICAgLnNjYWxlRXh0ZW50KFsxLCBJbmZpbml0eV0pXG4gICAgICAgIC50cmFuc2xhdGVFeHRlbnQoW1swLCAwXSwgW3RoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XV0pXG4gICAgICAgIC5leHRlbnQoW1swLCAwXSwgW3RoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XV0pXG4gICAgICAgIC5vbignem9vbScsIHRoaXMuem9vbUZ1bmN0aW9uLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuaW5uZXJTcGFjZSA9IHRoaXMuc3ZnVmlld3BvcnRcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdpbm5lcl9zcGFjZScpXG4gICAgICAgIC5hdHRyKFxuICAgICAgICAndHJhbnNmb3JtJyxcbiAgICAgICAgJ3RyYW5zbGF0ZSgnICsgdGhpcy5tYXJnaW4ubGVmdCArICcsJyArIHRoaXMubWFyZ2luLnRvcCArICcpJyxcbiAgICAgICAgKVxuICAgICAgICAuY2FsbCh0aGlzLnpvb20uYmluZCh0aGlzKSk7XG4gICAgICAgIGNvbnN0IGZvcm1hdEV2ZXJkID0gZDMudGltZUZvcm1hdCgnJWQvJW0gJUg6JU0nKTtcbiAgICAgICAgdGhpcy5nWCA9IHRoaXMuaW5uZXJTcGFjZVxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLS14JylcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJyArIHRoaXMuaGVpZ2h0ICsgJyknKVxuICAgICAgICAgICAgLmNhbGwodGhpcy54QXhpcy50aWNrcyg2KS50aWNrRm9ybWF0KGZvcm1hdEV2ZXJkKSk7XG5cbiAgICAgICAgdGhpcy5nWSA9IHRoaXMuaW5uZXJTcGFjZVxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLS15JylcbiAgICAgICAgICAgIC5jYWxsKHRoaXMueUF4aXMpO1xuXG4gICAgICAgIHRoaXMub3JpZ2luYWxMaW5lID0gZDNcbiAgICAgICAgICAgIC5saW5lPElUaW1lUHJpY2U+KClcbiAgICAgICAgICAgIC54KChkKSA9PiB7XG4gICAgICAgICAgICBpZiAoZC50aW1lc3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2QuZGF0ZTogJywgZC5kYXRlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFydFByb3BzLnhTY2FsZShkLnRpbWVzdGFtcC5nZXRUaW1lKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC55KChkKSA9PiB0aGlzLmNoYXJ0UHJvcHMueVNjYWxlKGQucHJpY2UpKTtcblxuICAgICAgICB0aGlzLnNjYWxlZExpbmUgPSBkM1xuICAgICAgICAubGluZTxJVGltZVByaWNlPigpXG4gICAgICAgIC54KChkKSA9PiB7XG4gICAgICAgIGlmIChkLnRpbWVzdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkLmRhdGU6ICcsIGQuZGF0ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXd4U2NhbGUoZC50aW1lc3RhbXAuZ2V0VGltZSgpKTtcbiAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAueSgoZCkgPT4gdGhpcy5uZXd5U2NhbGUoZC5wcmljZSkpO1xuICAgIH1cbiAgICBwdWJsaWMgYWRkRXZlbnRzQXJlYSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPGJvb2xlYW4+KChvYikgPT4ge1xuICAgICAgICAgICAgdGhpcy52aWV3ID0gdGhpcy5pbm5lclNwYWNlXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd6b29tJylcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAub24oJ21vdXNlb3ZlcicsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzLnN0eWxlKCdkaXNwbGF5JywgbnVsbCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcykpXG4gICAgICAgICAgICAub24oJ3RvdWNoc3RhcnQnLCB0aGlzLnRvdWNoU3RhcnQuYmluZCh0aGlzKSlcbiAgICAgICAgICAgIC5vbigndG91Y2htb3ZlJywgdGhpcy50b3VjaFN0YXJ0LmJpbmQodGhpcykpXG4gICAgICAgICAgICAub24oJ3RvdWNoZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXMuc3R5bGUoJ2Rpc3BsYXknLCBudWxsKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBvYi5uZXh0KHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHVibGljIGRyYXdMaW5lJChsaW5lOiBJQ29pbkhpc3RvcnkpIHtcbiAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxJQ29pbkhpc3Rvcnk+KChvYikgPT4ge1xuICAgICAgICAgIHRoaXMuZHJhd0xpbmUobGluZSk7XG4gICAgICAgICAgb2IubmV4dChsaW5lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBwdWJsaWMgZHJhd0xpbmUobGluZTogSUNvaW5IaXN0b3J5KSB7XG4gICAgICAgIGxpbmUudGltZVByaWNlQXJyYXkuZm9yRWFjaCgocG9pbnQpID0+IHtcbiAgICAgICAgICAgIHBvaW50LnRpbWVzdGFtcCA9IG1vbWVudChwb2ludC50aW1lc3RhbXApLnRvRGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5saW5lU3ZnID0gdGhpcy5pbm5lclNwYWNlXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5kYXR1bShsaW5lLnRpbWVQcmljZUFycmF5KVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpbmVncmFwaCcpXG4gICAgICAgICAgICAvLyAuc3R5bGUoJ3N0cm9rZScsIGNvbG9yX2NvZGUpIC8vIGHDsWFkaXIgYXF1w60gZWwgY29sb3IgcXVlIHZpZW5lIGRlIGxvcyBkYXRvcyBkZSBsYSBsaW5lYVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLm9yaWdpbmFsTGluZS5iaW5kKHRoaXMpKGxpbmUudGltZVByaWNlQXJyYXkpKTtcbiAgICB9XG4gICAgcHVibGljIHpvb21GdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5uZXd4U2NhbGUgPSBkMy5ldmVudC50cmFuc2Zvcm0ucmVzY2FsZVgodGhpcy5jaGFydFByb3BzLnhTY2FsZSk7XG4gICAgICAgIHRoaXMubmV3eVNjYWxlID0gZDMuZXZlbnQudHJhbnNmb3JtLnJlc2NhbGVZKHRoaXMuY2hhcnRQcm9wcy55U2NhbGUpO1xuICAgICAgICAvLyB1cGRhdGUgYXhlc1xuICAgICAgICB0aGlzLmdYLmNhbGwodGhpcy54QXhpcy5zY2FsZSh0aGlzLm5ld3hTY2FsZSkpO1xuICAgICAgICB0aGlzLmdZLmNhbGwodGhpcy55QXhpcy5zY2FsZSh0aGlzLm5ld3lTY2FsZSkpO1xuICAgICAgICB0aGlzLmxpbmVTdmcuY2FsbCh0aGlzLnhBeGlzLnNjYWxlKHRoaXMubmV3eFNjYWxlKSk7XG4gICAgICAgIHRoaXMubGluZVN2Zy5jYWxsKHRoaXMueUF4aXMuc2NhbGUodGhpcy5uZXd5U2NhbGUpKTtcblxuICAgICAgICB0aGlzLmQzZXZlbnR0cmFuc2Zvcm0gPSBkMy5ldmVudC50cmFuc2Zvcm07XG4gICAgICAgIC8vIHRoaXMubGluZVN2Zy5hdHRyKCd0cmFuc2Zvcm0nLCB0aGlzLmQzZXZlbnR0cmFuc2Zvcm0pO1xuXG4gICAgICAgIC8vIHRoaXMuY2hhcnRQcm9wcy54U2NhbGUuZG9tYWluKG5ld0RvbWFpblgpO1xuICAgICAgICAvLyB0aGlzLmNoYXJ0UHJvcHMueVNjYWxlLmRvbWFpbihkMy5ldmVudC50cmFuc2Zvcm0ucmVzY2FsZVkodGhpcy5jaGFydFByb3BzLnlTY2FsZS5kb21haW4oKSkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2UgZXNjYWxhJyk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VMaW5lKCk7XG5cbiAgICAgICAgdGhpcy5tb3ZlVG9vbFRpcCgpO1xuXG4gICAgfVxuXG4gICAgcHVibGljIGNoYW5nZUxpbmUoKSB7XG4gICAgICAgIHRoaXMubGluZVN2Z1xuICAgICAgICAuYXR0cignZCcsIHRoaXMuc2NhbGVkTGluZS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhbW9zIGxhcyBmdW5jaW9uZXMgcXVlIGNyZWFuIGxvcyBjaXJjdWxvcyB5IGxvcyB0b29sdGlwc1xuXG4gICAgcHVibGljIGFkZFRpdGxlR3JhcGgoKSB7XG4gICAgICAvLyBlc3RlIGVzIGVsIHTDrXR1bG8gcXVlIGRlYmVyw61hIGFwYXJlY2VyIGRlYmFqbyBkZSBsYSBncsOhZmljYVxuICAgICAgLy8gY29ycmVnaW1vcyBlbCBtYXJnZW4gdG9wXG4gICAgICAvLyBjb25zdCBkaXN0VGV4dFRvcCA9IHRoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wO1xuICAgICAgY29uc3QgZGlzdFRleHRUb3AgPSAyNjA7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZGlzdFRleHRUb3A6ICcsIGRpc3RUZXh0VG9wKTtcbiAgICAgIHRoaXMudGl0bGVTdmcgPSB0aGlzLmlubmVyU3BhY2VcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLm1hcmdpbi5sZWZ0KVxuICAgICAgLy8gLmF0dHIoJ3knLCAwIC0gdGhpcy5tYXJnaW4udG9wIC8gNClcbiAgICAgIC5hdHRyKCd5JywgZGlzdFRleHRUb3ApXG4gICAgICAuYXR0cignY2xhc3MnLCAnZ3JhcGhpY190aXRsZV90ZXh0JylcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdsZWZ0JylcbiAgICAgIC50ZXh0KHRoaXMudGl0bGVHcmFwaCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFRvb2xUaXBzJChsaW5lOiBJQ29pbkhpc3RvcnkpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4oKG9iKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkVG9vbFRpcHMobGluZSk7XG4gICAgICAgIG9iLm5leHQodHJ1ZSk7XG4gICAgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBhZGRUb29sVGlwcyhsaW5lOiBJQ29pbkhpc3RvcnkpIHtcbiAgICAgICAgLy8gYWN0aXZhbW9zIGVsIGV2ZW50byBcIm1vdXNlb3ZlclwiIHBhcmEgbGEgbGluZWEgZGVsIGFyZ3VtZW50b1xuICAgICAgICAvLyBzZSBpdGVyYSBwYXJhIGNhZGEgcHVudG8gZGUgbGEgbMOtbmVhXG4gICAgICAgIC8vIHVzYW5kbyBsYSBzZWxlY2Npb24gZGUgY2lyY3Vsb3MgZGlidWphZG9zIGVuIGNhZGEgcHVudG9cbiAgICAgICAgLy8gbm8gZXN0w6EgY2xhcm8gY29tbyBzZSBpdGVyYSBzaW4gdXNhciBsYSB2YXJpYWJsZSBpXG4gICAgICAgIC8vIGZvciAobGV0IGkgb2YgbGluZS50aW1lUHJpY2VBcnJheSkge1xuICAgICAgICAgICAgdGhpcy5mb2N1cyA9IHRoaXMuaW5uZXJTcGFjZVxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGhpcy5mb2N1cycpXG4gICAgICAgICAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgICAgICB0aGlzLmZvY3VzXG4gICAgICAgICAgICAuYXBwZW5kKCdsaW5lJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd4LWhvdmVyLWxpbmUgaG92ZXItbGluZScpXG4gICAgICAgICAgICAuYXR0cigneTEnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3kyJywgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuXG4gICAgICAgICAgICB0aGlzLmZvY3VzXG4gICAgICAgICAgICAuYXBwZW5kKCdsaW5lJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd5LWhvdmVyLWxpbmUgaG92ZXItbGluZScpXG4gICAgICAgICAgICAuYXR0cigneDEnLCB0aGlzLndpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ3gyJywgdGhpcy53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9jdXNcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAuYXR0cigncicsIDIpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuXG4gICAgICAgICAgICB0aGlzLmZvY3VzXG4gICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMTUpXG4gICAgICAgICAgICAuYXR0cignZHknLCAnLjMxZW0nKTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIHB1YmxpYyB0b3VjaFN0YXJ0KGRhdHVtOiBhbnksIGo6IGFueSwgbm9kZXM6IGFueSkge1xuICAgICAgICB0aGlzLmZvY3VzLnN0eWxlKCdkaXNwbGF5JywgbnVsbCk7XG4gICAgICAgIHRoaXMubW91c2Vtb3ZlKGRhdHVtLCBqLCBub2Rlcyk7XG4gICAgfVxuXG4gICAgcHVibGljIG1vdXNlbW92ZShkYXR1bTogYW55LCBqOiBhbnksIG5vZGVzOiBhbnkpIHtcbiAgICAgICAgbGV0IHgwO1xuICAgICAgICBpZiAodGhpcy5uZXd4U2NhbGUpIHtcbiAgICAgICAgICAgIHgwID0gdGhpcy5uZXd4U2NhbGUuaW52ZXJ0KGQzLm1vdXNlKG5vZGVzW2pdKVswXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4MCA9IHRoaXMuY2hhcnRQcm9wcy54U2NhbGUuaW52ZXJ0KGQzLm1vdXNlKG5vZGVzW2pdKVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaSA9IHRoaXMuYmlzZWN0RGF0ZSh0aGlzLmxpbmVhMS50aW1lUHJpY2VBcnJheSwgeDAsIDEpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnaTogJywgaSk7XG5cbiAgICAgICAgY29uc3QgZDAgPSB0aGlzLmxpbmVhMS50aW1lUHJpY2VBcnJheVtpIC0gMV07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkMDogJywgZDApO1xuXG4gICAgICAgIGNvbnN0IGQxID0gdGhpcy5saW5lYTEudGltZVByaWNlQXJyYXlbaV07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkMTogJywgZDEpO1xuXG4gICAgICAgIHRoaXMuZCA9XG4gICAgICAgICAgICB4MC5nZXRUaW1lKCkgLSAoZDAudGltZXN0YW1wIGFzIERhdGUpLmdldFRpbWUoKSA+XG4gICAgICAgICAgICAoZDEudGltZXN0YW1wIGFzIERhdGUpLmdldFRpbWUoKSAtIHgwLmdldFRpbWUoKVxuICAgICAgICAgICAgPyBkMVxuICAgICAgICAgICAgOiBkMDtcbiAgICAgICAgdGhpcy5tb3ZlVG9vbFRpcCgpO1xuXG4gICAgfVxuXG4gICAgcHVibGljIG1vdmVUb29sVGlwKCkge1xuICAgICAgICBpZiAodGhpcy5uZXd4U2NhbGUpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNcbiAgICAgICAgICAgIC5hdHRyKFxuICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgICAgICAgICAgIGB0cmFuc2xhdGUoJHt0aGlzLm5ld3hTY2FsZShcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGUodGhpcy5kLnRpbWVzdGFtcCksXG4gICAgICAgICAgICAgICAgKX0sJHt0aGlzLm5ld3lTY2FsZSh0aGlzLmQucHJpY2UpfSlgKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb2N1c1xuICAgICAgICAgICAgLmF0dHIoXG4gICAgICAgICAgICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICAgICAgICAgICAgYHRyYW5zbGF0ZSgke3RoaXMuY2hhcnRQcm9wcy54U2NhbGUoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKHRoaXMuZC50aW1lc3RhbXApLFxuICAgICAgICAgICAgICAgICl9LCR7dGhpcy5jaGFydFByb3BzLnlTY2FsZSh0aGlzLmQucHJpY2UpfSlgKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyogaWYgKHRoaXMuZDNldmVudHRyYW5zZm9ybSkge1xuICAgICAgICAgIHRoaXMuZm9jdXMuYXR0cihcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgICAgICAgdGhpcy5kM2V2ZW50dHJhbnNmb3JtXG4gICAgICAgICAgKVxuICAgICAgICB9ICovXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2hhcnRQcm9wcy54U2NhbGUobmV3IERhdGUoZC5kYXRlKSkpO1xuXG4gICAgICAgIGNvbnN0IHRleHQ6IGFueSA9IHRoaXMuZm9jdXNcbiAgICAgICAgICAgIC5zZWxlY3QoJ3RleHQnKVxuICAgICAgICAgICAgLnRleHQoXG4gICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgIGAke21vbWVudCh0aGlzLmQudGltZXN0YW1wKS5mb3JtYXQoJ0REL01NIEhIOm1tJyl9aDogJHtNYXRoLnJvdW5kKFxuICAgICAgICAgICAgICAgIHRoaXMuZC5wcmljZSAqIDEwLFxuICAgICAgICAgICAgICAgICkgLyAxMH1gLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBiYm94ID0gdGV4dC5ub2RlKCkuZ2V0QkJveCgpO1xuXG4gICAgICAgIHRoaXMuZm9jdXMuc2VsZWN0QWxsKCdyZWN0JykucmVtb3ZlKCk7XG5cbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZm9jdXNcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBiYm94LngpXG4gICAgICAgICAgICAuYXR0cigneScsIGJib3gueSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGJib3gud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgYmJveC5oZWlnaHQpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAnd2hpdGUnKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAnLjMnKVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnIzY2NicpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsICcxLjVweCcpO1xuXG4gICAgICAgIGxldCBuZXd5MiA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMubmV3eVNjYWxlKSB7XG4gICAgICAgICAgICBuZXd5MiA9IHRoaXMubmV3eVNjYWxlKHRoaXMuZC5wcmljZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXd5MiA9IHRoaXMuY2hhcnRQcm9wcy55U2NhbGUodGhpcy5kLnByaWNlKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXNjYWxvIGxhIHBvc2ljaW9uIHkyIGRlIGxhIGzDrW5lYSBzZWfDum4gbGEgbnVldmEgZXNjYWxhIHNpIHNlIGhhIGhlY2hvIHpvb21cbiAgICAgICAgdGhpcy5mb2N1c1xuICAgICAgICAgICAgLnNlbGVjdCgnLngtaG92ZXItbGluZScpXG4gICAgICAgICAgICAuYXR0cigneTInLCB0aGlzLmhlaWdodCAtIG5ld3kyKTtcblxuICAgICAgICB0aGlzLmZvY3VzLnNlbGVjdCgnLnktaG92ZXItbGluZScpLmF0dHIoJ3gyJywgdGhpcy53aWR0aCArIHRoaXMud2lkdGgpO1xuXG4gICAgICAgIC8vIGlmICh0aGlzLmQzZXZlbnR0cmFuc2Zvcm0pIHtcbiAgICAgICAgLy8gICAgIHRoaXMudmlldy5hdHRyKCd0cmFuc2Zvcm0nLCB0aGlzLmQzZXZlbnR0cmFuc2Zvcm0pO1xuICAgICAgICAvLyB9XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==