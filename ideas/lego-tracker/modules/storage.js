// IndexedDB Storage Module for Lego Tracker

const DB_NAME = 'LegoTrackerDB';
const DB_VERSION = 1;

const STORES = {
    COLLECTION: 'collection',
    SETS_CACHE: 'setsCache',
    PRICE_HISTORY: 'priceHistory'
};

class LegoStorage {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Collection store
                if (!db.objectStoreNames.contains(STORES.COLLECTION)) {
                    const collectionStore = db.createObjectStore(STORES.COLLECTION, { keyPath: 'id', autoIncrement: true });
                    collectionStore.createIndex('setNumber', 'setNumber', { unique: false });
                    collectionStore.createIndex('theme', 'theme', { unique: false });
                    collectionStore.createIndex('dateAdded', 'dateAdded', { unique: false });
                }

                // Sets cache store
                if (!db.objectStoreNames.contains(STORES.SETS_CACHE)) {
                    const cacheStore = db.createObjectStore(STORES.SETS_CACHE, { keyPath: 'setNumber' });
                    cacheStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
                }

                // Price history store
                if (!db.objectStoreNames.contains(STORES.PRICE_HISTORY)) {
                    const priceStore = db.createObjectStore(STORES.PRICE_HISTORY, { keyPath: 'id', autoIncrement: true });
                    priceStore.createIndex('setNumber', 'setNumber', { unique: false });
                    priceStore.createIndex('date', 'date', { unique: false });
                }
            };
        });
    }

    // Collection Methods
    async addToCollection(setData) {
        const transaction = this.db.transaction([STORES.COLLECTION], 'readwrite');
        const store = transaction.objectStore(STORES.COLLECTION);

        const item = {
            ...setData,
            dateAdded: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.add(item);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getCollection() {
        const transaction = this.db.transaction([STORES.COLLECTION], 'readonly');
        const store = transaction.objectStore(STORES.COLLECTION);

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getCollectionItem(id) {
        const transaction = this.db.transaction([STORES.COLLECTION], 'readonly');
        const store = transaction.objectStore(STORES.COLLECTION);

        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateCollectionItem(id, updates) {
        const transaction = this.db.transaction([STORES.COLLECTION], 'readwrite');
        const store = transaction.objectStore(STORES.COLLECTION);

        return new Promise((resolve, reject) => {
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const item = getRequest.result;
                const updatedItem = { ...item, ...updates };
                const putRequest = store.put(updatedItem);
                putRequest.onsuccess = () => resolve(putRequest.result);
                putRequest.onerror = () => reject(putRequest.error);
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deleteCollectionItem(id) {
        const transaction = this.db.transaction([STORES.COLLECTION], 'readwrite');
        const store = transaction.objectStore(STORES.COLLECTION);

        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Sets Cache Methods
    async cacheSet(setNumber, setData) {
        const transaction = this.db.transaction([STORES.SETS_CACHE], 'readwrite');
        const store = transaction.objectStore(STORES.SETS_CACHE);

        const cacheItem = {
            setNumber,
            ...setData,
            lastUpdated: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.put(cacheItem);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getCachedSet(setNumber) {
        const transaction = this.db.transaction([STORES.SETS_CACHE], 'readonly');
        const store = transaction.objectStore(STORES.SETS_CACHE);

        return new Promise((resolve, reject) => {
            const request = store.get(setNumber);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Price History Methods
    async addPriceHistory(setNumber, price, source = 'manual') {
        const transaction = this.db.transaction([STORES.PRICE_HISTORY], 'readwrite');
        const store = transaction.objectStore(STORES.PRICE_HISTORY);

        const priceEntry = {
            setNumber,
            price,
            source,
            date: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.add(priceEntry);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getPriceHistory(setNumber) {
        const transaction = this.db.transaction([STORES.PRICE_HISTORY], 'readonly');
        const store = transaction.objectStore(STORES.PRICE_HISTORY);
        const index = store.index('setNumber');

        return new Promise((resolve, reject) => {
            const request = index.getAll(setNumber);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Utility Methods
    async clearAllData() {
        const storeNames = [STORES.COLLECTION, STORES.SETS_CACHE, STORES.PRICE_HISTORY];
        const transaction = this.db.transaction(storeNames, 'readwrite');

        return Promise.all(
            storeNames.map(storeName => {
                return new Promise((resolve, reject) => {
                    const request = transaction.objectStore(storeName).clear();
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            })
        );
    }
}

export default new LegoStorage();
