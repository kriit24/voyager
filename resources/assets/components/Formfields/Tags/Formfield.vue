<template>
    <slot v-if="action == 'query'"></slot>
    <div v-else-if="action == 'browse'" class="flex flex-wrap space-x-1">
        <Badge v-for="(tag, i) in modelValue.slice(0, options.display_amount > 0 ? options.display_amount : modelValue.length)" :key="'tag-'+i" :color="options.color">
            {{ tag }}
        </Badge>
        <template v-if="options.display_amount > 0 && modelValue.length > options.display_amount">
            + {{ modelValue.length - options.display_amount }}
        </template>
    </div>
    <template v-else-if="action == 'edit' || action == 'add'">
        <TagInput
            v-model="value"
            :min="options.min"
            :max="options.max"
            :reorder="options.reorder"
            :duplicates="options.duplicates"
            :empty="options.empty"
            :badgeColor="options.color"
            :class="options.classes"
        />
    </template>
    <div v-else>
        {{ modelValue }}
    </div>
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
    },
}
</script>