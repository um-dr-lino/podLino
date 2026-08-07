import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },

  { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },

  { path: '/feed', name: 'feed', component: () => import('../views/FeedView.vue'), meta: { requiresAuth: true } },

  { path: '/videos/upload', name: 'video-upload', component: () => import('../views/UploadView.vue'), meta: { requiresAuth: true } },
  { path: '/videos/:id', name: 'video-detail', component: () => import('../views/VideoDetailView.vue') },
  { path: '/videos/:id/edit', name: 'video-edit', component: () => import('../views/EditVideoView.vue'), meta: { requiresAuth: true } },
  { path: '/my-videos', name: 'my-videos', component: () => import('../views/MyVideosView.vue'), meta: { requiresAuth: true } },

  { path: '/profile/me', name: 'my-profile', component: () => import('../views/profile/MyProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/profile/:username', name: 'public-profile', component: () => import('../views/profile/PublicProfileView.vue') },

  { path: '/my-playlists', name: 'my-playlists', component: () => import('../views/playlist/MyPlaylistsView.vue'), meta: { requiresAuth: true } },
  { path: '/playlists/:id', name: 'playlist-detail', component: () => import('../views/playlist/PlaylistDetailView.vue') },

  { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
  { path: '/notifications', name: 'notifications', component: () => import('../views/NotificationsView.vue'), meta: { requiresAuth: true } },

  { path: '/admin/dashboard', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/reports', name: 'admin-reports', component: () => import('../views/admin/AdminReportsView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/videos', name: 'admin-videos', component: () => import('../views/admin/AdminVideosView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router