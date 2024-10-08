<template>
    <div @keydown.esc="close" v-click-outside="close">
        <SlideLeftTransition>
            <div v-if="isOpen" class="dark slidein text-white w-full fixed top-0 left-auto right-0 h-full overflow-y-auto p-8 z-50 block" :class="'lg:w-1/3'">
                <div class="flex w-full mb-3">
                    <div class="flex-grow">
                        <h4>{{ title }}</h4>
                    </div>
                    
                    <div class="flex justify-end items-center space-x-2">
                        <slot name="actions" />
                        <button @click="close" class="h-5 w-5">
                            <Icon icon="x-mark" />
                        </button>
                    </div>
                </div>
                <slot />
            </div>
        </SlideLeftTransition>
        <div ref="opener" @click="toggle">
            <slot name="opener"></slot>
        </div>
    </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';

import EventBus from '@/eventbus';
import closable from '@mixins/closable';
import clickOutside from '@directives/click-outside';

export default {
    mixins: [closable],
    directives: {clickOutside: clickOutside},
    props: {
        opened: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
        }
    },
    data() {
        return {
            uuid: uuidv4()
        };
    },
    created() {
        EventBus.on('close-slide-ins', (uuid) => {
            if (uuid !== this.uuid) {
                this.close();
            }
        });
        this.$watch(() => this.opened, (opened) => {
            this.isOpen = opened;
        }, { immediate: true });
        this.$watch(() => this.opened, (open) => {
            if (open) {
                EventBus.emit('close-slide-ins', this.uuid);
            }
        }, { immediate: true });
    },
};
</script>

<style lang="scss" scoped>
.slidein {
    background-color: rgba(0, 0, 0, .85);
    z-index: 100;
}
</style>