<template>
    <Modal v-model="localShowModal" title="预览" width="1000">

         <query-view-component ref="child"></query-view-component>

    </Modal>
</template>
<script>

    import QueryViewComponent from './queryView'

    export default {
        data () {
            return {
                localShowModal: false
            }
        },
        methods: {
            show (showModal, dataSourceName, queryStatementName) {
                this.localShowModal = showModal
                this.$refs.child.init(dataSourceName, queryStatementName)
            }
        },
        components: {
            'query-view-component': QueryViewComponent
        }
    }
</script>