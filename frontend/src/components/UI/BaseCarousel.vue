<template>
  <div :class="$style.carouselContainer">
    <div :class="$style.carouselTrack">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// A simple CSS scroll-snap carousel
</script>

<style lang="scss" module src="./BaseCarousel.module.scss"></style>
