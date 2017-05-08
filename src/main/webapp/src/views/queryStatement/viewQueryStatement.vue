<template>
    <div>
        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="15" offset="3">
                <Form :label-width="160">
                    <Form-item>
                        <Button type="ghost" icon="arrow-return-left" @click="goback">返回</Button>
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
                </Form>
            </Col>
        </Row>
    </div>
</template>
<script>
    import { QUERY_STATEMENT as MODULE } from '../../config/vuex.js';
    export default {
        data () {
            return {
                model: {}
            }
        },
        mounted () {
            this.getModelData()
        },
        methods: {
            getModelData () {
                var url = MODULE.URL.GET + "/" + this.$route.params.id
                this.$http.get(url)
                        .then((response) => {
                            var resultData = response.data
                            this.$set(this.$data, 'model', resultData)
                        })
                        .catch((error) => {
                            console.log(error)
                        })
            },
            goback () {
                this.$router.push(MODULE.ROUTER.LIST)
            }
        }
    }
</script>