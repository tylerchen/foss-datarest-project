<template>

    <query-view-component ref="child"></query-view-component>

</template>
<script>

    import QueryViewComponent from './queryView'

    export default {
        mounted () {
            this.$refs.child.init("soc_monitor", "monitormenu")
        },
        components: {
            'query-view-component': QueryViewComponent
        }
    }
</script>