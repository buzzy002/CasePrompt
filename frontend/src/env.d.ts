import 'vue-router';

// Déclare les champs personnalisés de `meta` pour les routes
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    title?: string;
  }
}