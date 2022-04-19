
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'preview', component: () => import('src/pages/PreviewPage.vue') },
      { name: 'monitoring', path: 'monitoring', props: true, component: () => import('src/pages/MonitoringPage.vue') },
    ]
  },
  {
    path: '/control',
    component: () => import('src/pages/ControlPage.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
