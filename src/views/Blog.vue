<script setup>
import { ref } from "vue";
import FormPost from "@/components/FormPost.vue";
import PostList from "@/components/PostList.vue";

const reloadCounter = ref(0);
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">📝 Bài viết mới nhất </h2>
    <FormPost @post-success="reloadCounter++" />
    <PostList :reload="reloadCounter" />
  </div>
</template>
