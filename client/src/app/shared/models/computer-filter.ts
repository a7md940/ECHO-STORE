import { filterLogic } from './enums/filter-logic';
import { filterOperator } from './enums/operators.filter';

export interface Filter {
    field: string;
    value: string;
    logic?: filterLogic;
    operator?: filterOperator;
}
export interface ComputerFilter {
    take?: number;
    skip?: number;
    filter?: Array<Filter>;
    filterLogic?: filterLogic;
    searchText?: Array<string>;
}