<template>
    <div>
        <div class="input w-full mb-3 flex space-x-1">
            <input type="text" class="input-transparent flex-grow" :placeholder="__('voyager::generic.search_icons')" v-model="query" />
            <button @click="sizeUp" class="flex-none button">
                <Icon icon="plus" :size="5" />
            </button>
            <button @click="sizeDown" class="flex-none button">
                <Icon icon="minus" :size="5" />
            </button>
        </div>
        <div class="grid grid-cols-6 gap-1">
            <button
                v-for="(icon, i) in filteredIcons.slice(start, end)"
                :key="icon.readable"
                v-tooltip="icon.readable"
                class="button justify-center my-1 w-full"
                :aria-label="`Icon ${icon.readable}`"
                @dblclick="$emit('select', icon.name)">
                <Icon :icon="icon.name" :size="size" />
            </button>
        </div>
        <Pagination class="mt-2" :page-count="pages" @update:model-value="page = $event - 1" :model-value="page + 1" :first-last-buttons="false" :prev-next-buttons="false"></Pagination>
    </div>
</template>
<script>
import icons from '@/icons';

export default {
    emits: ['select'],
    data() {
        return {
            query: '',
            page: 0,
            resultsPerPage: 60,
            size: 6,
        };
    },
    methods: {
        selectIcon(icon) {
            this.$emit('select', icon);
        },
        sizeUp() {
            if (this.size < 12) {
                this.size += 1;
            }
        },
        sizeDown() {
            if (this.size > 4) {
                this.size -= 1;
            }
        }
    },
    computed: {
        start() {
            return this.page * this.resultsPerPage;
        },
        end() {
            return this.start + this.resultsPerPage;
        },
        pages() {
            return Math.ceil(this.filteredIcons.length / this.resultsPerPage);
        },
        filteredIcons() {
            return Object.keys(icons).whereLike(this.query.toLowerCase()).map((icon) => {
                return {
                    name: this.kebabCase(icon),
                    readable: this.titleCase(icon),
                }
            });
        }
    },
    created() {
        this.$watch(() => this.query, () => {
            this.page = 0;
        });
    },
};
</script>