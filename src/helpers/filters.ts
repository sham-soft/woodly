export enum QueryFilterRules {
    EQUAL = 'equal',
    EQUAL_LIST = 'equalList',
    REGEX_STRING = 'regexString',
    REGEX_STRING_OR = 'regexStringOr',
    REGEX_INTEGER = 'regexInteger',
    CREATE_GT = 'createGt',
    CREATE_LT = 'createLt',
}

export function getQueryFilters(query: object, options: object): object {
    const filters: any = {};

    for (const key in query) {
        const rule = options[key];
        const value = query[key];

        switch (rule) {
            case QueryFilterRules.EQUAL:
                filters[key] = value;
                break;

            case QueryFilterRules.EQUAL_LIST:
                filters[key] = { $in: value };
                break;

            case QueryFilterRules.REGEX_STRING:
                filters[key] = { $regex: value };
                break;

            case QueryFilterRules.REGEX_STRING_OR:
                if (!filters.$or) {
                    filters.$or = [];
                }

                filters.$or.push({ [key]: { $regex: value } });
                break;

            case QueryFilterRules.REGEX_INTEGER:
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

            case QueryFilterRules.CREATE_GT:
                if (!filters.dateCreate) {
                    filters.dateCreate = {};
                }

                filters.dateCreate.$gt = value;
                break;

            case QueryFilterRules.CREATE_LT:
                if (!filters.dateCreate) {
                    filters.dateCreate = {};
                }

                filters.dateCreate.$lt = value;
                break;
        }
    }

    return filters;
}