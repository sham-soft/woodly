export enum FilterRules {
    EQUAL = 'equal',
    EQUAL_LIST = 'equalList',
    NOT_EQUAL_LIST = 'notEqualList',
    GT = 'gt',
    GTE = 'gte',
    LT = 'lt',
    LTE = 'lte',
    GT_LT = 'gtLt',
    GTE_LTE = 'gteLte',
    REGEX_STRING = 'regexString',
    REGEX_STRING_OR = 'regexStringOr',
    REGEX_INTEGER = 'regexInteger',
}

interface GtLt {
    gt: string | number;
    lt: string | number;
}

interface GteLte {
    gte: string | number;
    lte: string | number;
}

export interface FilterOption {
    [key: string]: {
        rule: FilterRules;
        value: string | number | string[] | number[] | GtLt | GteLte;
    }
}

export function getFilters(options: FilterOption): any {
    const filters: any = {};

    for (const key in options) {
        const { rule, value } = options[key];

        if (!value) {
            continue;
        }

        switch (rule) {
            case FilterRules.EQUAL:
                filters[key] = value;
                break;

            case FilterRules.EQUAL_LIST:
                filters[key] = { $in: value };
                break;

            case FilterRules.NOT_EQUAL_LIST:
                filters[key] = { $nin: value };
                break;

            case FilterRules.GT:
                filters[key] = { $gt: value };
                break;

            case FilterRules.GTE:
                filters[key] = { $gte: value };
                break;

            case FilterRules.LT:
                filters[key] = { $lt: value };
                break;

            case FilterRules.LTE:
                filters[key] = { $lte: value };
                break;

            case FilterRules.GT_LT:
                if ((value as GtLt).gt) {
                    filters[key] = {
                        $gt: (value as GtLt).gt,
                    };
                }
                if ((value as GtLt).lt) {
                    filters[key] = {
                        $lt: (value as GtLt).lt,
                        ...filters[key],
                    };
                }
                break;

            case FilterRules.GTE_LTE:
                if ((value as GteLte).gte) {
                    filters[key] = {
                        $gte: (value as GteLte).gte,
                    };
                }
                if ((value as GteLte).lte) {
                    filters[key] = {
                        $lte: (value as GteLte).lte,
                        ...filters[key],
                    };
                }
                break;

            case FilterRules.REGEX_STRING:
                filters[key] = { $regex: value };
                break;

            case FilterRules.REGEX_STRING_OR:
                if (!filters.$or) {
                    filters.$or = [];
                }

                filters.$or.push({ [key]: { $regex: value } });
                break;

            case FilterRules.REGEX_INTEGER:
                if (!filters.$expr?.$and) {
                    filters.$expr = { $and: [] };
                }
    
                filters.$expr.$and.push({
                    $regexMatch: {
                        input: { $toString: `$${key}` }, 
                        regex: value,
                    },
                });
                break;
        }
    }

    return filters;
}