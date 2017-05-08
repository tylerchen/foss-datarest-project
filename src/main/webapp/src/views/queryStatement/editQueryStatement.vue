<template>
    <div>
        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="15" offset="3">
                <Form ref="form-validate" :model="model" :rules="ruleValidate" :label-width="160">
                    <Form-item>
                        <Button type="primary" icon="checkmark" @click="update('formValidate')">保存</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="ghost" icon="arrow-return-left" @click="goback">返回</Button>
                    </Form-item>

                    <Form-item label="名称">
                        {{model.name}}
                    </Form-item>

                    <Form-item label="显示字段" prop="selectBody">
                        <Input v-model="model.selectBody" placeholder="请输入"  type="textarea" :rows="5" style="width: 500px"></Input>
                    </Form-item>

                    <Form-item label="数据表" prop="fromBody">
                        <Input v-model="model.fromBody" placeholder="请输入"  type="textarea" :rows="3" style="width: 500px;"></Input>
                    </Form-item>

                    <Form-item label="查询条件" prop="whereBody">
                        <Input v-model="model.whereBody" placeholder="请输入" type="textarea" :rows="6" style="width: 500px"></Input>
                    </Form-item>

                    <Form-item label="描述">
                        <Input v-model="model.description" placeholder="请输入" style="width: 500px"></Input>
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
                model: {},
                ruleValidate: {
                    selectBody: [
                        {required: true, message: '显示字段不能为空', trigger: 'blur'}
                    ],
                    fromBody: [
                        {required: true, message: '数据表不能为空', trigger: 'blur'}
                    ],
                    whereBody: [
                        {required: true, message: '查询条件不能为空', trigger: 'blur'}
                    ]
                }
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
                        });
            },
            update (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var params = "queryStatement=" + encodeURIComponent(JSON.stringify(this.model))
                        this.$http.post(MODULE.URL.UPDATE, params)
                                .then((response) => {
                                    this.goback()
                                    this.$Message.success('修改成功!')
                                })
                                .catch((error) => {
                                    console.log(error)
                                    this.$Message.error('修改失败!')
                                })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            goback () {
                this.$router.push(MODULE.ROUTER.LIST)
            }
        }
    }
</script>