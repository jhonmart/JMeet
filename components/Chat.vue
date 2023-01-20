<template>
  <section>
    <header>
      <button class="button-round red is-small" onclick="showOrHiddenChat()">
        <span class="material-symbols-outlined"> close </span>
      </button>
    </header>
    <aside id="chatOutput"></aside>
    <form id="chatPannel">
      <input type="file" id="fileChat" class="hidden" />
      <select id="camMeet" class="hidden">
        <option value="stream">Frente</option>
        <option value="environment">Trás</option>
      </select>
      <input id="peerMsg" placeholder="Mensagem" required />
      <button type="submit">
        <span class="material-symbols-outlined"> send </span>
      </button>
    </form>
  </section>
</template>

<script>
export default {
  name: 'Chat'
}
</script>
