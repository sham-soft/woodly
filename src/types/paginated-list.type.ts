export interface PaginatedList<Schema> {
    total: number;
    page: number;
    limit: number;
    data: Schema[];
}