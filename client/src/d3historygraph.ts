import * as d3 from 'd3';
import { ContainerElement } from 'd3';
import * as moment from 'moment';
import { from, iif, Observable, of, Subscription } from 'rxjs';
import { catchError, concatMap, delay, map, mapTo, mergeMap, switchMap, tap } from 'rxjs/operators';
import ICoinHistory from './coin-history.interface';
import timeFormatDefaultLocale from './d3-timeformatdefaultlocale';
import ITimePrice from './timeprice.interface';

import config from './environment';

import changeWidth$ from './responsive';

import {SocketioService} from './socketio.service';

import ISimpleCoin from './simplecoin.interface';

import getInitMediaString from './getmediastring.function';

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

    public lastIndex: number = 0;
    public currentPointIndex: number = 0;
    public formatEverd = d3.timeFormat('%d/%m %H:%M');
    public bbox$: Observable<DOMRect>;
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
    public newyScale: d3.ScaleLinear<number, number>; // asignar en el contructor o equivalente
    public newxScale: d3.ScaleTime<number, number>;
    public bisectDate = d3.bisector((d: ITimePrice) => d.timestamp).right;
    public bisectValue = d3.bisector((d: ITimePrice) => d.price).right;
    public svgWidth = 800;
    public svgHeight = 300;
    public margin = { top: 30, right: 40, bottom: 70, left: 100 };
    public width = this.svgWidth - this.margin.left - this.margin.right;
    public height = this.svgHeight - this.margin.top - this.margin.bottom;
    public originalLine: d3.Line<ITimePrice>;
    public scaledLine: d3.Line<ITimePrice>;
    public focuscircle: d3.Selection<SVGCircleElement, {}, null, undefined>;
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
    public focus$ = new Observable<d3.Selection<SVGGElement, {}, null, undefined>>();
    public focus: d3.Selection<SVGGElement, {}, null, undefined>;
    public textToolTip$: Observable<d3.Selection<SVGTextElement, {}, null, undefined>>;
    public textToolTip: d3.Selection<SVGTextElement, {}, null, undefined>;
    public zoom: d3.ZoomBehavior<Element, {}>;
    public xAxis: d3.Axis<number | { valueOf(): number }>;
    public yAxis: d3.Axis<number | { valueOf(): number }>;
    public lineGraphElement: HTMLDivElement;
    public divTableGraph: HTMLDivElement;
    public objetiveGraph: HTMLDivElement;
    public line1DataHistory: ICoinHistory;
    public titleGraph = '';
    public linesDataUpdated$: Observable<ISimpleCoin[]>;
    public mediaString = getInitMediaString();
    public linesDataUpdatedSubs: Subscription;
    public tttSubs: Subscription;
    public changeWidthSubs: Subscription;
    public timeOutCircle: number = null;

    private yTextToolTip = -20;
    private xTicks = 6;
    private yTicks = 6;
    private newYTTT = this.height / 2;
    private anclado = false;
    private anclar = false;
    private desanclar = false;

    constructor(
        public lineas: ICoinHistory[],
        private socketioServ: SocketioService,
        ) {
            /* this.titleGraph = this.lineas[0].name;
            this.lineGraphElement = document.getElementById('linechart') as HTMLDivElement;
            const nameGraphId = this.titleGraph + 'graph';
            this.divTableGraph = document.getElementById(nameGraphId) as HTMLDivElement;
            this.objetiveGraph = this.getObjetiveGraph(); */

            this.linesDataUpdated$ = this.socketioServ.getUpdatedCurrencies$();

            this.focus$ = this.getTitles()
            .pipe(
                mergeMap(() => this.initVars()),
                mergeMap(() => this.getLine1()),
                switchMap(() => this.defineChart()),
                switchMap(() => from(this.lineas)),
                mergeMap((lin) => this.drawLine$(lin)),
                delay(1000),
                concatMap(() => this.initFocus$()),
            );

            this.textToolTip$ = this.focus$
            .pipe(
                concatMap((focus) => this.getTextToolTip(focus)),
            );

            this.tttSubs = this.textToolTip$
            .pipe(
                concatMap(() => this.addEventsArea()),
                switchMap(() => this.checkCurrentPointIndex()),
                catchError(() => of('error')),
            )
            .subscribe(() => {
                this.addTitleGraph();

                this.changeWidthSubs =
                changeWidth$
                .pipe(
                    switchMap((mediaString) => this.initVars(mediaString)),
                    switchMap((mediaString) => this.recalculateWidths$()),
                )
                .subscribe();

                this.linesDataUpdatedSubs = this.linesDataUpdated$
                .pipe(
                    map((currenciesDatas) => {
                        const idx = currenciesDatas.findIndex((currency) => currency.name === this.titleGraph);
                        return currenciesDatas[idx];
                    }),
                    switchMap((currData) => this.updateLinePoints(currData)),
                    switchMap(() => this.updateAxis()),
                    switchMap(() => this.updateLine()),
                    switchMap(() => this.initVars()),
                    switchMap(() => this.recalculateWidths$()),
                    switchMap(() => this.checkCurrentPointIndex()),
                )
                .subscribe();
                });
    }

    public updateLinePoints(currData: ISimpleCoin): Observable<ICoinHistory> {
        return new Observable<ICoinHistory>((ob) => {
            // implementar en el servidor que se devuelvan los últimos
            // 100 registros en vez de los últimos 100 minutos ( o 6 en development)
            this.lastIndex = this.lineas[0].timePriceArray.length - 1;
            const startTime = this.lineas[0].timePriceArray[0].timestamp;
            const endTime = this.lineas[0].timePriceArray[this.lastIndex].timestamp;
            const amountTime = this.getTimeSize(startTime, endTime);
            this.lineas[0].timePriceArray.shift();

            this.lineas[0].timePriceArray.push({
                price: currData.price,
                timestamp: new Date(),
            });

            this.line1DataHistory = this.lineas[0];
            ob.next(this.line1DataHistory);
            ob.complete();
        });
    }
    public getTimeSize(start: Date, end: Date): number {
        const a = moment(start);
        const b = moment(end);
        return b.diff(a, 'minutes');
    }
    public updateLine() {
        return new Observable<boolean>((ob) => {
            this.lineSvg
            .attr('d', this.originalLine.bind(this)(this.line1DataHistory.timePriceArray));
            if (this.d3eventtransform && this.d3eventtransform.k !== 1) {
                this.lineSvg.attr('d', this.scaledLine.bind(this)(this.line1DataHistory.timePriceArray));
                this.svgViewport.call(this.zoom.bind(this));
            } else if (this.d3eventtransform && this.d3eventtransform.k === 1) {
                this.lineSvg
                .attr('d', this.originalLine.bind(this)(this.line1DataHistory.timePriceArray));
                this.d3eventtransform = undefined;
                this.newxScale = undefined;
                // comprobar que se inicializan los ejes al salir del zoom
                console.log('initAxes');
                this.initAxes().subscribe();
            }
            ob.next(true);
        });
    }
    public updateAxis(): Observable<boolean> {
        // averiguar por qué no se actualizar los ejes cuando salgo del zoom
        // es decir, cuando this.d3eventTransform.k = 1
        return new Observable<boolean>((ob) => {
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
            ob.next(true);
        });
    }
    public onclickremove() {
        this.changeWidthSubs.unsubscribe();
        this.linesDataUpdatedSubs.unsubscribe();
        clearTimeout(this.timeOutCircle);
        // this.tttSubs.unsubscribe();
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

    public putToolTipInLastPoint() {
      return iif(
              () => {
                  this.currentPointIndex--;
                  return this.currentPointIndex < 0;
              },
              of(true),
              // if not supplied defaults to EMPTY
        )
        .pipe(
            switchMap(() => {
                const lastIndex = this.line1DataHistory.timePriceArray.length - 1;
                this.d = this.line1DataHistory.timePriceArray[lastIndex];
                this.currentPointIndex = lastIndex;
                return this.moveToolTip();
            }),
        );
    }
    public checkCurrentPointIndex() {
        return this.focus$
        .pipe(
            switchMap(() => this.putToolTipInLastPoint()),
        );
    }

    public initScales() {
        return new Observable<boolean>((ob) => {
            this.chartProps.xScale = d3
            .scaleTime()
            .domain(d3.extent(this.line1DataHistory.timePriceArray, (d) => new Date(d.timestamp).getTime()))
            .range([0, this.width])
            .clamp(true);

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
            ob.next(true);
        });

    }
    public initZoom() {
        return new Observable<boolean>((ob) => {
            this.svgViewport.on('mousedown.zoom', null)
            .on('touchstart.zoom', null)
            .on('touchmove.zoom', null)
            .on('touchend.zoom', null);

            this.zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on('zoom', this.zoomFunction.bind(this));

            this.innerSpace
            .call(this.zoom.bind(this));
            ob.next(true);
        });
    }
    public initLines() {
        return new Observable<boolean>((ob) => {
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
            ob.next(true);
        });
    }
    public initRemoveIcon() {
        return new Observable<boolean>((ob) => {
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
            ob.next(true);

        });
    }
    public getSvgViewPort$() {
        if (this.anclar === true) {
            this.anclado = true;
        }
        return of(d3
        .select(this.objetiveGraph)
        .append('svg')
        .attr('id', this.titleGraph)
        .style('background', 'white')
        .attr('viewBox', `0 0 ${this.svgWidth} ${this.svgHeight}`))
        .pipe(
            tap((svvv) => this.svgViewport = svvv),
        );
        // asignar anclado si se crea el svgvieport en la tabla

    }
    public initSvg() {
        return new Observable<boolean>((ob) => {
            this.getSvgViewPort$()
            .subscribe((svgViewport) => {
                this.svgViewport = svgViewport;
                this.innerSpace = this.svgViewport
                .append('g')
                .attr('class', 'inner_space')
                .attr(
                'transform',
                'translate(' + this.margin.left + ',' + this.margin.top + ')',
                );
                ob.next(true);
                ob.complete();
            });
        });
    }
    public getInnerSpace$(svgViewport: d3.Selection<SVGGElement, {}, null, undefined>) {
        return of(svgViewport
        .append('g')
        .attr('class', 'inner_space')
        .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')',
        ))
        .pipe(
            tap((innerSpace) => this.innerSpace = innerSpace),
        );

    }
    public defineChart() {
        return this.getSvgViewPort$()
        .pipe(
            switchMap((svgv) => this.getInnerSpace$(svgv)),
            switchMap(() => this.initScales()),
            switchMap(() => this.initAxes()),
            switchMap(() => this.initZoom()),
            switchMap(() => this.initGAxis()),
            switchMap(() => this.initLines()),
            switchMap(() => this.initRemoveIcon()),
        );
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
    public initAxes(): Observable<boolean> {
        return new Observable<boolean>((ob) => {
            this.xAxis = d3.axisBottom(this.chartProps.xScale);
            this.yAxis = d3.axisLeft(this.chartProps.yScale);
            ob.next(true);
        });
    }
    public initGAxis() {
        return new Observable<boolean>((ob) => {
            const numberOfTicks = window.innerWidth / 200;
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
            ob.next(true);
        });
    }
    public reescaleGraphic() {
        return new Observable<boolean>((ob) => {
            this.newxScale = this.d3eventtransform.rescaleX(this.chartProps.xScale);
            this.newyScale = this.d3eventtransform.rescaleY(this.chartProps.yScale);
            this.gX.call(this.xAxis.scale(this.newxScale));
            this.gY.call(this.yAxis.scale(this.newyScale));
            this.lineSvg.call(this.xAxis.scale(this.newxScale));
            this.lineSvg.call(this.yAxis.scale(this.newyScale));

            this.scaleLine();
            ob.next(true);
            // this.moveToolTip().subscribe();

        })
        .pipe(
            switchMap(() => this.moveToolTip()),
        );
    }
    public zoomFunction() {
        this.d3eventtransform = d3.event.transform;
        this.reescaleGraphic().subscribe();
    }

    public scaleLine() {
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

    public initFocus$() {
        this.focus$ = of(
        this.focus = this.innerSpace
        .append('g')
        .attr('class', 'focus')
        // .style('display', 'none');
        .style('display', 'null'));

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

        this.focuscircle = this.focus
        .append('circle')
        .attr('id', 'focuscircle')
        // .attr('r', 5)
        .attr('pointer-events', 'none');

        this.animateCircle(this.focuscircle.node());

        return this.focus$;
    }
    public animateCircle(el: SVGCircleElement) {
        let n1 = 20;
        let ch1 = 1;
        const elTF = () => {
            el.setAttribute('r', (n1 / 10).toString());
            if (n1 === 20) {
                ch1 = 1;
            } else if (n1 === 50) {
                ch1 = -1;
            }
            n1 += ch1;
        };
        this.timeOutCircle = window.setInterval(elTF, 100);
    }

    public getTextToolTip(focus: d3.Selection<SVGGElement, {}, null, undefined>) {
        const tt = focus
        .append('text')
        .datum(this.newYTTT)
        .attr('id', 'textToolTip')
        .attr('class', 'text_tooltip')
        .attr('text-anchor', 'end')
        .attr('y', (d) => d)
        .attr('dy', '.31em');

        this.textToolTip = tt;

        return of(tt);

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

        // this.calculateCurrentPoint(nodes[j]);
        this.mousemove(datum, j, nodes);

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

        this.moveToolTip().subscribe();

    }

    public moveToolTip() {
        return new Observable<boolean>((ob) => {
            ob.next(true);
        })
        .pipe(
            mergeMap(() => this.focus$, (ok, focus) => (focus)),
            // switchMap(() => this.getBbox$(), (focus, bbox) => ({focus, bbox})),
            tap((focus) => {
                this.moveFocus(focus);
                this.textToolTip
                .text(this.getDataPoint.bind(this))
                .datum(this.newYTTT)
                .attr('y', (d) => d);
            }),
            switchMap((focus) => this.getBbox$(), (focus, bbox) => ({focus, bbox})),
            tap((input) => {
                this.drawFocusRect(input.focus, input.bbox);
                this.scaleFocusLines(input.focus);
            }),
        );
    }

    public drawFocusRect(focus: d3.Selection<SVGGElement, {}, null, undefined>, bbox: DOMRect) {
        focus.selectAll('rect').remove();
        const rect = focus
        .append('rect')
        .attr('x', bbox.x)
        .attr('y', bbox.y)
        .attr('width', bbox.width)
        .attr('height', bbox.height)
        .style('fill', 'white')
        .style('fill-opacity', '.9')
        .style('stroke', '#666')
        .style('stroke-width', '0.5px');
        const txtNode = this.textToolTip.node() as SVGTextElement;
        focus.node().insertBefore(txtNode, null);
    }
    public moveFocus(focus: d3.Selection<SVGGElement, {}, null, undefined>) {
        if (this.newxScale) {
            this.moveFocusFactory(focus, this.newxScale, this.newyScale);
        } else {
            this.moveFocusFactory(focus, this.chartProps.xScale, this.chartProps.yScale);
        }
    }
    public moveFocusFactory(
        focus: d3.Selection<SVGGElement, {}, null, undefined>,
        xScale: d3.ScaleTime<number, number>,
        yScale: d3.ScaleLinear<number, number>,
        ) {
        const lastindexpoint = this.line1DataHistory.timePriceArray.length - 1;
        focus
        .attr(
            'transform',
            `translate(${xScale(new Date(this.d.timestamp))},${yScale(this.d.price)})`);
        this.distanciaLeft = xScale(new Date(this.d.timestamp));
        this.distanciaRight =
        this.chartProps.xScale(new Date(this.line1DataHistory.timePriceArray[lastindexpoint].timestamp))
        - this.distanciaLeft;
    }
    public scaleFocusLines(focus: d3.Selection<SVGGElement, {}, null, undefined>) {
        let newy2 = 0;

        if (this.newyScale) {
            newy2 = this.newyScale(this.d.price);
        } else {
            newy2 = this.chartProps.yScale(this.d.price);

        }
        this.newYTTT = (this.height - newy2) / 2;
        focus
        .select('.x-hover-line')
        .attr('y2', this.height - newy2);
        focus.select('.y-hover-line').attr('x2', - this.distanciaLeft);
    }

    public recalculateWidths$() {
        if (this.anclar === true) {
            this.moveGraphToTable();
            this.anclar = false;
        }
        if (this.desanclar === true) {
            this.desanclarGraph();
            this.desanclar = false;
        }
        return new Observable<string>((ob) => {
            this.gX
            .call(this.xAxis.ticks(this.xTicks).tickFormat(this.formatEverd));
            this.gY
            .call(this.yAxis.ticks(this.yTicks));
            ob.next(this.mediaString);
            ob.complete();
        })
        .pipe(
            switchMap(() => this.moveToolTip()),
            mapTo(this.mediaString),
        );

    }

    public getBbox$(textToolTip?: d3.Selection<SVGTextElement, {}, null, undefined>): Observable<DOMRect> {
        let bbox: DOMRect;
        let ttt: d3.Selection<SVGTextElement, {}, null, undefined>;

        if (textToolTip) {
            ttt = textToolTip;
        } else {
            ttt = this.textToolTip;
        }

        bbox = this.updateBbox(ttt);

        // console.log('this.bbox en calculateBbox: ', this.bbox);
        return of(bbox);
    }
    public updateBbox(textToolTip: d3.Selection<SVGTextElement, {}, null, undefined>) {
        const bbox = textToolTip.node().getBBox();
        if (this.distanciaLeft < bbox.width / 2) {
                textToolTip.attr('text-anchor', 'start');
        } else if (
            this.distanciaLeft < bbox.width
        ) {
            textToolTip.attr('text-anchor', 'middle');
        } else if (
            this.distanciaRight > bbox.width
        ) {
            textToolTip.attr('text-anchor', 'middle');
        } else if (
            this.distanciaRight > bbox.width / 2
        ) {
            textToolTip.attr('text-anchor', 'end');
        } else {
            textToolTip.attr('text-anchor', 'end');
        }
        return textToolTip.node().getBBox();

    }

    private moveGraphToTable() {
        if (this.anclado === false) {

            // prueba... funciona
            // divTableGraph.innerText = 'ostias';
            this.lineGraphElement.removeChild(this.svgViewport.node());
            this.divTableGraph.appendChild(this.svgViewport.node());
            this.objetiveGraph = this.divTableGraph;
            this.anclado = true;
        }


        
    }
    
    private desanclarGraph() {
        if (this.anclado === true) {
            this.divTableGraph.removeChild(this.svgViewport.node());
            this.lineGraphElement.appendChild(this.svgViewport.node());
            this.objetiveGraph = this.lineGraphElement;
            this.anclado = false;
        }
    }

    private initVars(mediaString?: string) {
        if (mediaString) {
            this.mediaString = mediaString;
        }
        return new Observable<string>((ob) => {
            // corregir para que quitar la ultima parte
            // mejor calcular los tics con el window.innerWidth
            // o con el mediastring
            const widthString = this.mediaString.match(/[0-9]+/);
            let widthToNumber = 768;
            let numberOfTicks = 4;
            
            if (widthString.length) {
                widthToNumber = parseInt(widthString[0], 10);
                numberOfTicks = widthToNumber / 100;
                
            }
            
            if (this.mediaString === '(min-width: 1025px)') {
                this.xTicks = 6;
                this.yTicks = 6;
                this.yTextToolTip = -10;
                this.desanclar = true;
            } else if (this.mediaString === '(min-width: 769px)') {
                this.xTicks = 6;
                this.yTicks = 5;
                this.yTextToolTip = -20;
                // this.desanclar = true;
                this.anclar = true;
            } else if (this.mediaString === '(min-width: 569px)') {
                this.xTicks = 6;
                this.yTicks = 5;
                this.yTextToolTip = -20;
                // this.desanclar = true;
                this.anclar = true;
            } else if (this.mediaString === '(min-width: 321px)') {
                this.xTicks = 2;
                this.yTicks = 4;
                this.yTextToolTip = -20;
                // this.desanclar = true;
                this.anclar = true;
            }
            
            if (this.mediaString === '(max-width: 1024px)') {
                this.xTicks = 8;
                this.yTicks = 8;
                this.yTextToolTip = -20;
                this.anclar = true;
            } else if (this.mediaString === '(max-width: 568px)') {
                this.xTicks = 2;
                this.yTicks = 4;
                this.yTextToolTip = -20;
                this.anclar = true;
            } else if (this.mediaString === '(max-width: 320px)') {
                this.xTicks = 2;
                this.yTicks = 4;
                this.yTextToolTip = 27;
                this.anclar = true;

            }
            console.log('this.mediastring: ', this.mediaString);

            console.log('this.anclar: ', this.anclar);
            this.titleGraph = this.lineas[0].name;
            this.lineGraphElement = document.getElementById('linechart') as HTMLDivElement;
            const nameGraphId = this.titleGraph + 'graph';
            this.divTableGraph = document.getElementById(nameGraphId) as HTMLDivElement;
            this.objetiveGraph = this.getObjetiveGraph();

            ob.next(this.mediaString);
            ob.complete();
        });
    }
    private getObjetiveGraph() {
        console.log('aver', this.anclar);
        if (this.anclar === true) {
            return this.divTableGraph;
        } else {
            return this.lineGraphElement;
        }
    }
}
