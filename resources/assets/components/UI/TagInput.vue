<template>
    <div class="input flex flex-wrap space-x-1" @click="$refs.input.focus()">
        <component :is="false ? 'draggable' : 'span'" v-model="tags" class="flex flex-wrap" item-key="">
            <template v-for="tag in tags" :key="tag">
                <Badge :color="badgeColor" icon="x-mark" @click-icon="removeTag(tag)" class="mt-1 ml-1" :class="[!noReorder ? 'cursor-move' : '']">
                    {{ tag }}
                </Badge>
            </template>
        </component>
        <input v-if="!forbitAdding" type="text" class="bg-transparent border-0 focus:outline-none flex-grow" ref="input" v-on:keyup.enter="addTag" v-on:keyup.delete="removeLastTag($event)">
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
        },
        badgeColor: {
            type: String,
            default: 'accent',
        },
        empty: {
            type: Boolean,
            default: false,
        },
        noReorder: {
            type: Boolean,
            default: false,
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 0,
        },
        duplicates: {
            type: Boolean,
            default: false,
        },
        forbitAdding: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            tags: this.modelValue,
            deleteCounter: 0,
        };
    },
    methods: {
        addTag(e) {
            if (this.max > 0 && this.tags.length >= this.max) {
                return;
            }
            var content = e.target.value;
            if (!this.empty && content == '') {
                return;
            }
            if (!this.duplicates && this.tags.indexOf(content) !== -1) {
                e.target.value = '';

                return;
            }
            this.tags.push(content);
            e.target.value = '';
        },
        removeTag(tag) {
            if (this.tags.length <= this.min) {
                return;
            }
            this.tags.splice(this.tags.indexOf(tag), 1);
        },
        removeLastTag(e) {
            if (e.target.value == '') {
                this.deleteCounter++;
                if (this.deleteCounter >= 2) {
                    this.tags.splice(this.tags.length - 1, 1);
                    this.deleteCounter = 0;
                }
            }
        }
    },
    created() {
        this.$watch(() => this.tags, (tags) => {
            this.$emit('update:modelValue', tags);
        });
        this.$watch(() => this.modelValue, (tags) => {
            this.tags = tags;
        });
    },
};
</script>