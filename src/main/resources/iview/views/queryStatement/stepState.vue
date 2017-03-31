<template>
    <br />
    <Row type="flex" justify="space-around" align="middle">
        <i-col span="2"></i-col>
        <i-col span="20">
            <Steps :current="currentState">
                <Step title="数据源" content="请选择一个数据库连接">></Step>
                <Step title="数据表" content="可选择多张数据表，并配置表别名"></Step>
                <Step title="模板" content="创建SQL模板"></Step>
                <Step title="完成"></Step>
            </Steps>
        </i-col>
        <i-col span="2"></i-col>
    </Row>
</template>
<script>
    export default {
        props: ['currentState']
    }
</script>