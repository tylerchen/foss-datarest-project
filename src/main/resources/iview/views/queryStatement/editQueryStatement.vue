<template>
    <br>
    <Row type="flex" justify="center" align="middle">
        <i-col span="3"></i-col>
        <i-col span="15">
            <i-form v-ref:form-validate :model="model" :rules="ruleValidate" :label-width="160">
                <Form-item>
                    <i-button type="primary" icon="checkmark" @click="update('formValidate')">保存</i-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <i-button type="ghost" icon="arrow-return-left" @click="goback">返回</i-button>
                </Form-item>

                <Form-item label="名称">
                    {{model.name}}
                </Form-item>

                <Form-item label="显示字段" prop="selectBody">
                    <i-input :value.sync="model.selectBody" placeholder="请输入"  type="textarea" :rows="5" style="width: 500px"></i-input>
                </Form-item>

                <Form-item label="数据表" prop="fromBody">
                    <i-input :value.sync="model.fromBody" placeholder="请输入"  type="textarea" :rows="3" style="width: 500px;"></i-input>
                </Form-item>

                <Form-item label="查询条件" prop="whereBody">
                    <i-input :value.sync="model.whereBody" placeholder="请输入" type="textarea" :rows="6" style="width: 500px"></i-input>
                </Form-item>

                <Form-item label="描述">
                    <i-input :value.sync="model.description" placeholder="请输入" style="width: 500px"></i-input>
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
        ready () {
            this.getModelData()
        },
        methods: {
            getModelData () {
                var url = MODULE.URL.GET + "/" + this.$route.params.id
                this.$http.get(url)
                        .then((response) => {
                            var resultData = response.data
                            this.$set('model', resultData)
                        })
                        .catch(function (response) {
                            console.log(response)
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
                                .catch(function (response) {
                                    console.log(response)
                                    this.$Message.error('修改失败!')
                                })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            goback () {
                this.$router.go('/query_statement_list')
            }
        }
    }
</script>