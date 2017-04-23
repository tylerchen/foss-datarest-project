<template>

    <query-view-component data-source-name="soc_monitor" query-statement-name="monitormenu"></query-view-component>

</template>
<script>

    import QueryViewComponent from './queryView'

    export default {
        components: {
            'query-view-component': QueryViewComponent
        }
    }
</script>