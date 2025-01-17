<template>
    <KanbanBoard />
</template>

<script>
import KanbanBoard from "./components/KanbanBoard.vue";

export default {
    name: "App",
    components: {
        KanbanBoard,
    },
};
</script>

<style>
body {
    margin: 0;
}
</style>