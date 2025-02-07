<script lang="ts">
    import type { WaterEntry } from '$lib/storage';
    import { DatabaseService } from '$lib/storage';

    let { totalWaterIntake = $bindable(), todayWaterEntries = $bindable(), db = $bindable() } = $props();

    async function addWaterEntry(entry: WaterEntry) {
        totalWaterIntake += entry.amount;
        todayWaterEntries.push(entry);
        await db.addWaterEntry(entry);
    }
</script>

<div class="flex flex-col items-center justify-center">
    <button onclick={() => addWaterEntry({ amount: 1000, timestamp: Date.now() })}>1 L</button>
    <div class="w-full h-px bg-gray-200 my-2"></div>
    <button onclick={() => addWaterEntry({ amount: 750, timestamp: Date.now() })}>750 ml</button>
    <div class="w-full h-px bg-gray-200 my-2"></div>
    <button onclick={() => addWaterEntry({ amount: 500, timestamp: Date.now() })}>500 ml</button>
    <div class="w-full h-px bg-gray-200 my-2"></div>
    <button onclick={() => addWaterEntry({ amount: 330, timestamp: Date.now() })}>330 ml</button>
    <div class="w-full h-px bg-gray-200 my-2"></div>
    <button onclick={() => addWaterEntry({ amount: 250, timestamp: Date.now() })}>250 ml</button>
    <div class="w-full h-px bg-gray-200 my-2"></div>
    <button onclick={() => addWaterEntry({ amount: 200, timestamp: Date.now() })}>200 ml</button>
</div>