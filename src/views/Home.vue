<script setup lang="ts">
import { ref, computed } from 'vue';
import { useService } from '../composables/useService'; // Vérifie ton chemin
import { 
  Activity, 
  Server, 
  AlertCircle, 
  CheckCircle2, 
  Hammer, 
  Clock, 
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Power
} from 'lucide-vue-next';
import domains from '../services.json';

const serviceInstances = domains.map(d => ({
  ...d,
  monitor: useService(d.domain)
}));

const searchQuery = ref('');
const filterStatus = ref('all');

const filteredServices = computed(() => {
  return serviceInstances.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const status = s.monitor.statusMessage.value.toLowerCase();
    const matchesStatus = filterStatus.value === 'all' || status.includes(filterStatus.value.toLowerCase());
    return matchesSearch && matchesStatus;
  });
});

const globalHealth = computed(() => {
  const total = serviceInstances.length;
  if (total === 0) return 0;
  const healthy = serviceInstances.filter(s => s.monitor.data.value?.service.ok).length;
  return Math.round((healthy / total) * 100);
});

const getStatusIcon = (monitor: any) => {
  if (monitor.data.value?.service.errored) return AlertCircle;
  if (monitor.data.value?.service.onUpdate) return RefreshCw;
  if (monitor.data.value?.service.maintenance) return Hammer;
  return CheckCircle2;
};

// Fonction Wrapper pour le bouton maintenance
const handleMaintenanceToggle = (service: any) => {
    const isCurrentlyInMaintenance = service.monitor.data.value?.service.maintenance;
    // On inverse l'état actuel (si true -> on envoie false, et inversement)
    service.monitor.setMaintenance(service.mdp, !isCurrentlyInMaintenance);
};
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
    
    <header class="max-w-7xl mx-auto mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold flex items-center gap-2 text-white">
            <Server class="w-8 h-8 text-indigo-500" />
            Silverhost Status
          </h1>
          <p class="text-slate-400 text-sm mt-1">Supervision & Management</p>
        </div>

        <div class="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700 flex items-center gap-3">
          <div class="text-right">
            <p class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Santé Infrastructure</p>
            <p class="text-xl font-mono font-bold" :class="globalHealth > 90 ? 'text-emerald-400' : 'text-yellow-400'">
              {{ globalHealth }}%
            </p>
          </div>
          <Activity class="w-8 h-8 text-slate-700" />
        </div>
      </div>

      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <div class="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-700">
          <button 
            v-for="f in ['all', 'Opérationnel', 'Maintenance', 'Panne']" 
            :key="f"
            @click="filterStatus = f"
            class="px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-tight"
            :class="filterStatus === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'"
          >
            {{ f }}
          </button>
        </div>

        <div class="relative w-full sm:w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher un service..." 
            class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all">
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      
      <div v-for="s in filteredServices" :key="s.id"
        class="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-all group relative"
      >
        <div class="absolute top-0 left-0 w-full h-1 rounded-t-xl" 
             :class="`bg-${s.monitor.statusColor.value}-500`"></div>

        <div class="flex justify-between items-start mb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-bold text-white tracking-tight">{{ s.name }}</h3>
              <span class="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded uppercase font-mono">
                v{{ s.monitor.data.value?.service.version || '...' }}
              </span>
            </div>
            <a :href="`https://${s.domain}`" target="_blank" class="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors">
              {{ s.domain }} <ExternalLink class="w-3 h-3" />
            </a>
          </div>
          
          <div class="px-3 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm"
            :class="`bg-${s.monitor.statusColor.value}-500/10 text-${s.monitor.statusColor.value}-500 border-${s.monitor.statusColor.value}-500/20`"
          >
            <component :is="getStatusIcon(s.monitor)" class="w-3.5 h-3.5" :class="{'animate-spin': s.monitor.data.value?.service.onUpdate}" />
            {{ s.monitor.statusMessage.value }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
            <p class="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-tighter">Latence</p>
            <div class="text-xl font-mono font-bold flex items-baseline gap-1" :class="s.monitor.pingColor.value">
              {{ s.monitor.ping.value }}<span class="text-[10px] text-slate-600">ms</span>
            </div>
          </div>
          <div class="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
            <p class="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-tighter">Host Status</p>
            <div class="flex items-center gap-2 mt-2">
              <ShieldCheck class="w-5 h-5" :class="s.monitor.data.value?.['score-host'].ok ? 'text-indigo-500' : 'text-slate-600'" />
              <span class="text-[10px] font-mono text-slate-400">OK</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-slate-700/50 pt-4">
          
          <button 
             @click="handleMaintenanceToggle(s)"
             :disabled="s.monitor.actionLoading.value"
             class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
             :class="[
                s.monitor.data.value?.service.maintenance
                  ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' // Style si actif (pour désactiver)
                  : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20', // Style si inactif (pour activer)
                s.monitor.actionLoading.value ? 'opacity-50 cursor-not-allowed' : ''
             ]"
          >
            <component :is="s.monitor.actionLoading.value ? RefreshCw : Power" 
                       class="w-3.5 h-3.5" 
                       :class="{'animate-spin': s.monitor.actionLoading.value}" 
            />
            {{ s.monitor.data.value?.service.maintenance ? 'Sortir Maintenance' : 'Mode Maintenance' }}
          </button>

          <div class="flex items-center gap-3">
             <span class="text-[10px] text-slate-600 hidden sm:block">
               {{ s.monitor.lastUpdated.value?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
             </span>
             <button @click="s.monitor.refresh()" 
                class="p-2 rounded-lg bg-slate-700/50 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all hover:scale-105"
                :class="{'animate-spin': s.monitor.loading.value}"
             >
                <RefreshCw class="w-3.5 h-3.5" />
             </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* Animations existantes */
.bg-red-500 { animation: pulse-red 2s infinite; }
@keyframes pulse-red {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}
</style>