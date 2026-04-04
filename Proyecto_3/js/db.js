/**
 * db.js
 * GymLog IndexedDB Wrapper
 * Handles initialization, migrations, and CRUD operations.
 */

class DatabaseService {
    constructor() {
        this.dbName = 'WebFitDB';
        this.dbVersion = 1;
        this.db = null;
    }

    /**
     * Initializes the IndexedDB instance.
     * @returns {Promise<IDBDatabase>}
     */
    async init() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
                return;
            }

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject("Failed to open IndexedDB");
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("Database opened successfully");
                
                // Dispatch event, the event bus might find this useful later
                document.dispatchEvent(new CustomEvent('db-ready'));
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 1. Exercises Store
                if (!db.objectStoreNames.contains('exercises')) {
                    const exerciseStore = db.createObjectStore('exercises', { keyPath: 'id', autoIncrement: true });
                    exerciseStore.createIndex('muscleGroup', 'muscleGroup', { unique: false });
                    exerciseStore.createIndex('type', 'type', { unique: false });
                    exerciseStore.createIndex('name', 'name', { unique: false });
                }

                // 2. Routines Store
                if (!db.objectStoreNames.contains('routines')) {
                    const routineStore = db.createObjectStore('routines', { keyPath: 'id', autoIncrement: true });
                    routineStore.createIndex('name', 'name', { unique: false });
                    routineStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // 3. Sessions Store (Workout Logs)
                if (!db.objectStoreNames.contains('sessions')) {
                    const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
                    sessionStore.createIndex('date', 'date', { unique: false });
                    sessionStore.createIndex('routineId', 'routineId', { unique: false });
                }
            };
        });
    }

    // --- Generic Transaction Helper ---
    
    /**
     * Executes a transaction block safely using Promises.
     */
    async _executeTransaction(storeName, mode, operation) {
        await this.init(); // Ensure DB is open
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], mode);
            const store = transaction.objectStore(storeName);
            
            // The operation is a callback that receives the store
            const request = operation(store);

            transaction.oncomplete = () => {
                resolve(request ? request.result : undefined);
            };

            transaction.onerror = (event) => {
                console.error(`Transaction Error in ${storeName}:`, event.target.error);
                reject(event.target.error);
            };
            
            // For requests that fire success inside the operation
            if (request && typeof request === 'object' && 'onsuccess' in request) {
               request.onsuccess = (e) => resolve(e.target.result);
               request.onerror = (e) => reject(e.target.error);
            }
        });
    }

    // --- CRUD EXERCISES ---

    async getExercises() {
        return this._executeTransaction('exercises', 'readonly', (store) => store.getAll());
    }

    async addExercise(exerciseData) {
        return this._executeTransaction('exercises', 'readwrite', (store) => store.add(exerciseData));
    }
    
    async updateExercise(exerciseData) {
        return this._executeTransaction('exercises', 'readwrite', (store) => store.put(exerciseData));
    }

    async deleteExercise(id) {
        // Warning: Deleting an exercise that exists in a routine should be handled 
        // by the UI/business logic (checking cascade dependencies) before calling this.
        return this._executeTransaction('exercises', 'readwrite', (store) => store.delete(id));
    }

    // --- UTILS ---
    
    /**
     * DANGEROUS: Used for testing mainly. Clears a specific store.
     */
    async clearStore(storeName) {
         return this._executeTransaction(storeName, 'readwrite', (store) => store.clear());
    }
}

// Export a singleton instance
const dbService = new DatabaseService();
window.dbService = dbService; // Make available globally for testing/without modules.
