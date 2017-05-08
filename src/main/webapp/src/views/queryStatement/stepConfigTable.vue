<template>
    <div>
        <step-state-component :current-state="currentState"></step-state-component>

        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="14" offset="4">

                <Collapse v-model="panelActiveKey" style="width: 650px" @on-change="changePanel">
                    <Panel name="1">
                        {{ panelName }}
                        <p slot="content">
                            <Transfer
                                    :data="readyTables"
                                    :target-keys="selectedTables"
                                    :list-style="listStyle"
                                    :render-format="render"
                                    :operations="['向左移动','向右移动']"
                                    filterable
                                    @on-change="handleChange">
                            </Transfer>
                        </p>
                    </Panel>
                </Collapse>

                <br>
                <Form ref="formValidate" :model="model">
                    <Form-item v-for="(item, index) in model.tables">
                        <Form-item style="float: left">
                            <Select v-model="item.type" style="width: 150px">
                                <Option value="PRIMARY">主表</Option>
                                <Option value="LEFT JOIN">LEFT JOIN</Option>
                                <Option value="RIGHT JOIN">RIGHT JOIN</Option>
                                <Option value="RIGHT JOIN">INNER JOIN</Option>
                                <Option value="JOIN">JOIN</Option>
                            </Select>
                            &nbsp;
                            {{ item.name }}
                        </Form-item>

                        <Form-item :prop="'tables.' + index + '.alias'"
                            :rules="{required: true, message: '别名不能为空', trigger: 'blur'}" style="float: left;margin-left: 10px">
                            <Input v-model="item.alias" style="width: 120px"></Input>
                        </Form-item>

                        <Form-item style="float: left; margin-left: 10px">
                            <Button type="ghost" size="small" @click="copy(item)">复制</Button>&nbsp;
                            <Button type="ghost" size="small" @click="remove(item)">删除</Button>&nbsp;
                        </Form-item>
                    </Form-item>
                </Form>

            </Col>
        </Row>

        <br>
        <Row type="flex" justify="center" align="middle">
            <i-col span="20" offset="2">
                <Button type="primary" @click="previous">上一步</Button>
                &nbsp;&nbsp;
                <Button type="primary" @click="next('formValidate')">下一步</Button>
            </i-col>
        </Row>
    </div>
</template>
<script>
    import { QUERY_STATEMENT as MODULE, TABLE, QUERY_STATEMENT_CREATE_STORE as STORE} from '../../config/vuex.js';
    import StepStateComponent from './stepState.vue'
    export default {
        data () {
            return {
                currentState: 1,
                panelActiveKey: '1',
                panelName: '收起',
                tablesWithColumns: {},
                readyTables: [],
                selectedTables: [],
                listStyle: {
                    width: '250px',
                    height: '400px'
                },
                model: {
                    tables: STORE.tables
                }
            }
        },
        mounted () {
            this.loadReadyTables()

            if(this.model.tables.length == 0) {
                this.panelActiveKey = '1'
                this.panelName = '收起'
            }
            else {
                this.panelActiveKey = ''
                this.panelName = '展开'
            }
        },
        components: {
            'step-state-component': StepStateComponent
        },
        methods: {
            previous () {
                STORE.tables = this.model.tables
                this.$router.push(MODULE.ROUTER.STEP_CONFIG_DATA_SOURCE)
            },
            next (name) {
                this.$refs[name].validate((valid) => {
                    if (valid && this.model.tables.length > 0) {
                        var clearDuplicateTable = [this.model.tables[0]]
                        for(var j in this.model.tables) {
                            var table = this.model.tables[j]
                            if(clearDuplicateTable.indexOf(table) == -1) {
                                if(table.type != 'PRIMARY' && table.onConditions == undefined) {
                                    table.onConditions = [{onColumn: "", refTable: "", refColumn: ""}]
                                }
                                clearDuplicateTable.push(table)
                            }
                        }
                        STORE.tables = clearDuplicateTable
                        this.$router.push(MODULE.ROUTER.STEP_CONFIG_QUERY_STATEMENT)
                    }
                })
            },
            handleChange (newSelectedTables) {
                for(var i in newSelectedTables) {
                    var selectedTableName = newSelectedTables[i]
                    if(this.selectedTables.indexOf(selectedTableName) == -1) {
                        this.model.tables.push({
                            type: (this.selectedTables.length == 0 && i == 0)? 'PRIMARY' : 'LEFT JOIN',
                            name: selectedTableName,
                            alias: '',
                            columns: this.tablesWithColumns[selectedTableName].columns
                        })
                    }
                }
                this.selectedTables = newSelectedTables;
            },
            render (item) {
                return item.label;
            },
            loadReadyTables () {
                var url = TABLE.URL.LIST + "/" + STORE.dataSourceId
                this.$http.get(url)
                    .then((response) => {
                        this.tablesWithColumns = response.data
                        for(var tableKey in this.tablesWithColumns) {
                            this.readyTables.push({
                                key: tableKey,
                                label: '表名: ' + tableKey,
                                disabled: false
                            });
                        }

                        this.model.tables = STORE.tables
                        this.selectedTables = []
                        if(this.model.tables.length > 0) {
                            for(var i in this.model.tables) {
                                var table = this.model.tables[i]
                                if(this.selectedTables.indexOf(table.name) == -1) {
                                    this.selectedTables.push(table.name)
                                }
                            }
                        }
                    })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            changePanel (object) {
                if(object.length == 0) {
                    this.panelName = '展开'
                }
                else {
                    this.panelName = '收起'
                }
            },
            copy (table) {
                this.model.tables.push({
                    type: 'LEFT JOIN',
                    name: table.name,
                    alias: '',
                    columns: table.columns
                })
            },
            remove (table) {
                //this.model.tables.$remove(table)
                this.arrayRemove(this.model.tables, table)
            },
            arrayRemove (array, item) {
                if(array != null && array != undefined) {
                    let index = array.indexOf(item)
                    if(index > -1) {
                        array.splice(index, 1)
                    }
                }
            }
        }
    }
</script>