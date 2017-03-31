<template>

    <step-state-component :current-state="currentState"></step-state-component>

    <br>
    <i-form v-ref:form-validate :model="model" :rules="ruleValidate" :label-width="300">

        <Form-item label="模板名称" prop="name">
            <i-input :value.sync="model.name" placeholder="请输入" style="width: 300px"></i-input>
        </Form-item>

        <Form-item label="模板描述">
            <i-input :value.sync="model.description" placeholder="请输入" style="width: 300px"></i-input>
        </Form-item>

        <Form-item label="数据表">
            {{ model.primaryTable.name }} &nbsp; {{ model.primaryTable.alias }}
        </Form-item>

        <Form-item label="关联表" v-show="model.joinTables.length > 0" v-for="table in model.joinTables">
            <Form-item style="float: left">
                {{ table.type }} &nbsp; {{ table.name }} &nbsp; {{ table.alias }} &nbsp; ON
            </Form-item>
            
            <br>
            <Form-item v-for="onCondition in model.joinTables[$index].onConditions">
                <Form-item :prop="'joinTables.' + $parent.$index + '.onConditions.' + $index + '.onColumn'"
                           :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left;">
                    <i-select :model.sync="onCondition.onColumn" filterable style="width: 150px">
                        <i-option v-for="item in table.columns" :value="table.alias + '.' + item.name">{{ item.name }}</i-option>
                    </i-select>
                    &nbsp; =
                </Form-item>

                <Form-item :prop="'joinTables.' + $parent.$index + '.onConditions.' + $index + '.refTable'"
                           :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left;margin-left: 10px">
                    <i-select :model.sync="onCondition.refTable" style="width: 150px" @on-change="loadRefColumns($parent.$index, $index)">
                        <i-option v-for="t in tables" :value="t.alias">{{ t.alias }}</i-option>
                    </i-select>
                </Form-item>

                <Form-item :prop="'joinTables.' + $parent.$index + '.onConditions.' + $index + '.refColumn'"
                           :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left;margin-left: 10px">
                    <i-select :model.sync="onCondition.refColumn" style="width: 150px">
                        <i-option v-for="c in model.joinTables[$parent.$index].onConditions[$index].refColumns" :value="c.name">{{ c.name }}</i-option>
                    </i-select>
                </Form-item>
                &nbsp;&nbsp;
                <i-button type="ghost" size="small" @click="remove($parent.$index, onCondition)">删除级联条件</i-button>&nbsp;
                <i-button v-show="$index == 0" type="ghost" size="small" @click="add($parent.$index)">添加级联条件</i-button>&nbsp;
                <br>
                <br>
            </Form-item>

        </Form-item>

        <Form-item label="显示字段">
            <Collapse :active-key="selectBodyPanelActiveKey" style="width: 630px" @on-change="changeSelectBodyPanel">
                <Panel key="1">
                    {{ selectBodyPanelName }}
                        <p slot="content">
                    <Transfer
                            :data="readySelectBodyColumns"
                            :target-keys="selectedSelectBodyColumns"
                            :list-style="listStyle"
                            :render-format="render"
                            :operations="['向左移动','向右移动']"
                            filterable
                            @on-change="handleSelectBodyChange">
                    </Transfer>
                </p>
                </Panel>
            </Collapse>

            <br>
            <Form-item v-for="item in model.selectColumns">
                <Form-item style="float: left">
                    {{ item.name }}&nbsp;&nbsp;
                </Form-item>

                <Form-item :prop="'selectColumns.' + $index + '.alias'"
                           :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left">
                    <i-input :value.sync="item.alias" style="width: 120px"></i-input>
                </Form-item>
                <br>
                <br>
            </Form-item>
        </Form-item>

        <Form-item label="查询条件">
            <Collapse :active-key="whereBodyPanelActiveKey" style="width: 630px" @on-change="changeWhereBodyPanel">
                <Panel key="1">
                    {{ whereBodyPanelName }}
                    <p slot="content">
                        <Transfer
                                :data="readyWhereBodyColumns"
                                :target-keys="selectedWhereBodyColumns"
                                :list-style="listStyle"
                                :render-format="render"
                                :operations="['向左移动','向右移动']"
                                filterable
                                @on-change="handleWhereBodyChange">
                        </Transfer>
                    </p>
                </Panel>
            </Collapse>

            <br>
            <Form-item v-for="whereCondition in model.whereConditions">
                <Form-item style="float: left">
                    <i-select :model.sync="whereCondition.andOr" style="width: 90px">
                        <i-option value="AND">AND</i-option>
                        <i-option value="OR">OR</i-option>
                    </i-select>
                    
                    &nbsp; {{ whereCondition.whereColumn }} &nbsp;
                    
                    <i-select :model.sync="whereCondition.meta" style="width: 90px">
                        <i-option value="=">=</i-option>
                        <i-option value="!=">!=</i-option>
                        <i-option value="like">LIKE</i-option>
                        <i-option value="<="><=</i-option>
                        <i-option value="<"><</i-option>
                        <i-option value=">=">>=</i-option>
                        <i-option value=">">></i-option>
                        <i-option value="in">IN</i-option>
                        <i-option value="not in">NOT IN</i-option>
                    </i-select>
                </Form-item>

                <Form-item :prop="'whereConditions.' + $index + '.queryParam'"
                           :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left;;margin-left: 10px">
                    <i-input :value.sync="whereCondition.queryParam" style="width: 120px;"></i-input>
                </Form-item>
                <br>
                <br>
            </Form-item>
        </Form-item>

        <br>
        <Row type="flex" justify="center" align="middle">
            <i-col span="2"></i-col>
            <i-col span="20">
                <i-button type="primary" @click="previous">上一步</i-button>
                &nbsp;&nbsp;
                <i-button type="primary" @click="preview('formValidate')">预览</i-button>
                &nbsp;&nbsp;
                <i-button type="primary" @click="complete('formValidate')">完成</i-button>
            </i-col>
            <i-col span="2"></i-col>
        </Row>

    </i-form>

    <step-preview-component :show-modal.sync="showStepPreviewModal" v-ref:steppreviewchild></step-preview-component>

</template>
<script>
    import { QUERY_STATEMENT as MODULE, QUERY_STATEMENT_CREATE_STORE as STORE, SEPARATOR } from '../../config/vuex.js';
    import StepStateComponent from './stepState.vue'
    import StepPreviewComponent from './stepPreview.vue'
    export default {
        data () {
            return {
                currentState: 2,
                tables: STORE.tables,
                model: STORE.queryStatementModel,
                listStyle: {
                    width: '230px',
                    height: '350px'
                },
                saveModel: {
                    name: '',
                    description: '',
                    selectBody: '',
                    fromBody: '',
                    whereBody: ''
                },
                readySelectBodyColumns: [],
                selectedSelectBodyColumns: [],
                selectBodyPanelActiveKey: [1],
                selectBodyPanelName: "收起",
                readyWhereBodyColumns: [],
                selectedWhereBodyColumns: [],
                whereBodyPanelActiveKey: [1],
                whereBodyPanelName: "收起",
                showStepPreviewModal: false,
                ruleValidate: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        ready () {
            this.loadPanel()
            this.loadPrimaryTableTableAndJoinTables()
            this.loadReadyColumns()
            this.loadSelectedSelectBodyColumns()
            this.loadSelectedWhereBodyColumns()
        },
        components: {
            'step-state-component': StepStateComponent,
            'step-preview-component': StepPreviewComponent
        },
        methods: {
            transformSaveModel () {
                
                STORE.queryStatementModel = this.model
                
                this.saveModel.name = this.model.name

                this.saveModel.description = this.model.description

                this.saveModel.selectBody = _.map(this.model.selectColumns, function (selectColumn) {
                    return selectColumn.name + SEPARATOR.SPACE_SPLIT + selectColumn.alias
                }).join(", ")

                var primary = this.model.primaryTable.name + SEPARATOR.SPACE_SPLIT + this.model.primaryTable.alias
                var join = _.map(this.model.joinTables, function (joinTable) {
                    var joinHead = joinTable.type + SEPARATOR.SPACE_SPLIT + joinTable.name + SEPARATOR.SPACE_SPLIT + joinTable.alias
                    var joinBody = _.map(joinTable.onConditions, function (onCondition) {
                        return onCondition.onColumn + SEPARATOR.EQ_SPLIT + onCondition.refTable + SEPARATOR.DOT_SPLIT + onCondition.refColumn
                    }).join(SEPARATOR.AND_SPLIT)

                    return joinHead + SEPARATOR.ON_SPLIT + joinBody
                }).join(SEPARATOR.SPACE_SPLIT)
                this.saveModel.fromBody = primary + SEPARATOR.SPACE_SPLIT + join

                this.saveModel.whereBody = _.map(this.model.whereConditions, function (whereCondition) {
                    return "[" +
                        whereCondition.andOr + SEPARATOR.SPACE_SPLIT +
                        whereCondition.whereColumn + SEPARATOR.SPACE_SPLIT +
                        whereCondition.meta + SEPARATOR.SPACE_SPLIT +
                        SEPARATOR.COLON_SPLIT + whereCondition.whereColumnType.toLowerCase() + SEPARATOR.UNDERLINE_SPLIT + whereCondition.queryParam +
                    "]"
                }).join("")
            },
            previous () {
                this.transformSaveModel()
                this.$router.go("/step_config_table")
            },
            complete (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        
                        this.transformSaveModel()

                        this.$http.post(MODULE.URL.ADD, "queryStatement=" + encodeURIComponent(JSON.stringify(this.saveModel)))
                            .then((response) => {
                                STORE.clear()
                                this.$router.go("/query_statement_list")
                                this.$Message.success('添加成功!')
                            })
                            .catch(function (response) {
                                console.log(response)
                                this.$Message.error('添加失败!')
                            })
                    }
                })
            },
            preview (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.showStepPreviewModal = true
                        this.transformSaveModel()
                        this.$refs.steppreviewchild.$emit('setData', this.saveModel)
                    }
                })
            },
            loadPanel () {
                if(this.model.selectColumns.length == 0) {
                    this.selectBodyPanelActiveKey = [1]
                    this.selectBodyPanelName = '收起'
                }
                else {
                    this.selectBodyPanelActiveKey = []
                    this.selectBodyPanelName = '展开'
                }

                if(this.model.whereConditions.length == 0) {
                    this.whereBodyPanelActiveKey = [1]
                    this.whereBodyPanelName = '收起'
                }
                else {
                    this.whereBodyPanelActiveKey = []
                    this.whereBodyPanelName = '展开'
                }
            },
            loadSelectedSelectBodyColumns () {
                for(var i in this.model.selectColumns) {
                    this.selectedSelectBodyColumns.push(this.model.selectColumns[i].name)
                }
            },
            loadSelectedWhereBodyColumns () {
                for(var i in this.model.whereConditions) {
                    var whereCondition = this.model.whereConditions[i]
                    var columnAndType = whereCondition.whereColumn + "#" + whereCondition.whereColumnType
                    this.selectedWhereBodyColumns.push(columnAndType)
                }
            },
            loadPrimaryTableTableAndJoinTables () {
                this.model.primaryTable = ""
                this.model.joinTables = []
                for(var i in this.tables) {
                    if(this.tables[i].type == 'PRIMARY') {
                        this.model.primaryTable = this.tables[i]
                    }
                    else {
                        this.model.joinTables.push(this.tables[i])
                    }
                }
            },
            loadRefColumns (tableIndex, onConditionIndex) {
                for(var i=0; i<this.tables.length; i++) {
                    if(this.model.joinTables[tableIndex].onConditions[onConditionIndex].refTable == this.tables[i].alias) {
                        var table = this.model.joinTables[tableIndex]
                        table.onConditions[onConditionIndex].refColumns = this.tables[i].columns
                        // 触发更新视图
                        this.model.joinTables.$set(tableIndex, table)
                        break
                    }
                }
            },
            loadReadyColumns () {
                for(var i=0; i<this.tables.length; i++) {
                    var columns = this.tables[i].columns
                    var tableAlias = this.tables[i].alias
                    for(var j=0; j<columns.length; j++) {
                        var columnName = columns[j].name
                        var columnType = "java.sql.Timestamp" == columns[j].type ? "date" : columns[j].type

                        this.readySelectBodyColumns.push({
                            key: tableAlias + SEPARATOR.DOT_SPLIT + columnName,
                            label: tableAlias + SEPARATOR.DOT_SPLIT + columnName,
                            disabled: false
                        });

                        this.readyWhereBodyColumns.push({
                            key: tableAlias + SEPARATOR.DOT_SPLIT + columnName + SEPARATOR.POUND_SIGN_SPLIT + columnType,
                            label: tableAlias + SEPARATOR.DOT_SPLIT + columnName,
                            disabled: false
                        });
                    }
                }
                this.selectedSelectBodyColumns = []
                this.selectedWhereBodyColumns = []
            },
            handleSelectBodyChange (newSelectedSelectBodyColumns) {
                var delColumns = []
                for (var i in this.model.selectColumns) {
                    var column = this.model.selectColumns[i]
                    if (newSelectedSelectBodyColumns.indexOf(column.name) == -1) {
                        delColumns.push(column)
                    }
                }
                for (var i in delColumns) {
                    this.model.selectColumns.$remove(delColumns[i])
                }

                for(var i in newSelectedSelectBodyColumns) {
                    var newSelectedSelectBodyColumn = newSelectedSelectBodyColumns[i]
                    if(this.selectedSelectBodyColumns.indexOf(newSelectedSelectBodyColumn) == -1) {
                        this.model.selectColumns.push({
                            name: newSelectedSelectBodyColumn,
                            alias: ''
                        })
                    }
                }

                this.selectedSelectBodyColumns = newSelectedSelectBodyColumns;
            },
            render (item) {
                return item.label;
            },
            changeSelectBodyPanel (object) {
                if(object.length == 0) {
                    this.selectBodyPanelName = '展开'
                }
                else {
                    this.selectBodyPanelName = '收起'
                }
            },
            handleWhereBodyChange (newSelectedWhereBodyColumns) {
                var delColumns = []
                for (var i in this.model.whereConditions) {
                    var column = this.model.whereConditions[i]
                    var columnAndType = column.whereColumn + "#" + column.whereColumnType
                    if (newSelectedWhereBodyColumns.indexOf(columnAndType) == -1) {
                        delColumns.push(column)
                    }
                }
                for (var i in delColumns) {
                    this.model.whereConditions.$remove(delColumns[i])
                }

                for(var i in newSelectedWhereBodyColumns) {
                    var newSelectedWhereBodyColumn = newSelectedWhereBodyColumns[i]
                    if(this.selectedWhereBodyColumns.indexOf(newSelectedWhereBodyColumn) == -1) {
                        var columnAndType = newSelectedWhereBodyColumn.split(SEPARATOR.POUND_SIGN_SPLIT)
                        this.model.whereConditions.push({
                            andOr: 'AND',
                            whereColumn: columnAndType[0],
                            whereColumnType: columnAndType[1],
                            meta: '=',
                            queryParam: ''
                        })
                    }
                }

                this.selectedWhereBodyColumns = newSelectedWhereBodyColumns;
            },
            changeWhereBodyPanel (object) {
                if(object.length == 0) {
                    this.whereBodyPanelName = '展开'
                }
                else {
                    this.whereBodyPanelName = '收起'
                }
            },
            add (tableIndex) {
                var table = this.model.joinTables[tableIndex]
                table.onConditions.push({onColumn: '', refTable: '', refColumn: ''})
                // 触发更新视图
                this.model.joinTables.$set(tableIndex, table)
            },
            remove (tableIndex, condition) {
                var table = this.model.joinTables[tableIndex]
                table.onConditions.$remove(condition)
                // 触发更新视图
                this.model.joinTables.$set(tableIndex, table)
            }
        }
    }
</script>