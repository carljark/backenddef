import * as d3 from 'd3';
import { ContainerElement } from 'd3';
import * as moment from 'moment';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, delay, map, mapTo, mergeMap, switchMap } from 'rxjs/operators';
import ICoinHistory from './coin-history.interface';
import timeFormatDefaultLocale from './d3-timeformatdefaultlocale';
import ITimePrice from './timeprice.interface';

import config from './environment';

import changeWidth$ from './responsive';

import {SocketioService} from './socketio.service';

import ISimpleCoin from './simplecoin.interface';

d3.timeFormatDefaultLocale(timeFormatDefaultLocale);

interface IScales {
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export class GraphLineComponent {
    public static removeSvg$(coinName: string): Observable<boolean> {
        return of(d3.select(`#${coinName}`).remove())
        .pipe(
            mapTo(true),
        );
    }
    public currentPointIndex: number = 0;
    public formatEverd = d3.timeFormat('%d/%m %H:%M');
    public txtNode: SVGTextElement;
    public bbox: DOMRect;
    public distanciaLeft: number;
    public distanciaRight: number;
    public d: ITimePrice = {price: 0, timestamp: new Date()};
    public panX: any;
    public panY: any;
    public scaleMultiplier: any;
    // public d3eventtransform: any = { k: 1, x: 0, y: 0 };
    public d3eventtransform: any;
    // public newyScale: d3.AxisScale<number | { valueOf(): number; }>;
    // public newxScale: d3.AxisScale<number | { valueOf(): number; }>;
    public newyScale: any; // asignar en el contructor o equivalente
    public newxScale: any;
    public bisectDate = d3.bisector((d: ITimePrice) => d.timestamp).right;
    public bisectValue = d3.bisector((d: ITimePrice) => d.price).right;
    public svgWidth = 800;
    public svgHeight = 300;
    public margin = { top: 30, right: 40, bottom: 70, left: 100 };
    public width = this.svgWidth - this.margin.left - this.margin.right;
    public height = this.svgHeight - this.margin.top - this.margin.bottom;
    public originalLine: d3.Line<ITimePrice>;
    public scaledLine: d3.Line<ITimePrice>;
    public originalCircle = {
    cx: -150,
    cy: -15,
    r: 20,
    };
    public chartProps = {} as IScales;
    public gX: d3.Selection<SVGGElement, {}, null, undefined>;
    public gY: d3.Selection<SVGGElement, {}, null, undefined>;
    public lineSvg: d3.Selection<SVGGElement, {}, null, undefined>;
    public view: d3.Selection<SVGGElement, {}, null, undefined>;
    public innerSpace: d3.Selection<SVGGElement, {}, null, undefined>;
    public svgViewport: d3.Selection<SVGGElement, {}, null, undefined>;
    public titleSvg: d3.Selection<SVGGElement, {}, null, undefined>;
    public focus: d3.Selection<SVGGElement, {}, null, undefined>;
    public textToolTip: d3.Selection<SVGTextElement, {}, null, undefined>;
    public zoom: d3.ZoomBehavior<Element, {}>;
    public xAxis: d3.Axis<number | { valueOf(): number }>;
    public yAxis: d3.Axis<number | { valueOf(): number }>;
    public lineGraphElement: HTMLElement;
    public line1DataHistory: ICoinHistory;
    public titleGraph = '';
    public linesDataUpdated$: Observable<ISimpleCoin[]>;
    public mediaString = '(min-width: 321px)';
    constructor(
        public lineas: ICoinHistory[],
        private socketioServ: SocketioService,
    ) {
        this.ngOnInit();
        changeWidth$
        .subscribe((mediaString) => {
            this.mediaString = mediaString;
            console.log('detectado cambio de ancho', mediaString);
            this.recalculateWidths(mediaString);
        });

        this.linesDataUpdated$ = this.socketioServ.getUpdatedCurrencies$();

        this.linesDataUpdated$
        .pipe(
            map((currenciesDatas) => {
                const idx = currenciesDatas.findIndex((currency) => currency.name === this.titleGraph);
                return currenciesDatas[idx];
            }),
        )
        .subscribe((currData) => {
            console.log('currData updated: ', currData);
            this.line1DataHistory.timePriceArray.shift();
            this.lineas[0] = this.line1DataHistory;

            this.line1DataHistory.timePriceArray.push({
              price: currData.price,
              timestamp: new Date(),
            });

            this.updateAxis();
            this.recalculateWidths(this.mediaString);

        });
    }
    public updateAxis() {
        this.chartProps.xScale
        .domain(d3.extent(this.line1DataHistory.timePriceArray, (d) => new Date(d.timestamp).getTime()));
        this.chartProps.yScale
        .domain([
            0,
            d3.max(
                this.lineas,
                (d) => Math.max(...d.timePriceArray.map((value) => value.price)) * 1.1,
            ),
        ]);
        /* if (this.lineSvg) {
            this.lineSvg
            .attr('d', this.originalLine.bind(this)(this.line1DataHistory.timePriceArray));

        } */

        this.lineSvg
        .attr('d', this.originalLine.bind(this)(this.line1DataHistory.timePriceArray));
        if (this.d3eventtransform && this.d3eventtransform.k !== 1) {
            console.log('d3eventTransform: ', this.d3eventtransform);
            this.lineSvg.attr('d', this.scaledLine.bind(this)(this.line1DataHistory.timePriceArray));
            // this.reescaleGraphic();
            this.svgViewport.call(this.zoom.bind(this));
        } else if (this.d3eventtransform && this.d3eventtransform.k === 1) {
            this.lineSvg
            .attr('d', this.originalLine.bind(this)(this.line1DataHistory.timePriceArray));
            this.d3eventtransform = undefined;
            this.newxScale = undefined;

        }

    }
    public onclickremove() {
        document.getElementById(`${this.titleGraph}data`).className = 'fila';
        // d3.select(`#${this.titleGraph}data`).attr('class', 'fila');
        GraphLineComponent.removeSvg$(this.titleGraph);
    }
    public getLine1(): Observable<ICoinHistory> {
        return new Observable<ICoinHistory>((ob) => {
            this.line1DataHistory = this.lineas[0];
            ob.next(this.lineas[0]);
        });
    }

    public getTitles(): Observable<string> {
        return new Observable<string>((ob) => {
            let titles = '';
            this.lineas.forEach((lindata) => {
            if (lindata.name) {
                if (titles === '') {
                titles = lindata.name;
                } else {
                titles = titles + ' / ' + lindata.name;
                }
            }
            });
            this.titleGraph = titles;
            ob.next(titles);
        });
    }

    public putToolTipInLastPoint(): Observable<boolean> {
      return new Observable<boolean>((ob) => {
        const lastIndex = this.line1DataHistory.timePriceArray.length - 1;
        this.d = this.line1DataHistory.timePriceArray[lastIndex];
        this.currentPointIndex = lastIndex;
        this.moveToolTip();
        ob.next(true);
      });
    }

    public ngOnInit() {

        /* this.removeSvg$()
        .pipe(switchMap((ok) => this.getTitles())
        ) */
        this.getTitles()
        .pipe(
            mergeMap(() => this.getLine1()),
            switchMap(() => this.defineChart$()),
            switchMap(() => from(this.lineas)),
            mergeMap((lin) => this.drawLine$(lin)),
            delay(1000),
            concatMap(() => this.addToolTips$()),
            concatMap(() => this.addEventsArea()),
            switchMap(() => this.putToolTipInLastPoint()),
            catchError(() => of('error')),
        )
        .subscribe(() => {
        this.addTitleGraph();
        });
    }
    public defineChart$(): Observable<boolean> {
        return new Observable<boolean>((ob) => {
            this.defineChart();
            ob.next(true);
        });
    }
    public defineChart() {
        this.lineGraphElement = document.getElementById('linechart');
        this.svgViewport = d3
        .select(this.lineGraphElement)
        .append('svg')
        .attr('id', this.titleGraph)
        .style('background', 'white')
        .attr('viewBox', `0 0 ${this.svgWidth} ${this.svgHeight}`);
        this.chartProps.xScale = d3
        .scaleTime()
        .domain(d3.extent(this.line1DataHistory.timePriceArray, (d) => new Date(d.timestamp).getTime()))
        .range([0, this.width])
        .clamp(true);

        // desactivo el zoom del svg para que
        // no interfiera con el zoom del linesvg
        this.svgViewport.on('mousedown.zoom', null)
        .on('touchstart.zoom', null)
        .on('touchmove.zoom', null)
        .on('touchend.zoom', null);

        this.chartProps.yScale = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(
                this.lineas,
                (d) => Math.max(...d.timePriceArray.map((value) => value.price)) * 1.1,
            ),
        ])
        .range([this.height, 0])
        .clamp(true);

        this.xAxis = d3.axisBottom(this.chartProps.xScale);
        this.yAxis = d3.axisLeft(this.chartProps.yScale);
        this.zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [this.width, this.height]])
        .extent([[0, 0], [this.width, this.height]])
        .on('zoom', this.zoomFunction.bind(this));

        this.innerSpace = this.svgViewport
        .append('g')
        .attr('class', 'inner_space')
        .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')',
        )
        .call(this.zoom.bind(this));
        const numberOfTicks = window.innerWidth / 200;
        console.log('numberOfTics', numberOfTicks);
        this.gX = this.innerSpace
            .append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxis.ticks(Math.max(numberOfTicks, 2)).tickFormat(this.formatEverd));

        this.gY = this.innerSpace
            .append('g')
            .attr('class', 'axis axis--y')
            // .attr('transform', 'translate(' + this.margin.left + ',0)')
            .call(this.yAxis.ticks(Math.max(numberOfTicks, 4)));

        this.originalLine = d3
            .line<ITimePrice>()
            .x((d) => {
            if (d.timestamp instanceof Date) {
                // console.log('d.date: ', d.date);
                return this.chartProps.xScale(d.timestamp.getTime());
            }
            })
            .y((d) => this.chartProps.yScale(d.price));

        this.scaledLine = d3
        .line<ITimePrice>()
        .x((d) => {
        if (d.timestamp instanceof Date) {
            // console.log('d.date: ', d.date);
            return this.newxScale(d.timestamp.getTime());
        }
        })
        .y((d) => this.newyScale(d.price));

        const removeRectangle = this.svgViewport
        .append('rect')
        .attr('x', 5)
        .attr('y', 5)
        .attr('width', 30)
        .attr('height', 30)
        .attr('fill', 'red')
        .on('click', this.onclickremove.bind(this));

        const removeAspa1 = this.svgViewport
        .append('line')
        .attr('class', 'aspas')
        .attr('x1', 35)
        .attr('x2', 5)
        .attr('y1', 5)
        .attr('y2', 35)
        .attr('pointer-events', 'none');

        const removeAspa2 = this.svgViewport
        .append('line')
        .attr('class', 'aspas')
        .attr('x1', 5)
        .attr('x2', 35)
        .attr('y1', 5)
        .attr('y2', 35)
        .attr('pointer-events', 'none');

        /* d3.xml(`${config.urlServer}/closeicon.svg`)
        .then((data) => {
            removeIcon.node().append(data.documentElement);
        }); */
    }
    public addEventsArea(): Observable<boolean> {
        return new Observable<boolean>((ob) => {
            this.view = this.innerSpace
            .append('rect')
            .attr('class', 'zoom')
            .attr('width', this.width)
            .attr('height', this.height)
            .on('mouseover', this.mouseover.bind(this))
            // .on('mouseout', () => {
            //     this.focus.style('display', 'none');
            // })
            .on('mousemove', this.mousemove.bind(this))
            .on('touchstart', this.touchStart.bind(this))
            .on('touchmove', this.touchMove.bind(this))
            .on('touchend', () => {
                this.focus.style('display', null);
            });

            ob.next(true);
        });
    }
    public drawLine$(line: ICoinHistory) {
      return new Observable<ICoinHistory>((ob) => {
          this.drawLine(line);
          ob.next(line);
      });
    }
    public drawLine(line: ICoinHistory) {
        line.timePriceArray.forEach((point) => {
            point.timestamp = moment(point.timestamp).toDate();
        });
        this.lineSvg = this.innerSpace
            .append('path')
            .datum(line.timePriceArray)
            .attr('class', 'linegraph')
            // .style('stroke', color_code) // añadir aquí el color que viene de los datos de la linea
            .style('stroke', 'black')
            .attr('d', this.originalLine.bind(this)(line.timePriceArray));
    }
    public reescaleGraphic() {
        // update axes
        this.newxScale = this.d3eventtransform.rescaleX(this.chartProps.xScale);
        this.newyScale = this.d3eventtransform.rescaleY(this.chartProps.yScale);
        this.gX.call(this.xAxis.scale(this.newxScale));
        this.gY.call(this.yAxis.scale(this.newyScale));
        this.lineSvg.call(this.xAxis.scale(this.newxScale));
        this.lineSvg.call(this.yAxis.scale(this.newyScale));

        this.changeLine();

        this.moveToolTip();
    }
    public zoomFunction() {
        this.d3eventtransform = d3.event.transform;
        this.reescaleGraphic();
    }

    public changeLine() {
        this.lineSvg
        .attr('d', this.scaledLine.bind(this));
    }

    // creamos las funciones que crean los circulos y los tooltips

    public addTitleGraph() {
      // este es el título que debería aparecer debajo de la gráfica
      // corregimos el margen top
      // const distTextTop = this.height + this.margin.top;
      const distTextTop = 260;
      // console.log('distTextTop: ', distTextTop);
      this.titleSvg = this.innerSpace
      .append('text')
      .attr('x', this.margin.left)
      // .attr('y', 0 - this.margin.top / 4)
      .attr('y', distTextTop)
      .attr('class', 'graphic_title_text')
      .attr('text-anchor', 'start')
      .text(this.titleGraph);
    }

    public addToolTips$(): Observable<boolean> {
      return new Observable<boolean>((ob) => {
          this.addToolTips();
          ob.next(true);
      });
    }
    public addToolTips() {
        this.focus = this.innerSpace
        .append('g')
        .attr('class', 'this.focus')
        // .style('display', 'none');
        .style('display', 'null');

        this.focus
        .append('line')
        .attr('class', 'x-hover-line hover-line')
        .attr('y1', 0)
        .attr('y2', this.height)
        .attr('pointer-events', 'none');

        this.focus
        .append('line')
        .attr('class', 'y-hover-line hover-line')
        .attr('x1', 0)
        .attr('x2', this.width)
        .attr('pointer-events', 'none');

        this.focus
        .append('circle')
        .attr('r', 2)
        .attr('pointer-events', 'none');

        this.textToolTip = this.focus
        .append('text')
        .attr('id', 'textToolTip')
        .attr('class', 'text_tooltip')
        .attr('text-anchor', 'end')
        .attr('y', -20)
        .attr('dy', '.31em');
    }

    public getDataPoint(): string {
        if (this.d) {
            const hora = moment(this.d.timestamp).format(config.tooltipTimeFormat);
            const precioRedondeado = Math.round(this.d.price * 100) / 100;
            const precioToLocale = precioRedondeado
            .toLocaleString('es-ES', {
                currency: 'EUR',
                style: 'currency',
            });
            return `${hora}: ${precioToLocale}`;
        } else {
            return 'no data';
        }
    }
    public touchMove(datum: any, j: any, nodes: any) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        const d = d3.touches(nodes[j]);

        this.focus.style('display', null);
        this.mousemove(datum, j, nodes);
    }

    public touchStart(datum: any, j: number, nodes: ContainerElement[]) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        // const d = d3.touches(nodes[j]);

        this.calculateCurrentPoint(nodes[j]);

        // d = d3.touches(this);
    }

    public mouseover(datum: any, j: any, nodes: any) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
      // d = d3.touches(this);
        this.focus.style('display', null);
        this.mousemove(datum, j, nodes);
    }

    public mousemove(datum: any, j: number, nodes: ContainerElement[]) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        this.calculateCurrentPoint(nodes[j]);
    }
    public calculateCurrentPoint(node: ContainerElement) {
        let x0;
        if (this.newxScale) {
            x0 = this.newxScale.invert(d3.mouse(node)[0]);
        } else {
            x0 = this.chartProps.xScale.invert(d3.mouse(node)[0]);
        }
        const i = this.bisectDate(this.line1DataHistory.timePriceArray, x0, 1);
        // console.log('i: ', i);

        const d0 = this.line1DataHistory.timePriceArray[i - 1];
        // console.log('d0: ', d0);

        const aLength = this.line1DataHistory.timePriceArray.length;
        const lastIndex = aLength - 1;
        let d1: ITimePrice;
        if (i >= aLength) {
            d1 = this.line1DataHistory.timePriceArray[lastIndex];
        } else {
            d1 = this.line1DataHistory.timePriceArray[i];
        }
        // console.log('d1: ', d1);
        if ( x0.getTime() - (d0.timestamp as Date).getTime() > (d1.timestamp as Date).getTime() - x0.getTime()) {
          this.d = d1;
          if (i >= lastIndex) {
            this.currentPointIndex = lastIndex;
          } else {
            this.currentPointIndex = i;
          }
        } else {
          this.d = d0;
          this.currentPointIndex = i - 1;
        }

        this.moveToolTip();

    }

    public moveToolTip() {
        const lastindexpoint = this.line1DataHistory.timePriceArray.length - 1;
        if (this.newxScale) {
            this.focus
            .attr(
                'transform',
                `translate(${this.newxScale(
                    new Date(this.d.timestamp),
                )},${this.newyScale(this.d.price)})`);

            this.distanciaLeft = this.newxScale(new Date(this.d.timestamp));
            this.distanciaRight =
            this.newxScale(new Date(this.line1DataHistory.timePriceArray[lastindexpoint].timestamp))
            - this.distanciaLeft;
            // console.log('distanciax: ', distanciax);

        } else {
            this.focus
            .attr(
                'transform',
                `translate(${this.chartProps.xScale(
                    new Date(this.d.timestamp),
                )},${this.chartProps.yScale(this.d.price)})`);

            this.distanciaLeft = this.chartProps.xScale(new Date(this.d.timestamp));
            this.distanciaRight =
            this.chartProps.xScale(new Date(this.line1DataHistory.timePriceArray[lastindexpoint].timestamp))
            - this.distanciaLeft;

        }

        this.textToolTip
        .text(this.getDataPoint.bind(this));

        // comprobar que se puede mover en vez de eliminar y crear
        this.focus.selectAll('rect').remove();

        // si no funciona meter en un observable
        this.calculateBbox()
        .subscribe((bbox) => {
          const rect = this.focus
              .append('rect')
              .attr('x', bbox.x)
              .attr('y', bbox.y)
              .attr('width', bbox.width)
              .attr('height', bbox.height)
              .style('fill', 'white')
              .style('fill-opacity', '.9')
              .style('stroke', '#666')
              .style('stroke-width', '0.5px');

          this.txtNode = this.textToolTip.node() as SVGTextElement;

          this.focus.node().insertBefore(this.txtNode, null);

          let newy2 = 0;

          if (this.newyScale) {
              newy2 = this.newyScale(this.d.price);
          } else {
              newy2 = this.chartProps.yScale(this.d.price);

          }

          // escalo la posicion y2 de la línea según la nueva escala si se ha hecho zoom
          this.focus
              .select('.x-hover-line')
              .attr('y2', this.height - newy2);

          // no funciona la linea horizontal
          this.focus.select('.y-hover-line').attr('x2', - this.distanciaLeft);
        });
    }
    public recalculateWidths(changeWidth: string) {
        const widthToNumber = parseInt(changeWidth.slice(12, 16), 10);
        console.log('widthToNumber: ', widthToNumber);
        const numberOfTicks = widthToNumber / 100;
        console.log('numberOfTics: ', numberOfTicks);
        if (changeWidth === '(max-width: 320px)') {
          // this.gX.remove()
          // this.gX = this.innerSpace
          //     .append('g')
          //     .attr('class', 'axis axis--x')
          //     .attr('transform', 'translate(0,' + this.height + ')')
          //     .call(this.xAxis.ticks(2).tickFormat(this.formatEverd));
          this.gX
          .call(this.xAxis.ticks(Math.max(numberOfTicks, 2)).tickFormat(this.formatEverd));
          this.gY
          .call(this.yAxis.ticks(4));
        } else if ('(min-width: 321px)') {
          this.gX
          .call(this.xAxis.ticks(Math.max(numberOfTicks, 2)).tickFormat(this.formatEverd));
          this.gY
          .call(this.yAxis.ticks(4));
        } else if ('(min-width: 569px)') {
          this.gX
          .call(this.xAxis.ticks(Math.max(6)).tickFormat(this.formatEverd));
          this.gY
          .call(this.yAxis.ticks(5));
        }
        this.moveToolTip();
    }

    public calculateBbox(): Observable<DOMRect> {
        let bbox: DOMRect;

        this.txtNode = this.textToolTip.node() as SVGTextElement;
        bbox = (this.textToolTip.node() as SVGTextElement).getBBox();

        if (
            this.distanciaLeft < bbox.width / 2
            ) {
                this.textToolTip.attr('text-anchor', 'start');
        } else if (
            this.distanciaLeft < bbox.width
        ) {
            this.textToolTip.attr('text-anchor', 'middle');
        } else if (
            this.distanciaRight > bbox.width
        ) {
            this.textToolTip.attr('text-anchor', 'middle');
        } else if (
            this.distanciaRight > bbox.width / 2
        ) {
            this.textToolTip.attr('text-anchor', 'end');
        } else {
            this.textToolTip.attr('text-anchor', 'end');
        }

        bbox = (this.textToolTip.node() as SVGTextElement).getBBox();
        // console.log('this.bbox en calculateBbox: ', this.bbox);
        return of(bbox);
    }
}
