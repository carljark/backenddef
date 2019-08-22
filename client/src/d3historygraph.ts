import * as d3 from 'd3';
import * as moment from 'moment';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, delay, mapTo, mergeMap, switchMap } from 'rxjs/operators';
import ICoinHistory from './coin-history.interface';
import timeFormatDefaultLocale from './d3-timeformatdefaultlocale';
import ITimePrice from './timeprice.interface';

d3.timeFormatDefaultLocale(timeFormatDefaultLocale);

interface IScales {
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export class GraphLineComponent {
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
    public margin = { top: 30, right: 40, bottom: 50, left: 60 };
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
    public linea1: ICoinHistory;
    public titleGraph = '';
    constructor(
        public lineas: ICoinHistory[],
    ) {
        this.ngOnInit();
    }
    public removeSvg$(): Observable<boolean> {
        return of(d3.select('svg').remove())
        .pipe(
            mapTo(true),
        );
    }
    public getLine1(): Observable<ICoinHistory> {
        return new Observable<ICoinHistory>((ob) => {
            this.linea1 = this.lineas[0];
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

    public ngOnInit() {

        /* this.removeSvg$()
        .pipe(switchMap((ok) => this.getTitles())
        ) */
        this.getTitles()
        .pipe(
            mergeMap((titles) => this.getLine1()),
            switchMap((lin) => this.defineChart$()),
            switchMap((ok) => from(this.lineas)),
            mergeMap((lin) => this.drawLine$(lin)),
            delay(1000),
            concatMap((lin) => this.addToolTips$(lin)),
            concatMap((lin) => this.addEventsArea()),
            catchError(() => of('error')),
        )
        .subscribe((ok) => {
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
        .style('background', 'white')
        .attr('viewBox', `0 0 ${this.svgWidth} ${this.svgHeight}`);
        this.chartProps.xScale = d3
        .scaleTime()
        .domain(d3.extent(this.linea1.timePriceArray, (d) => new Date(d.timestamp).getTime()))
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
        const formatEverd = d3.timeFormat('%d/%m %H:%M');
        this.gX = this.innerSpace
            .append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxis.ticks(6).tickFormat(formatEverd));

        this.gY = this.innerSpace
            .append('g')
            .attr('class', 'axis axis--y')
            .call(this.yAxis);

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
    }
    public addEventsArea(): Observable<boolean> {
        return new Observable<boolean>((ob) => {
            this.view = this.innerSpace
            .append('rect')
            .attr('class', 'zoom')
            .attr('width', this.width)
            .attr('height', this.height)
            .on('mouseover', this.mouseover.bind(this))
            .on('mouseout', () => {
                this.focus.style('display', 'none');
            })
            .on('mousemove', this.mousemove.bind(this))
            .on('touchstart', this.touchStart.bind(this))
            .on('touchmove', this.touchStart.bind(this))
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
    public zoomFunction() {
        this.newxScale = d3.event.transform.rescaleX(this.chartProps.xScale);
        this.newyScale = d3.event.transform.rescaleY(this.chartProps.yScale);
        // update axes
        this.gX.call(this.xAxis.scale(this.newxScale));
        this.gY.call(this.yAxis.scale(this.newyScale));
        this.lineSvg.call(this.xAxis.scale(this.newxScale));
        this.lineSvg.call(this.yAxis.scale(this.newyScale));

        this.d3eventtransform = d3.event.transform;
        // this.lineSvg.attr('transform', this.d3eventtransform);

        // this.chartProps.xScale.domain(newDomainX);
        // this.chartProps.yScale.domain(d3.event.transform.rescaleY(this.chartProps.yScale.domain()));
        // console.log('se escala');

        this.changeLine();

        this.moveToolTip();

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
      .attr('text-anchor', 'left')
      .text(this.titleGraph);
    }

    public addToolTips$(line: ICoinHistory): Observable<boolean> {
    return new Observable<boolean>((ob) => {
        this.addToolTips(line);
        ob.next(true);
    });
    }
    public addToolTips(line: ICoinHistory) {
        this.focus = this.innerSpace
        .append('g')
        .attr('class', 'this.focus')
        .style('display', 'none');

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
            const hora = moment(this.d.timestamp).format('DD/MM HH:mm');
            const precioRedondeado = Math.round(this.d.price * 100) / 100;
            return `${hora}h: ${precioRedondeado}€`;
        } else {
            return 'no data';
        }
    }

    public touchStart(datum: any, j: any, nodes: any) {
        this.focus.style('display', null);
        this.mousemove(datum, j, nodes);
    }

    public mouseover(datum: any, j: any, nodes: any) {
        this.focus.style('display', null);
        this.mousemove(datum, j, nodes);
    }

    public mousemove(datum: any, j: any, nodes: any) {
        let x0;
        if (this.newxScale) {
            x0 = this.newxScale.invert(d3.mouse(nodes[j])[0]);
        } else {
            x0 = this.chartProps.xScale.invert(d3.mouse(nodes[j])[0]);
        }
        const i = this.bisectDate(this.linea1.timePriceArray, x0, 1);
        // console.log('i: ', i);

        const d0 = this.linea1.timePriceArray[i - 1];
        // console.log('d0: ', d0);

        const aLength = this.linea1.timePriceArray.length;
        let d1: ITimePrice;
        if (i >= this.linea1.timePriceArray.length) {
            d1 = this.linea1.timePriceArray[aLength - 1];
        } else {
            d1 = this.linea1.timePriceArray[i];
        }
        // console.log('d1: ', d1);

        this.d =
            x0.getTime() - (d0.timestamp as Date).getTime() >
            (d1.timestamp as Date).getTime() - x0.getTime()
            ? d1
            : d0;
        this.moveToolTip();

    }

    public moveToolTip() {
        let distanciax: number;
        if (this.newxScale) {
            this.focus
            .attr(
                'transform',
                `translate(${this.newxScale(
                    new Date(this.d.timestamp),
                )},${this.newyScale(this.d.price)})`);

            distanciax = this.newxScale(new Date(this.d.timestamp));
            // console.log('distanciax: ', distanciax);

        } else {
            this.focus
            .attr(
                'transform',
                `translate(${this.chartProps.xScale(
                    new Date(this.d.timestamp),
                )},${this.chartProps.yScale(this.d.price)})`);

            distanciax = this.chartProps.xScale(new Date(this.d.timestamp));
            // console.log('distanciax: ', distanciax);

        }

        /* if (this.d3eventtransform) {
          this.focus.attr(
            'transform',
            this.d3eventtransform
          )
        } */
        // console.log(this.chartProps.xScale(new Date(d.date)));

        this.textToolTip
        .text(this.getDataPoint.bind(this));

        const txtNode = this.textToolTip.node() as SVGGElement;

        const bbox = txtNode.getBBox();

        if (bbox.width + 10 > distanciax) {
            this.textToolTip
            .attr('text-anchor', 'start');
        } else {
            this.textToolTip
            .attr('text-anchor', 'end');
        }

        this.focus.selectAll('rect').remove();

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

        this.focus.node().insertBefore(txtNode, null);

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
        this.focus.select('.y-hover-line').attr('x2', - distanciax);
    }
}
