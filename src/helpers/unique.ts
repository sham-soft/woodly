export async function createId(model: any, idName: string): Promise<number> {
    const sortDocuments = await model.find().sort({ [idName]: -1 }).limit(1);
    const lastDocumentId = sortDocuments[0] ? sortDocuments[0][idName] : 0;

    return lastDocumentId + 1;
}