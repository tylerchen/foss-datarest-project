<template>
    <div>
        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="12" offset="3">
                <Form ref="formValidate" :model="model" :rules="ruleValidate" :label-width="160">
                    <Form-item>
                        <Button type="primary" icon="checkmark" @click="update('formValidate')">保存</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="ghost" icon="arrow-return-left" @click="goback">返回</Button>
                    </Form-item>

                    <Form-item label="名称">
                        {{model.name}}
                    </Form-item>

                    <Form-item label="JDBC Driver" prop="driver">
                        <Input v-model="model.driver" placeholder="请输入" style="width: 300px"></Input>
                    </Form-item>

                    <Form-item label="JDBC URL" prop="url">
                        <Input v-model="model.url" placeholder="请输入" type="textarea" :rows="5" style="width: 300px;"></Input>
                    </Form-item>

                    <Form-item label="用户名" prop="user">
                        <Input v-model="model.user" placeholder="请输入" style="width: 300px"></Input>
                    </Form-item>

                    <Form-item label="密码" prop="password">
                        <Input v-model="model.password" placeholder="请输入" style="width: 300px"></Input>
                    </Form-item>

                    <Form-item label="校验查询语句" prop="validationQuery">
                        <Input v-model="model.validationQuery" placeholder="请输入" style="width: 300px"></Input>
                    </Form-item>

                    <Form-item label="初始化连接数" prop="initConnection">
                        <Input v-model="model.initConnection" placeholder="请输入" style="width: 300px"></Input>
                    </Form-item>

                    <Form-item label="最大连接数" prop="maxConnection">
                        <Input v-model="model.maxConnection" placeholder="请输入" style="width: 300px"></Input>
                    </Form-item>

                    <Form-item label="描述">
                        <Input v-model="model.description" placeholder="请输入" style="width: 300px"></Input>
                    </Form-item>
                </Form>
            </Col>
        </Row>
    </div>
</template>
<script>
    import { DATA_SOURCE as MODULE } from '../../config/vuex.js';
    export default {
        data () {
            return {
                model: {},
                ruleValidate: {
                    driver: [
                        {required: true, message: 'JDBC Driver不能为空', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: 'JDBC URL不能为空', trigger: 'blur'}
                    ],
                    user: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ],
                    validationQuery: [
                        {required: true, message: '校验查询语句不能为空', trigger: 'blur'}
                    ],
                    initConnection: [
                        {required: true, message: '初始化连接数', trigger: 'blur'}
                    ],
                    maxConnection: [
                        {required: true, message: '最大连接数', trigger: 'blur'}
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
                        .catch(function (response) {
                            console.log(response)
                        });
            },
            update (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var params = "datasource=" + encodeURIComponent(JSON.stringify(this.model))
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
                this.$router.replace(MODULE.ROUTER.LIST)
            }
        }
    }
</script>