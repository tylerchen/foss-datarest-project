<template>
    <Modal :visible.sync="showModal" title="SQL模板预览" :closable="false">

        <br>
        <Row type="flex" justify="center" align="middle">

            <i-col span="2"></i-col>

            <i-col span="3" style="font-size: 16px;padding-left: 13px;"></i-col>

            <i-col span="17" style="padding-left: 10px;">
                SELECT {{ saveModel.selectBody }}
                FROM {{ saveModel.fromBody }}
                WHERE {{ saveModel.whereBody }}
            </i-col>

            <i-col span="2"></i-col>

        </Row>

        <p slot="footer">
            <i-button type="ghost" @click="cancel">返回</i-button>&nbsp;&nbsp;
        </p>
    </Modal>
</template>
<script>
    export default {
        props: ['showModal'],
        data () {
            return {
                saveModel: {}
            }
        },
        events: {
            'setData': function (saveModel) {
                this.saveModel = saveModel
                //this.$set('sql', dataSourceId)
            }
        },
        methods: {
            cancel () {
                this.showModal = false
            }
        }
    }
</script>