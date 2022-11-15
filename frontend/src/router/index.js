import { createRouter, createWebHistory } from 'vue-router';
import KeyManagement from '../views/KeyManagement.vue';
import MessageSigning from '../views/MessageSigning.vue';
import KeyRecovery from '../views/KeyRecovery.vue';

const routes = [
  {
    path: '/',
    name: 'Key Management',
    component: KeyManagement,
  },
  {
    path: '/message-signing',
    name: 'Message Signing',
    component: MessageSigning,
  },
  {
    path: '/key-recovery',
    name: 'Key Recovery',
    component: KeyRecovery,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
