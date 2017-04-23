<template>

    <query-view-component data-source-name="soc_monitor"
                          query-statement-name="monitormenu"
                          customize="true"
                          v-ref:child></query-view-component>

</template>
<script>

    import QueryViewComponent from './queryView'

    export default {
        components: {
            'query-view-component': QueryViewComponent
        },
        data () {
            return {
                columns: [
                    {
                        title: '菜单ID',
                        key: 'mId'
                    },
                    {
                        title: '菜单名称',
                        key: 'mName'
                    },
                ],
                searchConditions: [
                    {
                        name: '菜单ID',
                        paramName: 'string_mId',
                        paramValue: ""
                    },
                    {
                        name: '菜单名称',
                        paramName: 'string_mName',
                        paramValue: ""
                    }
                ],
                pageSizeOpts: [3, 10]
            }
        },
        ready () {
            var data = {
                columns: this.columns,
                searchConditions: this.searchConditions,
                pageSizeOpts: this.pageSizeOpts
            }
            this.$refs.child.$emit('customizeData', data)
        }
    }
</script>