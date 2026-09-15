<script setup>
import { BApp } from 'bootstrap-vue-next'
</script>

<template>
  <BApp>
    <router-view />
    <router-view name="modal" />
  </BApp>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700&family=Nunito+Sans:wght@400;600&display=swap');

:root {
  --color-butter: #F4D892;
  --color-moss: #C0B05B;
  --color-palm: #657652;
  --color-guava: #f2b6a3;
  --color-sunset: #e89c73;
  --color-sangria: #e36559;
  --color-seabreeze: #e5e9eb;
  --color-lagoon: #94bebb;
  --color-odyssey: #23617e;
  --color-ink: #3a3a3a;
  --color-offwhite: #f5f5f5;

  --font-heading: 'Baloo 2', sans-serif;
  --font-body: 'Nunito Sans', sans-serif;
  --radius-lg: 20px;
  --radius-pill: 999px;
}

body {
  background: var(--color-offwhite);
  color: var(--color-ink);
  font-family: var(--font-body);
  margin: 0;
}
</style>