export interface ISearchQuery {
    query: string;
    limit?: number;
}

export interface ISearchResult {
    _id: string;
    type: string;
    content?: string;
    imageUrl?: string;
    sourceUrl: string;
    tags: string[];
    note?: string;
    score: number;
    createdAt: Date;
}