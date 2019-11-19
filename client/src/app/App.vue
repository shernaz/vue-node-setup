<template>
  <div>
    <nav>
      <ul>
        <router-link tag="li" to="/">Home</router-link>
        <router-link tag="li" to="/users">Users</router-link>
        <router-link tag="li" to="/payments">Payments</router-link>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>