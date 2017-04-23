<template>
    <Modal :visible.sync="showModal" title="预览" width="1000">

         <query-view-component :data-source-name.sync="dataSourceName" :query-statement-name.sync="queryStatementName"></query-view-component>

    </Modal>
</template>
<script>

    import QueryViewComponent from './queryView'

    export default {
        props: ['showModal'],
        data () {
            return {
                dataSourceName: '',
                queryStatementName: ''
            }
        },
        components: {
            'query-view-component': QueryViewComponent
        },
        events: {
            'setData': function (dataSourceName, queryStatementName) {
                this.$set('dataSourceName', dataSourceName)
                this.$set('queryStatementName', queryStatementName)
            }
        }
    }
</script>