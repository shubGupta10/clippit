export const PLANS = {
    free: {
        maxSaves: 100,
        maxCollections: 3,
        maxSharedCollections: 2,
        exportFormats: ['json']
    },
    pro: {
        maxSaves: 10000,
        maxCollections: 200,
        maxSharedCollections: 50,
        exportFormats: ['json', 'csv', 'markdown']
    }
}