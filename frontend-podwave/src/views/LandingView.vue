<script setup>
import { ref, onMounted } from 'vue'

const apiStatus = ref('verificando...')

onMounted(async () => {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL)
    const json = await response.json()
    apiStatus.value = json.data.status
  } catch (error) {
    apiStatus.value = 'offline'
    console.error('Erro ao consultar a API:', error)
  }
})
</script>

<template>
  <div class="landing">
    <h1>Bem-vindo ao Pod Lino</h1>
    <p>Status da API: <strong>{{ apiStatus }}</strong></p>
  </div>
</template>