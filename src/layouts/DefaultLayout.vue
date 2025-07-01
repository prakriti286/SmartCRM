
<template>
  <div class="wrapper">
         <AppSidebar />
          <AppHeader />
    <div class="content-wrapper">
      <section class="content px-3 pt-2">
        
        <router-view />
        
      </section>
    </div>


    <!-- <footer class="main-footer text-center text-sm">
      <strong>&copy; 2025 <a href="#">SmartCRM</a>.</strong> All rights reserved.
    </footer> -->
  </div>
</template>
<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>
