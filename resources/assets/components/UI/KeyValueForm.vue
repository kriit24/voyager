<template>
    <div class="voyager-table">
        <table>
            <thead>
                <tr>
                    <th>{{ keyText || __('voyager::generic.key') }}</th>
                    <th>{{ valueText || __('voyager::generic.value') }}</th>
                    <th>
                        <button class="button green small" @click.stop="addOption">
                            <Icon icon="plus" />
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(option, i) in (modelValue || [])" :key="'option-'+i">
                    <td>
                        <input type="text" class="input w-full" v-model="option.key" :placeholder="keyText || __('voyager::generic.key')">
                    </td>
                    <td>
                        <LanguageInput
                            class="input w-full"
                            type="text"
                            :placeholder="valueText || __('voyager::generic.value')"
                            v-model="option.value" />
                    </td>
                    <td>
                        <button class="button red small" @click.stop="removeOption(i)">
                            <Icon icon="trash" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: Array,
            default: () => {
                return [];
            },
        },
        keyText: {
            type: [String, null],
            default: null
        },
        valueText: {
            type: [String, null],
            default: null
        }
    },
    methods: {
        addOption() {
            var option = {
                key: '',
                value: '',
            };

            var options = this.modelValue;
            if (!this.isArray(options)) {
                options = [];
            }
            options = [...options, option];
            this.$emit('update:modelValue', options);
            
        },
        removeOption(key) {
            this.$emit('update:modelValue', this.modelValue.removeAtIndex(key));
        }
    }
}
</script>