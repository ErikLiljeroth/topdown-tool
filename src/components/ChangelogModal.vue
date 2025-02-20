<!-- src/components/ChangelogModal.vue -->
<template>
  <!-- Version label in bottom-right corner -->
  <div class="changelog-trigger" @click="openModal">
    {{ versionLabel }}
  </div>

  <!-- Modal overlay -->
  <div v-if="showModal" class="changelog-overlay" @click.self="closeModal">
    <div class="changelog-content" @click.stop>
      <div v-html="renderedHtml"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  versionLabel: {
    type: String,
    default: 'v0.1',
  },
  changelogMd: {
    type: String,
    default: '',
  },
})

const showModal = ref(false)

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

// Convert the raw markdown to HTML
const renderedHtml = computed(() => {
  if (!props.changelogMd) return ''

  return marked.parse(props.changelogMd)
})
</script>

<style scoped>
.changelog-trigger {
  position: fixed;
  bottom: 10px;
  right: 10px;
  color: #fff;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
}
.changelog-trigger:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.changelog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 4rem;
}

.changelog-content {
  font-size: 0.8rem;
  line-height: 1.3;
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
  background-color: #1f1f1f;
  color: #e0e0e0;
  padding: 1rem;
  border-radius: 8px;
}

.changelog-content h1 {
  font-size: 1.2rem;
}
.changelog-content h2 {
  font-size: 0.8rem;
}
.changelog-content h3 {
  font-size: 0.6rem;
}

.close-btn {
  display: block;
  margin: 1rem auto 0 auto;
  padding: 0.3rem 0.8rem;
  border: 1px solid #444;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
.close-btn:hover {
  background-color: #444;
}
</style>
