interface PaginationType {
    limit: number,
    skip: number,
    page: number,
}

export enum FilterRules {
    EQUAL = 'equal',
    EQUAL_LIST = 'equalList',
    REGEX_STRING = 'regexString',
    REGEX_STRING_OR = 'regexStringOr',
    REGEX_INTEGER = 'regexInteger',
}

export function getPagination(page: number): PaginationType {
    const limit = 50;
    let skip = 0;
    page = Number(page);

    if (page > 1) {
        skip = (page - 1) * limit;
    }

    return {
        limit,
        skip,
        page: page || 1,
    };
}

export function getFilters(query: object, options: object): object {
    const filters: any = {};

    for (const key in query) {
        const rule = options[key];
        const value = query[key];

        switch (rule) {
            case FilterRules.EQUAL:
                filters[key] = value;
                break;

            case FilterRules.EQUAL_LIST:
                filters[key] = { $in: value };
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