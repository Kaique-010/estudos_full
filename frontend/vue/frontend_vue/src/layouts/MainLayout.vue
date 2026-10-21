<script setup lang="ts">
import AppSidebar from '@/components/layouts/AppSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 md:flex">
    <AppSidebar />

    <main class="min-w-0 flex-1">
      <header
        class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div>
          <p class="text-sm text-slate-500">Sistema de gestão</p>
          <h1 class="font-semibold text-slate-800">Área administrativa</h1>
        </div>

        <div
          class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
          U
        </div>
      </header>

      <div class="p-5 md:p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>
