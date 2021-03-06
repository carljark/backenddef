import { TimeLocaleDefinition } from 'd3';

const timeformatdefaultlocale: TimeLocaleDefinition = {
    date: '%d.%m.%Y',
    dateTime: '%a %b %e %X %Y',
    days: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ],
    months: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ],
    periods: ['AM', 'PM'],
    shortDays: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    shortMonths: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
    ],
    time: '%H:%M:%S',
};
export default timeformatdefaultlocale;
