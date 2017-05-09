<template>
    <div>
        <step-state-component :current-state="currentState"></step-state-component>

        <br>
        <Form ref="formValidate" :model="model" :rules="ruleValidate" :label-width="300">

            <Form-item label="模板名称" prop="name">
                <Input v-model="model.name" placeholder="请输入" style="width: 300px"></Input>
            </Form-item>

            <Form-item label="模板描述">
                <Input v-model="model.description" placeholder="请输入" style="width: 300px"></Input>
            </Form-item>

            <Form-item label="数据表">
                {{ model.primaryTable.name }} &nbsp; {{ model.primaryTable.alias }}
            </Form-item>

            <Form-item label="关联表" v-show="model.joinTables.length > 0" v-for="(table, pIndex) in model.joinTables" :key="table.pIndex">
                <Form-item style="float: left">
                    {{ table.type }} &nbsp; {{ table.name }} &nbsp; {{ table.alias }} &nbsp; ON
                </Form-item>

                <br>
                <Form-item v-for="(onCondition, index) in model.joinTables[pIndex].onConditions" :key="onCondition.index">
                    <Form-item :prop="'joinTables.' + pIndex + '.onConditions.' + index + '.onColumn'"
                               :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left;">
                        <Select v-model="onCondition.onColumn" filterable style="width: 150px">
                            <Option v-for="(item, index) in table.columns" :key="item.index" :value="table.alias + '.' + item.name">{{ item.name }}</Option>
                        </Select>
                        &nbsp; =
                    </Form-item>

                    <Form-item :prop="'joinTables.' + pIndex + '.onConditions.' + index + '.refTable'"
                               :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left;margin-left: 10px">
                        <Select v-model="onCondition.refTable" style="width: 150px" @on-change="loadRefColumns(pIndex, index)">
                            <Option v-for="(t, index) in tables" :key="t.index" :value="t.alias">{{ t.alias }}</Option>
                        </Select>
                    </Form-item>

                    <Form-item :prop="'joinTables.' + pIndex + '.onConditions.' + index + '.refColumn'"
                               :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left;margin-left: 10px">
                        <Select v-model="onCondition.refColumn" style="width: 150px">
                            <Option v-for="(c, index) in model.joinTables[pIndex].onConditions[index].refColumns" :key="c.index" :value="c.name">{{ c.name }}</Option>
                        </Select>
                    </Form-item>
                    &nbsp;&nbsp;
                    <Button v-show="index > 0" type="ghost" size="small" @click="remove(pIndex, onCondition)">删除级联条件</Button>&nbsp;
                    <Button v-show="index == 0" type="ghost" size="small" @click="add(pIndex)">添加级联条件</Button>&nbsp;
                    <br>
                    <br>
                </Form-item>

            </Form-item>

            <Form-item label="显示字段">
                <Collapse v-model="selectBodyPanelActiveKey" style="width: 630px" @on-change="changeSelectBodyPanel">
                    <Panel name="1">
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
                <Form-item v-for="(item, index) in model.selectColumns" :key="item.index">
                    <Form-item style="float: left">
                        {{ item.name }}&nbsp;&nbsp;
                    </Form-item>

                    <Form-item :prop="'selectColumns.' + index + '.alias'"
                               :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left">
                        <Input v-model="item.alias" style="width: 120px"></Input>
                     </Form-item>
                    <br>
                    <br>
                </Form-item>
            </Form-item>

            <Form-item label="查询条件">
                <Collapse v-model="whereBodyPanelActiveKey" style="width: 630px" @on-change="changeWhereBodyPanel">
                    <Panel name="1">
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
                <Form-item v-for="(whereCondition, index) in model.whereConditions" :key="whereCondition.index">
                    <Form-item style="float: left">
                        <Select v-model="whereCondition.andOr" style="width: 90px">
                            <Option value="AND">AND</Option>
                            <Option value="OR">OR</Option>
                        </Select>

                        &nbsp; {{ whereCondition.whereColumn }} &nbsp;

                        <Select v-model="whereCondition.meta" style="width: 90px">
                            <Option value="=">=</Option>
                            <Option value="!=">!=</Option>
                            <Option value="<="><=</Option>
                            <Option value="<"><</Option>
                            <Option value=">=">>=</Option>
                            <Option value=">">></Option>
                            <Option value="like">LIKE</Option>
                            <Option value="in">IN</Option>
                            <Option value="not in">NOT IN</Option>
                        </Select>
                    </Form-item>

                    <Form-item :prop="'whereConditions.' + index + '.queryParam'"
                               :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="float: left;;margin-left: 10px">
                        <Input v-model="whereCondition.queryParam" style="width: 120px;"></Input>
                    </Form-item>
                    <br>
                    <br>
                </Form-item>
            </Form-item>

            <br>
            <Row type="flex" justify="center" align="middle">
                <Col span="20" offset="2">
                    <Button type="primary" @click="previous">上一步</Button>
                    &nbsp;&nbsp;
                    <Button type="primary" @click="preview('formValidate')">预览</Button>
                    &nbsp;&nbsp;
                    <Button type="primary" @click="complete('formValidate')">完成</Button>
                </Col>
            </Row>

        </Form>

        <step-preview-component ref="steppreviewchild"></step-preview-component>
    </div>
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
                selectBodyPanelActiveKey: '1',
                selectBodyPanelName: "收起",
                readyWhereBodyColumns: [],
                selectedWhereBodyColumns: [],
                whereBodyPanelActiveKey: '1',
                whereBodyPanelName: "收起",
                ruleValidate: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted () {
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
                this.$router.push(MODULE.ROUTER.STEP_CONFIG_TABLE)
            },
            complete (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        
                        this.transformSaveModel()

                        this.$http.post(MODULE.URL.ADD, "queryStatement=" + encodeURIComponent(JSON.stringify(this.saveModel)))
                            .then((response) => {
                                STORE.clear()
                                this.$router.push(MODULE.ROUTER.LIST)
                                this.$Message.success('添加成功!')
                            })
                            .catch((error) => {
                                console.log(error)
                                this.$Message.error('添加失败!')
                            })
                    }
                })
            },
            preview (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.transformSaveModel()
                        this.$refs.steppreviewchild.show(true, this.saveModel)
                    }
                })
            },
            loadPanel () {
                if(this.model.selectColumns.length == 0) {
                    this.selectBodyPanelActiveKey = '1'
                    this.selectBodyPanelName = '收起'
                }
                else {
                    this.selectBodyPanelActiveKey = ''
                    this.selectBodyPanelName = '展开'
                }

                if(this.model.whereConditions.length == 0) {
                    this.whereBodyPanelActiveKey = '1'
                    this.whereBodyPanelName = '收起'
                }
                else {
                    this.whereBodyPanelActiveKey = ''
                    this.whereBodyPanelName = '展开'
                }
            },
            loadSelectedSelectBodyColumns () {
                var selectColumns = this.model.selectColumns
                if(selectColumns.length > 0) {
                    for(var i in selectColumns) {
                        this.selectedSelectBodyColumns.push(selectColumns[i].name)
                    }
                }
            },
            loadSelectedWhereBodyColumns () {
                var whereConditions = this.model.whereConditions
                if(whereConditions.length > 0) {
                    for(var i in whereConditions) {
                        var whereCondition = whereConditions[i]
                        var columnAndType = whereCondition.whereColumn + "#" + whereCondition.whereColumnType
                        this.selectedWhereBodyColumns.push(columnAndType)
                    }
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
                        this.$set(this.model.joinTables, tableIndex, table)
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
                    //this.model.selectColumns.remove(delColumns[i])
                    this.arrayRemove(this.model.selectColumns, delColumns[i])
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
                    //this.model.whereConditions.remove(delColumns[i])
                    this.arrayRemove(this.model.whereConditions, delColumns[i])
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
                this.$set(this.model.joinTables, tableIndex, table)
            },
            remove (tableIndex, condition) {
                var table = this.model.joinTables[tableIndex]

                //table.onConditions.remove(condition)
                this.arrayRemove(table.onConditions, condition)

                // 触发更新视图
                this.$set(this.model.joinTables, tableIndex, table)
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