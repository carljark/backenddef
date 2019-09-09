import * as d3 from 'd3';
import {timeFormat} from 'd3';
import {Observable, of} from 'rxjs';
import ITimePrice from './timeprice.interface';
export class AxisService {
    public initXAxe(
        xScale: d3.ScaleTime<number, number>,
    ): Observable<d3.Axis<number|Date|{valueOf(): number}>> {
        return new Observable<d3.Axis<number|Date|{valueOf(): number}>>((ob) => {
            const xAxis = d3.axisBottom(xScale);
            ob.next(xAxis);
            ob.complete();
        });
    }
    public initYAxe(
      yScale: d3.ScaleLinear<number, number>,
    ): Observable<d3.Axis<number|{valueOf(): number}>> {
        return new Observable<d3.Axis<number|{valueOf(): number}>>((ob) => {
            const yAxis = d3.axisLeft(yScale);
            ob.next(yAxis);
        });
    }
    public initGXAxis(
      innerSpace: d3.Selection<SVGGElement, {}, null, undefined>,
      xAxis: d3.Axis<number|Date|{valueOf(): number}>,
      height: number,
      format: any,
    ) {
          const numberOfTicks = window.innerWidth / 200;
          of(innerSpace
              .append('g')
              .attr('class', 'axis axis--x')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis.ticks(Math.max(numberOfTicks, 2)).tickFormat(format)));

    }
    public initGYAxis(
      innerSpace: d3.Selection<SVGGElement, {}, null, undefined>,
      yAxis: d3.Axis<number|{valueOf(): number}>,
    ) {
          const numberOfTicks = window.innerWidth / 200;
          return of(innerSpace
              .append('g')
              .attr('class', 'axis axis--y')
              // .attr('transform', 'translate(' + this.margin.left + ',0)')
              .call(yAxis.ticks(Math.max(numberOfTicks, 4))));
    }
    public updateXAxisDomain(
        line1Data: ITimePrice[],
        xScale: d3.ScaleTime<number, number>,
    ): Observable<d3.ScaleTime<number, number>> {
        // averiguar por qué no se actualizan los ejes cuando salgo del zoom
        // es decir, cuando this.d3eventTransform.k = 1
        return new Observable<d3.ScaleTime<number, number>>((ob) => {
            xScale
            .domain(d3.extent(line1Data, (d) => new Date(d.timestamp).getTime()));
            ob.next(xScale);
            ob.complete();
        });
    }
    public updateYAxisDomain(
        line1Data: ITimePrice[],
        yScale: d3.ScaleLinear<number, number>,
    ): Observable<d3.ScaleLinear<number, number>> {
        // averiguar por qué no se actualizar los ejes cuando salgo del zoom
        // es decir, cuando this.d3eventTransform.k = 1
        return new Observable<d3.ScaleLinear<number, number>>((ob) => {
            yScale
            .domain([
                0,
                d3.max(
                    line1Data,
                    (d) => Math.max(d.price)) * 1.1,
            ]);
            ob.next(yScale);
            ob.complete();
        });
    }
}
