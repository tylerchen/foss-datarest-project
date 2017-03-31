<template>
    <br>
    <Row type="flex" justify="center" align="middle">
        <i-col span="3"></i-col>
        <i-col span="15">
            <i-form :label-width="160">
                <Form-item>
                    <i-button type="ghost" icon="arrow-return-left" @click="goback">返回</i-button>
                </Form-item>

                <Form-item label="名称">
                    {{model.name}}
                </Form-item>

                <Form-item label="显示字段">
                    {{model.selectBody}}
                </Form-item>

                <Form-item label="数据表">
                    {{model.fromBody}}
                </Form-item>

                <Form-item label="查询条件">
                    {{model.whereBody}}
                </Form-item>

                <Form-item label="描述">
                    {{model.description}}
                </Form-item>

                <Form-item label="创建时间">
                    {{model.createTime}}
                </Form-item>

                <Form-item label="修改时间">
                    {{model.updateTime}}
                </Form-item>
            </i-form>
        </i-col>
        <i-col span="5"></i-col>
    </Row>
</template>
<script>
    import { QUERY_STATEMENT as MODULE } from '../../config/vuex.js';
    export default {
        data () {
            return {
                model: {}
            }
        },
        ready () {
            this.getModelData()
        },
        methods: {
            getModelData () {
                var id = this.$route.params.id
                var url = MODULE.URL.GET + "/" + id
                this.$http.get(url)
                        .then((response) => {
                            var resultData = response.data
                            this.$set('model', resultData)
                        })
                        .catch(function (response) {
                            console.log(response)
                        })
            },
            goback () {
                this.$router.go('/query_statement_list')
            }
        }
    }
</script>