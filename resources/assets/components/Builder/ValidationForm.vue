<template>
    <div class="mt-5">
        <div class="w-full flex">
            <div class="flex-grow">
                <h5>{{ __('voyager::generic.validation') }}</h5>
            </div>
            <div class="flex-none">
                <button class="button small" @click.stop="addRule">
                    <Icon icon="plus" class="text-green-500" />
                </button>
            </div>
        </div>
        <div class="voyager-table">
            <table>
                <thead>
                    <tr>
                        <th>{{ __('voyager::generic.rule') }}</th>
                        <th>{{ __('voyager::generic.message') }}</th>
                        <th>{{ __('voyager::generic.actions') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(rule, key) in modelValue" :key="'rule-'+key">
                        <td>
                            <input type="text" class="input w-full" v-model="rule.rule" :placeholder="__('voyager::generic.rule')">
                        </td>
                        <td>
                            <LanguageInput
                                class="input w-full"
                                type="text" :placeholder="__('voyager::generic.message')"
                                v-model="rule.message" />
                        </td>
                        <td>
                            <button class="button small" @click.stop="removeRule(key)">
                                <Icon icon="trash" class="text-red-500" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {
        addRule() {
            this.$emit('update:modelValue', this.modelValue.insert({
                rule: '',
                message: '',
            }));
        },
        removeRule(key) {
            this.$emit('update:modelValue', this.modelValue.removeAtIndex(key));
        }
    },
};
</script>