<template>
    
</template>
<script>
export default {
    name: 'TextBox',
    data () {
        return {
            'inputVal': this.value
        };
    },
    props: {
        'type': {type: String, require: false, default: 'input'},
        'width': {type: Number, require: false, default: 50},
        'height': {type: Number, require: false, default: 30},
        'label': {type: String, require: false, default: '输入框'},
        'callBack': {type: Function, require: false, default: () => {}}
    },
    watch: {
        value: (newVal) => {
            this.setInputValue(newVal);
        }
    },
    methods: {
        setInputValue: (val) => {
            this.inputVal = val;
        }
    }
}
</script>
<style scoped>

</style>


