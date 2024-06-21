interface IPagination {
    limit: number,
    skip: number,
    page: number,
}

export function getPagination(page: number, limit: number = 50): IPagination {
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