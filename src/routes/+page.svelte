<script lang="ts">
    import * as m from '$lib/paraglide/messages.js';
    import { onMount } from 'svelte';
    import { DatabaseService } from '../lib/storage';
    import type { WaterEntry } from '../lib/storage';
    import { SettingsStorage } from '../lib/settingsStorage';
    import WaterIntakeModal from '../modals/waterIntakeModal.svelte';

    import { Device } from '@capacitor/device';

    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    let db: DatabaseService;
    
    let todayWaterEntries: WaterEntry[] = $state([]);
    let todayTotalWaterIntake: Tween<number> = new Tween(0, { duration: 400, easing: cubicOut });
    let showModal: boolean = $state(false);

    let dailyWaterNeeded: number = $state(2000);

    let expectedWaterIntake: number = $state(0);

    onMount(async () => {
        console.log('Component mounted');
        try {
            db = new DatabaseService();
            await db.init();
            todayWaterEntries = await db.getTodayWaterEntries();
            todayTotalWaterIntake.target = await db.getTodayTotalWaterIntake();

            const settingsStorage = new SettingsStorage();
            dailyWaterNeeded = await settingsStorage.getDailyWaterNeeded();

            console.log('Before Device.getInfo');
            const info = await Device.getInfo();
            console.log('Device info:', info);

            const deviceTime = new Date();
            
            const morningTimestamp = new Date(deviceTime);
            morningTimestamp.setHours(0, 0, 0, 0);
            const eveningTimestamp = new Date(deviceTime);
            eveningTimestamp.setHours(23, 59, 59, 999);
            
            console.log(morningTimestamp.getDate());
            console.log(eveningTimestamp.getDate())

            const currentTimestamp = new Date(deviceTime);

            const dailyTotalTime = eveningTimestamp.getTime() - morningTimestamp.getTime();
            expectedWaterIntake = dailyWaterNeeded * (currentTimestamp.getTime() - morningTimestamp.getTime()) / dailyTotalTime;

            console.log('Morning:', morningTimestamp);
            console.log('Evening:', eveningTimestamp);
        } catch (error) {
            console.error('Error in onMount:', error);
        }
    });
</script>

<div class="p-8" style="margin-bottom: 80px;">
    <div class="flex flex-row justify-between mt-6">
        <span>History</span>
        <span>Settings</span>
    </div>
    <h1 class="flex justify-center mt-4">H2Optimize</h1>

    <div class="p-6 mx-4 relative mt-4">
        <div class="progress-container">
            <progress class="expected-progress" value={expectedWaterIntake} max={dailyWaterNeeded}></progress>
            <progress class="actual-progress" value={todayTotalWaterIntake.current} max={dailyWaterNeeded}></progress>
        </div>
    </div>

    <img src="/aquarium.jpg" alt="Aquarium" class="w-full h-auto rounded my-4" />

    <h2 class="my-4">{m.daily_consumption_history()}</h2>
    {#each todayWaterEntries as entry}
        <div class="flex flex-row justify-between my-2 mx-4">
            <div class="flex flex-row items-center">
                <img src="/water-drop.svg" alt="Water drop" class="w-6 h-6" />
                <p class="ml-2">{entry.amount} ml</p>
            </div>
            <p>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    {/each}
    
</div>
<div class="fixed bottom-0 flex items-center justify-center w-full" style="height: 80px;" >
    {#if showModal}
        <div class="fixed bottom-0 bg-white rounded-lg p-4" style="margin-bottom: 80px;">
            <WaterIntakeModal bind:totalWaterIntake={todayTotalWaterIntake.target} bind:todayWaterEntries={todayWaterEntries} bind:db={db} />
        </div>
    {/if}
    <button class="bg-primary text-white rounded-full p-2 w-full mx-4" onclick={() => showModal = !showModal}>Log a drink</button>
</div>

<style>
    h2 {
        font-size: 1.5rem;
        font-weight: 600;
    }

    h1 {
        font-weight: 600;
    }

    .progress-container {
        position: relative;
        width: 100%;
        height: 20px;
    }

    .actual-progress, .expected-progress {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .actual-progress {
        background-color: transparent;

        &::-webkit-progress-bar {
            background-color: transparent;
            border-radius: 15px;
        }

        /* Target WebKit browsers */
        &::-webkit-progress-value {
            background-color: var(--color-primary) !important;
            border-radius: 15px;
        }
        
        /* Target Firefox */
        &::-moz-progress-bar {
            background-color: var(--color-primary);
            border-radius: 15px;
        }
        
        /* Target IE/Edge */
        &::-ms-fill {
            background-color: var(--color-primary);
            border-radius: 15px;
        }
    }

    .expected-progress {
        background-color: var(--color-gray);

        &::-webkit-progress-bar {
            background-color: var(--color-gray);
            border-radius: 15px;
        }

        /* Target WebKit browsers */
        &::-webkit-progress-value {
            background-color: var(--color-error) !important;
            border-radius: 15px;
        }

        &::-moz-progress-bar {
            background-color: var(--color-error) !important;
            border-radius: 15px;
        }

        &::-ms-fill {
            background-color: var(--color-error) !important;
            border-radius: 15px;
        }
    }

    /* Remove default appearance */
    progress {
        @apply appearance-none;
        border-radius: 15px;
    }
</style>