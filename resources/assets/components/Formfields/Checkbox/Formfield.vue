<template>
    <div v-if="action == 'query'">
        <select class="input w-full" v-model="queryValue">
            <option :value="null" v-if="options.options.whereNull('key').length == 0">{{ __('voyager::generic.none') }}</option>
            <option v-for="(option, i) in options.options" :key="i" :value="option.key">
                {{ translate(option.value) }}
            </option>
        </select>
    </div>
    <template v-else-if="action == 'browse'">
        <Badge v-for="(option, i) in (modelValue || [])" :key="i">
            {{ getOptionByKey(option) || option }}
        </Badge>
    </template>
    <template v-else-if="action == 'edit' || action == 'add'" class="w-full" :class="options.inline ? 'space-x-2' : null">
        <template v-for="(option, i) in options.options" :key="i">
            <div class="inline-flex items-center space-x-1.5" :class="options.inline ? null : 'w-full'">
                <input type="checkbox" class="input" :value="option.key" v-model="value" />
                <label class="label">{{ translate(option.value, true) }}</label>
            </div>
        </template>
    </template>
    <template v-else class="flex flex-wrap space-x-1">
        <Badge v-for="(option, i) in modelValue" :key="i">
            {{ getOptionByKey(option) }}
        </Badge>
    </template>
</template>

<script>
import formfield from '@mixins/formfield';

export default {
    mixins: [formfield],
    computed: {
        value: {
            get() {
                if (!this.isArray(this.modelValue)) {
                    this.$emit('update:modelValue', []);
                    return [];
                }

                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        },
        queryValue: {
            get() {
                return this.modelValue || null;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        },
    },
    methods: {
        getOptionByKey(key) {
            var option = (this.options.options || []).where('key', key).first();
            if (option) {
                return this.translate(option.value);
            }

            return '';
        }
    },
}
</script>