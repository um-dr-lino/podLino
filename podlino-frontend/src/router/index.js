import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Público
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },
  { path: '/esqueci-senha', name: 'forgot-password', component: () => import('../views/auth/ForgotPasswordView.vue') },

  // Navegação principal
  { path: '/feed', name: 'feed', component: () => import('../views/FeedView.vue') },
  { path: '/seguindo', name: 'following-feed', component: () => import('../views/FollowingFeedView.vue') },
  { path: '/explorar', name: 'explore', component: () => import('../views/ExploreView.vue') },
  { path: '/buscar', name: 'search', component: () => import('../views/SearchView.vue') },

  // Podcast e episódio
  { path: '/podcast/:id', name: 'podcast', component: () => import('../views/podcast/PodcastView.vue') },
  { path: '/episodio/:id', name: 'episode', component: () => import('../views/podcast/EpisodeView.vue') },

  // Perfil e biblioteca do usuário
  { path: '/perfil', name: 'profile', component: () => import('../views/perfil/ProfileView.vue') },
  { path: '/perfil/favoritos', name: 'favorites', component: () => import('../views/perfil/FavoritesView.vue') },
  { path: '/perfil/historico', name: 'history', component: () => import('../views/perfil/HistoryView.vue') },
  { path: '/perfil/seguindo', name: 'profile-following', component: () => import('../views/perfil/FollowingView.vue') },
  { path: '/perfil/configuracoes', name: 'settings', component: () => import('../views/perfil/SettingsView.vue') },

  // Área do criador
  { path: '/criador/podcasts', name: 'my-podcasts', component: () => import('../views/criador/MyPodcastsView.vue') },
  { path: '/criador/podcasts/novo', name: 'podcast-new', component: () => import('../views/criador/PodcastFormView.vue') },
  { path: '/criador/podcasts/:id/editar', name: 'podcast-edit', component: () => import('../views/criador/PodcastFormView.vue') },
  { path: '/criador/podcasts/:id/episodios', name: 'manage-episodes', component: () => import('../views/criador/ManageEpisodesView.vue') },
  { path: '/criador/podcasts/:id/episodios/novo', name: 'episode-upload', component: () => import('../views/criador/EpisodeUploadView.vue') },

  // Administração
  { path: '/admin', name: 'admin-dashboard', component: () => import('../views/admin/DashboardView.vue') },
  { path: '/admin/podcasts', name: 'admin-podcasts', component: () => import('../views/admin/ManagePodcastsView.vue') },
  { path: '/admin/usuarios', name: 'admin-users', component: () => import('../views/admin/ManageUsersView.vue') },

  // Fallback
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
