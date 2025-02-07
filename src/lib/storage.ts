import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { AndroidPermissionService } from './native/android-permissions';
import { Capacitor } from '@capacitor/core';

const DB_NAME = 'water-reminder.db';

export interface WaterEntry {
    id?: number;
    amount: number;
    timestamp: number;
}

export class DatabaseService {
    private sqlite: SQLiteConnection;
    private db!: SQLiteDBConnection;

    constructor() {
        this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }

    async init(): Promise<void> {
        try {
            if (Capacitor.getPlatform() === 'android') {
                // Without the custom plugin, we assume that required permissions are either granted
                // due to the manifest configuration or that the user has managed them manually.
                const granted = await AndroidPermissionService.checkAndRequest();
                if (!granted) throw new Error('Storage permissions required');
            }

            if (!this.db) {
                await this.initializeDatabase();
            }
        } catch (error) {
            console.error('Database init failed:', error);
            throw error;
        }
    }

    private async initializeDatabase(): Promise<void> {
        try {
            const db = await this.sqlite.createConnection(
                DB_NAME,
                false,
                'no-encryption',
                1,
                false
            );
            this.db = db;
            await this.db.open();

            const schema = `
                CREATE TABLE IF NOT EXISTS water_entries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    amount INTEGER NOT NULL,
                    timestamp INTEGER NOT NULL
                );
            `;
            await this.db.execute(schema);
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
    }

    async addWaterEntry(entry: WaterEntry): Promise<void> {
        console.log('Adding water entry');
        if (!this.db) throw new Error('Database not initialized');
        const query = `
            INSERT INTO water_entries (amount, timestamp) VALUES (?, ?);
        `;
        try {
            await this.db.run(query, [entry.amount, entry.timestamp]);
            console.log('Water entry added successfully');
        } catch (error) {
            console.error('Error adding water entry:', error);
            throw error;
        }
    }

    async getTodayWaterEntries(): Promise<WaterEntry[]> {
        console.log('Getting today water entries');
        if (!this.db) throw new Error('Database not initialized');
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        const query = `
            SELECT * FROM water_entries WHERE timestamp >= ?;
        `;
        try {
            const result = await this.db.query(query, [startOfDay]);
            console.log('Today water entries:', result.values);
            return result.values as WaterEntry[] || [];
        } catch (error) {
            console.error('Error getting today water entries:', error);
            throw error;
        }
    }

    async getTodayTotalWaterIntake(): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        const query = `
            SELECT SUM(amount)  as total FROM water_entries WHERE timestamp >= ?;
        `;
        try {
            const result = await this.db.query(query, [startOfDay]);
            const total = result.values?.[0]?.total;
            return total ? Number(total) : 0;
        } catch (error) {
            console.error('Error getting today total water intake:', error);
            throw error;
        }
    }
}
