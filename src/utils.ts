export function isEmail(s:string) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(s);
  }




export const backend = "https://localhost:8000"
export const webdav = "https://dav.jianguoyun.com/dav/"
export class UniqueIdMap {
  private counter = 0;
  private map = new Map<string, [number, string]>();
  private reverseMap = new Map<number, [string, string, string]>();

  getUniqueId(projectId: string, listId: string, cardId: string, cardName?: string): number {
    const key = `${projectId}:${listId}:${cardId}`;

    if(this.map.has(key)) {
      const [uniqueId, existingCardName] = this.map.get(key)!;
      if (cardName !== existingCardName) {
        throw new Error(`Card name does not match existing mapping: ${existingCardName}`);
      }
      return uniqueId;
    } else {
      const newId = ++this.counter;
      this.map.set(key, [newId, cardName]);
      this.reverseMap.set(newId, [projectId, listId, cardId]);
      return newId;
    }
  }

  getCardNameFromUniqueId(uniqueId: number): string {
    const mapping = this.reverseMap.get(uniqueId);
    if (mapping) {
      const [projectId, listId, cardId] = mapping;
      const key = `${projectId}:${listId}:${cardId}`;
      const [_, cardName] = this.map.get(key)!;
      return cardName;
    } else {
      throw new Error(`Invalid unique ID: ${uniqueId}`);
    }
  }

  getUniqueIdFromCard(projectId: string, listId: string, cardId: string): number {
    const key = `${projectId}:${listId}:${cardId}`;
    if (this.map.has(key)) {
      return this.map.get(key)![0];
    } else {
      throw new Error(`Invalid card: ${key}`);
    }
  }

  getCardNameFromCard(projectId: string, listId: string, cardId: string): string {
    const uniqueId = this.getUniqueIdFromCard(projectId, listId, cardId);
    return this.getCardNameFromUniqueId(uniqueId);
  }

  getKeyFromUniqueId(uniqueId: number): [string, string, string] {
    const mapping = this.reverseMap.get(uniqueId);
    if (mapping) {
      return mapping;
    } else {
      throw new Error(`Invalid unique ID: ${uniqueId}`);
    }
  }
}