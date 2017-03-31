<template>

    <step-state-component :current-state="currentState"></step-state-component>

    <br />
    <Row type="flex" justify="center" align="middle">
        <i-col span="4"></i-col>
        <i-col span="14">

            <Collapse :active-key="panelActiveKey" style="width: 650px" @on-change="changePanel">
                <Panel key="1">
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
<!--                            <div :style="{float: 'right', margin: '5px'}">
                                <i-button type="ghost" size="small" @click="reloadData">刷新</i-button>
                            </div>-->
                        </Transfer>
                    </p>
                </Panel>
            </Collapse>

            <br>
            <i-form v-ref:form-validate :model="model">
                <Form-item v-for="item in model.tables">
                    <Form-item style="float: left">
                        <i-select :model.sync="item.type" style="width: 150px">
                            <i-option value="PRIMARY">主表</i-option>
                            <i-option value="LEFT JOIN">LEFT JOIN</i-option>
                            <i-option value="RIGHT JOIN">RIGHT JOIN</i-option>
                            <i-option value="RIGHT JOIN">INNER JOIN</i-option>
                            <i-option value="JOIN">JOIN</i-option>
                        </i-select>
                        &nbsp;
                        {{ item.name }}
                    </Form-item>

                    <Form-item :prop="'tables.' + $index + '.alias'"
                        :rules="{required: true, message: '别名不能为空', trigger: 'blur'}" style="float: left;margin-left: 10px">
                        <i-input :value.sync="item.alias" style="width: 120px"></i-input>
                    </Form-item>

                    <Form-item style="float: left; margin-left: 10px">
                        <i-button type="ghost" size="small" @click="copy(item)">复制</i-button>&nbsp;
                        <i-button type="ghost" size="small" @click="remove(item)">删除</i-button>&nbsp;
                    </Form-item>
                </Form-item>
            </i-form>

        </i-col>
        <i-col span="6"></i-col>
    </Row>

    <br />
    <Row type="flex" justify="center" align="middle">
        <i-col span="2"></i-col>
        <i-col span="20">
            <i-button type="primary" @click="previous">上一步</i-button>
            &nbsp;&nbsp;
            <i-button type="primary" @click="next('formValidate')">下一步</i-button>
        </i-col>
        <i-col span="2"></i-col>
    </Row>
</template>
<script>
    import { TABLE as MODULE, QUERY_STATEMENT_CREATE_STORE as STORE} from '../../config/vuex.js';
    import StepStateComponent from './stepState.vue'
    export default {
        data () {
            return {
                currentState: 1,
                panelActiveKey: [1],
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
        ready () {
            this.loadReadyTables()

            if(this.model.tables.length == 0) {
                this.panelActiveKey = [1]
                this.panelName = '收起'
            }
            else {
                this.panelActiveKey = []
                this.panelName = '展开'
            }
        },
        components: {
            'step-state-component': StepStateComponent
        },
        methods: {
            previous () {
                STORE.tables = this.model.tables
                this.$router.go("/step_config_data_source")
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
                        this.$router.go("/step_config_query_statement")
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
                var url = MODULE.URL.LIST + "/" + STORE.dataSourceId
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
                this.model.tables.$remove(table)
            }
        }
    }
</script>