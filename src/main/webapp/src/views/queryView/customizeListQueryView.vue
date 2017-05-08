<template>

    <query-view-component ref="child"></query-view-component>

</template>
<script>

    import QueryViewComponent from './queryView'

    export default {
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
        mounted () {
            var data = {
                columns: this.columns,
                searchConditions: this.searchConditions,
                pageSizeOpts: this.pageSizeOpts
            }
            this.$refs.child.load("soc_monitor", "monitormenu", data)
        },
        components: {
            'query-view-component': QueryViewComponent
        }
    }
</script>