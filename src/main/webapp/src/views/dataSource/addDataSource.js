define([ 'vue', 'html!views/dataSource/addDataSource.html', 'globalConst' ],
    function(Vue, html, globalConst) {

    const MODULE = globalConst.DATA_SOURCE

    return {
        template : html,
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
                        {required: true, message: '初始化连接数不能为空', trigger: 'blur'}
                    ],
                    maxConnection: [
                        {required: true, message: '最大连接数不能为空', trigger: 'blur'}
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
                            .catch((error) => {
                                this.$Message.error('添加失败!')
                                console.log(error)
                            });
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
})