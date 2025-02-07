import { Preferences } from "@capacitor/preferences";

export class SettingsStorage {
    async setReminderAggressiveness(aggressiveness: string): Promise<void> {
        await Preferences.set({ key: 'reminderAggressiveness', value: aggressiveness.toString() });
    }

    async getReminderAggressiveness(): Promise<string> {
        const { value } = await Preferences.get({ key: 'reminderAggressiveness' });
        return value ?? 'low';
    }

    async setDailyWaterNeeded(waterNeeded: number): Promise<void> {
        await Preferences.set({ key: 'dailyWaterNeeded', value: waterNeeded.toString() });
    }

    async getDailyWaterNeeded(): Promise<number> {
        const { value } = await Preferences.get({ key: 'dailyWaterNeeded' });
        return value ? parseInt(value) : 2000;
    }
}