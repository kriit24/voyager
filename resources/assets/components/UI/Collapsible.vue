<template>
    <Card :title="title" :title-size="titleSize">
        <template #actions>
            <div class="inline-flex items-center space-x-6">
                <div>
                    <slot name="actions"></slot>
                </div>
                <Icon icon="chevron-up" :size="6" class="cursor-pointer" :class="isOpen ? 'rotate-0' : 'rotate-180'" @click.prevent.stop="toggle" />
            </div>
        </template>
        <CollapseTransition>
            <div v-show="isOpen">
                <slot></slot>
            </div>
        </CollapseTransition>
    </Card>
</template>
<script>
import closable from '@mixins/closable';

export default {
    mixins: [closable],
    props: {
        title: {
            type: String,
            default: '',
        },
        titleSize: {
            type: Number,
            default: 4,
        },
        closed: {
            type:Boolean,
            default: false,
        }
    },
    created() {
        this.$watch(() => this.closed, (closed) => {
            this.isOpen = !closed;
        },{ immediate: true });
    }
};
</script>