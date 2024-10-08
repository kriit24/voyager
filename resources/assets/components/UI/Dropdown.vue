<template>
    <div class="dropdown text-left w-auto" v-click-outside="close" @keydown.esc="close">
        <div @click="tryOpen" ref="opener">
            <slot name="opener"></slot>
        </div>
        <FadeTransition @after-leave="destroyPopper">
            <div class="wrapper rounded-md shadow-lg border z-50" v-if="isOpen" @click="closeDropdown" ref="dropdown">
                <div class="body overflow-auto">
                    <slot></slot>
                </div>
            </div>
        </FadeTransition>
    </div>
</template>
<script>
import { nextTick } from 'vue';
import closable from '@mixins/closable';
import clickOutside from '@directives/click-outside';

import { createPopper, placements } from '@popperjs/core';

export default {
    mixins: [closable],
    directives: {clickOutside: clickOutside},
    props: {
        placement: {
            type: String,
            default: 'bottom-start',
            validator: (value) => {
                return placements.includes(value);
            }
        },
        prevent: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            popper: null,
        };
    },
    methods: {
        destroyPopper() {
            if (this.popper) {
                this.popper.destroy();
                this.popper = null;
            }
        },
        tryOpen() {
            let disabled = this.$refs.opener.children[0].getAttribute('disabled');
            if (disabled === null || disabled === false) {
                this.open();
            }
        },
        closeDropdown() {
            if (!this.prevent) {
                this.close();
            }
        }
    },
    watch: {
        isOpen(open) {
            if (open) {
                nextTick(() => {
                    this.popper = createPopper(
                        this.$refs.opener,
                        this.$refs.dropdown,
                        {
                            placement: this.placement,
                            modifiers: [
                                {
                                    name: 'flip',
                                    options: {
                                        flipVariations: true,
                                    },
                                },
                            ],
                        }
                    );
                });
            }
        }
    },
};
</script>

<style lang="scss">
@import "@sassmixins/bg-color";
@import "@sassmixins/border-color";
@import "@sassmixins/text-color";

.dark .dropdown {
    .wrapper {
        @include bg-color(dropdown-bg-color-dark, 'colors.gray.900');
        @include border-color(dropdown-border-color-dark, 'colors.gray.700');

        .body {
            .link {
                @include border-color(dropdown-border-color-dark, 'colors.gray.700');
                @include text-color(dropdown-link-color-dark, 'colors.blue.600');

                &.active {
                    @include bg-color(dropdown-bg-color-dark, 'colors.gray.800');
                }

                &:hover {
                    @include bg-color(dropdown-link-hover-color-dark, 'colors.gray.700');
                }
            }

            .divider {
                @include border-color(dropdown-divider-border-color-dark, 'colors.gray.700');
            }
        }
    }
}

.dropdown {
    .wrapper {
        @include bg-color(dropdown-bg-color, 'colors.white');
        @include border-color(dropdown-border-color, 'colors.gray.400');

        .body {
            .link {
                @include border-color(dropdown-border-color, 'colors.gray.400');
                @include text-color(dropdown-link-color, 'colors.blue.600');
                @apply block px-6 py-3 leading-tight cursor-pointer truncate;

                &.active {
                    @include bg-color(dropdown-bg-color-dark, 'colors.gray.200');
                }

                &:hover {
                    @include bg-color(dropdown-link-hover-color, 'colors.gray.250');
                }
            }

            .divider {
                @apply border-t;
                @include border-color(dropdown-divider-border-color, 'colors.gray.300');
            }
        }
    }
}
</style>