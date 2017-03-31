<template>
    <br>
    <Row type="flex" justify="center" align="middle">
        <i-col span="6"></i-col>
        <i-col span="12">
            <i-form :label-width="160">
                <Form-item>
                    <i-button type="ghost" icon="arrow-return-left" @click="goback">返回</i-button>
                </Form-item>

                <Form-item label="名称">
                    {{model.name}}
                </Form-item>

                <Form-item label="JDBC Driver">
                    {{model.driver}}
                </Form-item>

                <Form-item label="JDBC URL">
                    {{model.url}}
                </Form-item>

                <Form-item label="用户名">
                    {{model.user}}
                </Form-item>

                <Form-item label="密码">
                    {{model.password}}
                </Form-item>

                <Form-item label="校验查询语句">
                    {{model.validationQuery}}
                </Form-item>

                <Form-item label="初始化连接数">
                    {{model.initConnection}}
                </Form-item>

                <Form-item label="最大连接数">
                    {{model.maxConnection}}
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
    import { DATA_SOURCE as MODULE } from '../../config/vuex.js';
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
                this.$router.go('/data_source_list')
            }
        }
    }
</script>