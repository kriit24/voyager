<template>
    <div class="flex justify-center items-center">
        <div class="relative w-full">
            <div>
                <input type="range"
                    :step="step"
                    :min="min" :max="max"
                    v-model.number="lowerValue"
                    ref="lower"
                    class="absolute pointer-events-none z-20 h-2 w-full cursor-pointer"
                >

                <input type="range" 
                    :step="step"
                    :min="min" :max="max"
                    v-model.number="upperValue"
                    ref="upper"
                    class="absolute pointer-events-none z-20 h-2 w-full cursor-pointer"
                    v-if="range"
                >

                <div class="slider relative z-10 h-2">
                    <div class="track absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md"></div>
                    <div class="distance absolute z-20 top-0 bottom-0 rounded-md" :class="`bg-${color}-500`" :style="`right:${upperPos}%; left:${lowerPos}%`" v-if="range"></div>
                    <div class="distance absolute z-20 top-0 bottom-0 rounded-md" :class="`bg-${color}-500`" :style="`left:0%; width: ${lowerPos}%`" v-else></div>
                    <div class="thumb -ml-1 absolute z-30 w-6 h-6 top-0 right-0 rounded-full -mt-2" :class="`bg-${color}-500`" :style="`left: ${lowerPos}%`"></div>
                    <div class="thumb -mr-3 absolute z-30 w-6 h-6 top-0 right-0 rounded-full -mt-2" :class="`bg-${color}-500`" :style="`right: ${upperPos}%`" v-if="range"></div>
                </div>
            </div>

            <div class="flex justify-between items-center mt-5" v-if="inputs">
                <input type="number" :min="min" :max="max" v-model.number="lowerValue" class="input small">
                <input type="number" :min="min" :max="max" v-model.number="upperValue" class="input small" v-if="range">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['update:lower', 'update:upper'],
    props: {
        range: {
            type: Boolean,
            default: true,
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
        step: {
            type: Number,
            default: 1,
        },
        lower: {
            type: Number,
            default: 0,
            required: true,
        },
        upper: {
            type: Number,
            default: 100,
        },
        distance: {
            type: Number,
            default: 0,
        },
        inputs: {
            type: Boolean,
            default: true,
        },
        color: {
            type: String,
            default: 'accent',
        }
    },
    computed: {
        lowerPos() {
            return ((this.lower - this.min) / (this.max - this.min)) * 99;
        },
        upperPos() {
            if (!this.range) {
                return 0;
            }

            return 99.5 - (((this.upper - this.min) / (this.max - this.min)) * 99);
        },
        lowerValue: {
            get() {
                return this.lower;
            },
            set(value) {
                if (value > (this.upper - this.distance)) {
                    value = this.upper - this.distance;
                }
                this.$refs.lower.value = value;
                this.$emit('update:lower', value);
            }
        },
        upperValue: {
            get() {
                return this.upper;
            },
            set(value) {
                if (value < (this.lower + this.distance)) {
                    value = this.lower + this.distance;
                }
                this.$refs.upper.value = value;
                this.$emit('update:upper', value);
            }
        },
    }
};
</script>

<style lang="scss">
@import "@sassmixins/bg-color";

input[type=range] {
    @apply appearance-none opacity-0;

    &::-webkit-slider-thumb {
        @apply h-6 w-6 appearance-none opacity-0;
        pointer-events: all;
    }

    &::-moz-range-thumb {
        @apply h-6 w-6 appearance-none opacity-0;
        pointer-events: all;
    }

    &::-ms-thumb {
        @apply h-6 w-6 appearance-none opacity-0;
        pointer-events: all;
    }
}

.dark .slider .track {
    @include bg-color(slider-track-color-dark, 'colors.gray.600');
}

.slider .track {
    @include bg-color(slider-track-color, 'colors.gray.200');
}
</style> 