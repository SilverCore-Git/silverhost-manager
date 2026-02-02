import { ref, computed, onMounted, onUnmounted } from 'vue';

interface ScoreHostStatus {
  ok: boolean;
  version: string;
}

interface ServiceStatus {
  ok: boolean;
  name: string;
  maintenance: boolean;
  errored: boolean;
  onUpdate: boolean;
  version: string;
}

export interface SilverHostResponse {
  "score-host": ScoreHostStatus;
  service: ServiceStatus;
}

export const useService = (domaine: string) => {
  // --- État ---
  const data = ref<SilverHostResponse | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const lastUpdated = ref<Date | null>(null);
  const ping = ref<number>(0);

  const url = `https://corsproxy.io/?url=https://${domaine}/score-host/api/status`;

  // --- Actions ---
  const fetchStatus = async () => {
    // On enregistre le temps exact avant l'appel
    const startTime = performance.now();
    
    try {
      loading.value = true;
      // 'no-store' est crucial pour ne pas avoir un ping faussé par le cache navigateur
      const response = await fetch(url, { cache: 'no-store' });
      
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      const json = await response.json();
      
      // Calcul du ping (temps de réponse total)
      const endTime = performance.now();
      ping.value = Math.round(endTime - startTime);
      
      data.value = json;
      error.value = null;
      lastUpdated.value = new Date();
    } catch (err) {
      ping.value = 0; // On reset le ping en cas d'erreur
      error.value = err instanceof Error ? err.message : "Erreur de connexion";
      console.error(`[ScoreHost] Erreur sur ${domaine}:`, err);
    } finally {
      loading.value = false;
    }
  };

  // --- Computed Properties ---

  // Couleur du ping selon la latence
  const pingColor = computed(() => {
    if (ping.value === 0) return 'text-slate-500';
    if (ping.value < 100) return 'text-emerald-500';
    if (ping.value < 250) return 'text-yellow-500';
    return 'text-red-500';
  });

  // Couleur du status (Priorité : Panne > Maj > Maint > OK)
  const statusColor = computed(() => {
    if (error.value || (data.value && data.value.service.errored)) return 'red';
    if (data.value?.service.onUpdate) return 'blue';
    if (data.value?.service.maintenance) return 'yellow';
    if (data.value?.service.ok) return 'emerald';
    return 'gray';
  });

  const statusMessage = computed(() => {
    const s = data.value?.service;
    if (error.value) return "Indisponible";
    if (s?.errored) return "En panne";
    if (s?.onUpdate) return "Mise à jour...";
    if (s?.maintenance) return "Maintenance";
    return "Opérationnel";
  });

  // --- Lifecycle ---
  let timer: ReturnType<typeof setInterval>;

  onMounted(() => {
    fetchStatus();
    // Rafraîchissement auto toutes les 30 secondes
    timer = setInterval(fetchStatus, 30000);
  });

  onUnmounted(() => {
    clearInterval(timer);
  });

  return {
    data,
    loading,
    error,
    ping,
    pingColor,
    lastUpdated,
    statusColor,
    statusMessage,
    refresh: fetchStatus
  };
};