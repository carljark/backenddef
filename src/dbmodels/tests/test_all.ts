#!/bin/bash
import uno from './coins_test_insertone';
import dos from './coins_test_gethistorybycount';
import tres from './coins_test_gethistoryfromdatetominsandname';
import cuatro from './coins_test_getmany';
import cinco from './coins_test_insertone_delbymongoid';
import testGetAll from './coins_test_getall';
import siete from './coins_test_getlast';
import ocho from './coins_test_getlast_getbymongoid_getone';
import nueve from './coins_test_insertone_delmany';
import testDelAll from './coins_test_delall';
import { combineLatest, merge, concat } from 'rxjs';

concat(uno, dos, tres, cuatro, cinco, testGetAll, siete, ocho, nueve, testDelAll)
.subscribe();

