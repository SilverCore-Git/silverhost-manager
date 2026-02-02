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
  const actionLoading = ref(false); // Nouvel état pour le loader du bouton maintenance
  const error = ref<string | null>(null);
  const lastUpdated = ref<Date | null>(null);
  const ping = ref<number>(0);

  // URL de base
  const baseUrl = `https://${domaine}/score-host/api`;

  // --- Actions ---
  const fetchStatus = async () => {
    const startTime = performance.now();
    // Utilisation du proxy pour éviter les erreurs CORS
    const statusUrl = `https://corsproxy.io/?url=${encodeURIComponent(`${baseUrl}/status`)}`;

    try {
      // On ne met loading a true que si c'est le premier chargement pour éviter le clignotement
      if (!data.value) loading.value = true;
      
      const response = await fetch(statusUrl, { cache: 'no-store' });
      
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      const json = await response.json();
      
      const endTime = performance.now();
      ping.value = Math.round(endTime - startTime);
      
      data.value = json;
      error.value = null;
      lastUpdated.value = new Date();
    } catch (err) {
      ping.value = 0;
      error.value = err instanceof Error ? err.message : "Erreur de connexion";
      console.error(`[ScoreHost] Erreur sur ${domaine}:`, err);
    } finally {
      loading.value = false;
    }
  };

  // --- Action Maintenance ---
  const setMaintenance = async (password: string, active: boolean) => {
    if (!password) {
        alert("Mot de passe non configuré pour ce service");
        return;
    }

    const value = active ? 'true' : 'false';

    const cacheBuster = Date.now();
    const targetUrl = `${baseUrl}/manager/${password}/set-maintenance/${value}`;
    const targetUrlWithCacheBuster = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}t=${cacheBuster}`;
    const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(targetUrlWithCacheBuster)}`;

    try {
        actionLoading.value = true;
        const response = await fetch(proxyUrl, {
          cache: 'no-store',
          headers: {
              'Pragma': 'no-cache',
              'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) throw new Error("Impossible de changer le mode maintenance");
        
        // On rafraichit immédiatement les données pour voir le changement
        await fetchStatus(); 
        
    } catch (err) {
        console.error("Erreur maintenance:", err);
        alert("Erreur lors du changement de mode maintenance");
    } finally {
        actionLoading.value = false;
    }
  };

  // --- Computed Properties ---
  const pingColor = computed(() => {
    if (ping.value === 0) return 'text-slate-500';
    if (ping.value < 100) return 'text-emerald-500';
    if (ping.value < 250) return 'text-yellow-500';
    return 'text-red-500';
  });

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
    timer = setInterval(fetchStatus, 30000);
  });

  onUnmounted(() => {
    clearInterval(timer);
  });

  return {
    data,
    loading,
    actionLoading, // Exporté pour désactiver le bouton pendant l'action
    error,
    ping,
    pingColor,
    lastUpdated,
    statusColor,
    statusMessage,
    refresh: fetchStatus,
    setMaintenance // Nouvelle fonction exportée
  };
};