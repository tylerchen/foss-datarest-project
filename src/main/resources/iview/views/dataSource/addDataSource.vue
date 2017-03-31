<template>
    <br/>
    <Row type="flex" justify="center" align="middle">
        <i-col span="6"></i-col>
        <i-col span="12">
            <i-form v-ref:form-validate :model="model" :rules="ruleValidate" :label-width="160">
                <Form-item>
                    <i-button type="primary" icon="checkmark" @click="add('formValidate')">保存</i-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <i-button type="ghost" icon="arrow-return-left" @click="goback">返回</i-button>
                </Form-item>

                <Form-item label="名称" prop="name">
                    <i-input :value.sync="model.name" placeholder="请输入" style="width: 300px"></i-input>
                </Form-item>

                <Form-item label="JDBC Driver" prop="driver">
                    <i-input :value.sync="model.driver" placeholder="请输入" style="width: 300px"></i-input>
                </Form-item>

                <Form-item label="JDBC URL" prop="url">
                    <i-input :value.sync="model.url" placeholder="请输入" type="textarea" :rows="5" style="width: 300px;"></i-input>
                </Form-item>

                <Form-item label="用户名" prop="user">
                    <i-input :value.sync="model.user" placeholder="请输入" style="width: 300px"></i-input>
                </Form-item>

                <Form-item label="密码" prop="password">
                    <i-input :value.sync="model.password" placeholder="请输入" style="width: 300px"></i-input>
                </Form-item>

                <Form-item label="校验查询语句" prop="validationQuery">
                    <i-input :value.sync="model.validationQuery" placeholder="请输入" style="width: 300px"></i-input>
                </Form-item>

                <Form-item label="初始化连接数" prop="initConnection">
                    <i-input :value.sync="model.initConnection" placeholder="请输入" style="width: 300px"></i-input>
                </Form-item>

                <Form-item label="最大连接数" prop="maxConnection">
                    <i-input :value.sync="model.maxConnection" placeholder="请输入" style="width: 300px"></i-input>
                </Form-item>

                <Form-item label="描述">
                    <i-input :value.sync="model.description" placeholder="请输入" style="width: 300px"></i-input>
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
                model: {},
                ruleValidate: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
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
        methods: {
            add (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var params = "datasource=" + encodeURIComponent(JSON.stringify(this.model))
                        this.$http.post(MODULE.URL.ADD, params)
                                .then((response) => {
                                    this.goback()
                                    this.$Message.success('添加成功!')
                                })
                                .catch(function (response) {
                                    this.$Message.error('添加失败!')
                                    console.log(response)
                                });
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            goback () {
                this.$router.go('/data_source_list')
            }
        }
    }
</script>