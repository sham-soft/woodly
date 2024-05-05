interface IPagination {
    limit: number,
    skip: number,
    page: number,
}

export function getPagination(page: number): IPagination {
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