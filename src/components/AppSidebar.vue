<template>
  <!--SideBar-->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
   <router-link to="/" class="brand-link">
      <img src="@/assets/CRMLogo1.png" alt="SmartCRM Logo" class="brand-image img-square elevation-3" style="height: 40px; width: 40px; object-fit: cover; opacity: .8"/>
      <div class="d-inline-block ms-2">
  <span class="brand-text font-weight-light">SmartCRM</span>
       </div>
    </router-link>

    <div class="sidebar">
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column"  data-widget="treeview" role="menu" data-accordion="false">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active" exact-active-class="active">
              <i class="nav-icon fas fa-house"></i>
              <p>Dashboard</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/leads" class="nav-link" active-class="active" exact-active-class="active">
              <i class="nav-icon fas fa-users"></i>
              <p>Leads</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/addlead" class="nav-link" active-class="active" exact-active-class="active">
              <i class="nav-icon fas fa-user-plus"></i>
              <p>Add Lead</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tasks" class="nav-link" active-class="active" exact-active-class="active">
              <i class="nav-icon fas fa-tasks"></i>
              <p>Tasks</p>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script setup>
/*import { useRoute } from 'vue-router'
const route = useRoute()
const isActive = (path) => route.path.startsWith(path)*/
</script>
