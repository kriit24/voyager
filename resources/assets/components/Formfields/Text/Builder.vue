<template>
    <div v-if="action == 'list-options'" class="input-group mt-2">
        <label for="length" class="label">{{ __('voyager::generic.display_length') }}</label>
        <input
            type="number"
            id="length"
            class="input w-full"
            v-model.number="options.display_length"
        > 
    </div>
    <div v-else-if="action == 'view-options'">
        <div class="input-group mt-2">
            <label class="label">{{ __('voyager::generic.placeholder') }}</label>
            <LanguageInput
                class="input w-full"
                type="text" :placeholder="__('voyager::generic.placeholder')"
                v-model="options.placeholder" />
        </div>
        <div class="input-group mt-2">
            <label class="label">{{ __('voyager::generic.default_value') }}</label>
            <LanguageInput
                class="input w-full"
                type="text" :placeholder="__('voyager::generic.default_value')"
                v-model="options.default_value" /> 
        </div>
        <div class="input-group mt-2">
            <label class="label">{{ __('voyager::generic.rows') }}</label>
            <input type="number" :min="1" :max="1000" class="input w-full" v-model.number="options.rows">
        </div>
        <div class="input-group mt-2">
            <label class="label">{{ __('voyager::generic.inputmode') }}</label>
            <select class="input w-full" v-model="options.inputmode" :disabled="options.rows > 1">
                <option v-for="(mode, key) in __('voyager::generic.inputmodes')" :key="key" :value="key">{{ mode }}</option>
            </select>
        </div>
    </div>
    <template v-else-if="action == 'view'">
        <input
            v-if="!options.rows || options.rows == 1"
            type="text"
            class="input w-full"
            :modelValue="translate(options.default_value)"
            :placeholder="translate(options.placeholder)">
        <textarea
            v-else
            class="input w-full"
            :rows="options.rows"
            :modelValue="translate(options.default_value)"
            :placeholder="translate(options.placeholder)"></textarea>
    </template>
</template>

<script>
import formfieldBuilder from '@mixins/formfield-builder';

export default {
    mixins: [formfieldBuilder],
    computed: {
        defaultListOptions() {
            return {
                display_length: 150,
            };
        },
        defaultViewOptions() {
            return {
                placeholder: '',
                default_value: '',
                rows: 1,
                inputmode: 'text'
            };
        },
    }
}
</script>