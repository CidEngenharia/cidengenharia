
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.7';

// Credenciais integradas conforme solicitado
const supabaseUrl = 'https://iknojqzlwljvhqspetxq.supabase.co';
const supabaseAnonKey = 'sb_publishable_BdbuADtSrXrF4uQ8_vFgZA_zZa-rZSx';

let supabaseInstance: any;

try {
  // Inicialização direta do cliente Supabase
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.error("Falha ao conectar com o servidor Supabase:", e);
}

// Fallback preventivo (Mock) robusto para garantir estabilidade da UI
if (!supabaseInstance || !supabaseInstance.auth) {
  console.warn("Supabase operando em modo de visualização segura (Offline Mock).");
  
  const mockResponse = { data: null, error: null };
  const mockArrayResponse = { data: [], error: null };

  supabaseInstance = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve(mockResponse),
      signInWithOAuth: () => Promise.resolve(mockResponse),
      signOut: () => Promise.resolve(mockResponse),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        order: () => Promise.resolve(mockArrayResponse),
        eq: () => ({ order: () => Promise.resolve(mockArrayResponse) })
      }),
      insert: () => Promise.resolve(mockResponse),
      update: () => ({ eq: () => Promise.resolve(mockResponse) }),
      delete: () => ({ eq: () => Promise.resolve(mockResponse) }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve(mockResponse),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => Promise.resolve(mockResponse),
      }),
    },
  };
}

export const supabase = supabaseInstance;
