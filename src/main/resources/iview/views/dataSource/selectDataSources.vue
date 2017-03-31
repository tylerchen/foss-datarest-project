<template>
    <Modal :visible.sync="showModal" title="选择数据源" :closable="false">

        <br />
        <Row type="flex" justify="center" align="middle">
            <i-col span="22">
               <i-table :columns="columns" :data="rows" @on-selection-change="changeSelectedRow"></i-table>
            </i-col>
        </Row>
        <br />
        <Row type="flex" justify="space-around" align="middle">
            <i-col span="22">
                <Page :total="totalCount" :page-size="pageSize" :current="currentPage"
                      @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
            </i-col>
        </Row>

        <p slot="footer">
            <i-button type="ghost" @click="cancel">取消</i-button>&nbsp;&nbsp;
            <i-button type="primary" @click="ok">确定</i-button>
        </p>
    </Modal>
</template>
<script>
    import { DATA_SOURCE as MODULE } from '../../config/vuex.js';

    var INIT_CURRENT_PAGE = 1
    var INIT_PAGE_SIZE = 10

    export default {
        props: ['showModal'],
        watch: {
            showModal() {
                if(this.showModal) {
                    this.initListData()
                }
            }
        },
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '修改时间',
                        key: 'updateTime'
                    }
                ],
                rows: [

                ],
                currentPage: INIT_CURRENT_PAGE,
                pageSize: INIT_PAGE_SIZE,
                totalCount: 0,
                selectedIds: []
            }
        },
        methods: {
            view () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$router.go(VIEW_PATH + "/" + this.selectedIds[0])
                }
            },
            refresh () {
                this.initListData()
            },
            initListData () {
                this.selectedIds = []
                this.$set('currentPage', INIT_CURRENT_PAGE)
                this.$set('pageSize', INIT_PAGE_SIZE)
                this.getDataPage()
            },
            changePage (current) {
                this.selectedIds = []
                this.$set('currentPage', current)
                this.getDataPage()
            },
            changePageSize (pageSize) {
                this.selectedIds = []
                this.$set('pageSize', pageSize)
                this.getDataPage()
            },
            getDataPage () {
                this.$http.get(MODULE.URL.LIST + "/currentPage=" + this.currentPage + "/pageSize=" + this.pageSize)
                        .then((response) => {
                            console.log(response.data)
                            var resultData = response.data
                            this.$set('rows', resultData.rows)
                            this.$set('totalCount', resultData.totalCount)
                        })
                        .catch(function(response) {
                            console.log(response)
                        })
            },
            checkSelectedOnlyOne (selectedIds) {
                if(selectedIds.length != 1) {
                    this.$Message.warning('请选择一条记录!')
                    return false
                }
                return true
            },
            changeSelectedRow (selection) {
                this.selectedIds = []
                for(var i=0; i<selection.length; i++) {
                    this.selectedIds.push(selection[i].id)
                }
            },
            ok () {

                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$dispatch('returnDataSourceId', this.selectedIds[0])
                    this.showModal = false
                }
            },
            cancel () {
                this.showModal = false
            }
        }
    }
</script>