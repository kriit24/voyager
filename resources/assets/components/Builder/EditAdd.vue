<template>
    <div>
        <Collapsible ref="bread_settings" :title="__('voyager::generic.'+(isNew ? 'add' : 'edit')+'_type', { type: __('voyager::generic.bread')})" icon="bread" :icon-size="8">
            <template #actions>
                <div class="flex flex-wrap items-center space-x-1">
                    <button class="button" @click.stop="toggleFocusMode">
                        <Icon icon="arrows-pointing-in" :size="4" />
                        <span>{{ __('voyager::generic.focus') }}</span>
                    </button>
                    <button class="button" @click="loadProperties" :disabled="!bread.model">
                        <Icon icon="arrow-path" :size="4" :class="loadingProps ? 'animate-spin-reverse' : ''" />
                        <span>{{ __('voyager::builder.reload_properties') }}</span>
                    </button>
                    <button class="button" @click="createModel" :disabled="creatingModel">
                        <Icon icon="plus" :size="4" :class="creatingModel ? 'animate-spin-reverse' : ''" />
                        <span>{{ __('voyager::builder.create_model') }}</span>
                    </button>
                    <LocalePicker />
                </div>
            </template>
            <div>
                <Alert color="yellow" v-if="!propsLoaded && !loadingProps" class="mb-2">
                    <template #title>
                        <span>{{ __('voyager::generic.heads_up') }}</span>
                    </template>
                    {{ __('voyager::builder.new_breads_prop_warning') }}
                </Alert>
                <Alert color="red" v-if="Object.keys(errors).length > 0" class="mb-2">
                    <ul v-for="prop in errors">
                        <li v-for="error in prop">{{ error }}</li>
                    </ul>
                </Alert>
                <div class="w-full flex-none lg:flex space-x-0 lg:space-x-4 mb-2">
                    <div class="w-full">
                        <label class="label" for="slug">{{ __('voyager::generic.slug') }}</label>
                        <LanguageInput
                            class="input w-full"
                            :class="{ error: errors.slug }"
                            id="slug"
                            type="text" :placeholder="__('voyager::generic.slug')"
                            v-model="bread.slug" />
                    </div>
                    <div class="w-full">
                        <label class="label" for="name-singular">{{ __('voyager::builder.name_singular') }}</label>
                        <LanguageInput
                            class="input w-full"
                            :class="{ error: errors.name_singular }"
                            id="name-singular"
                            type="text" :placeholder="__('voyager::builder.name_singular')"
                            v-model="bread.name_singular" />
                    </div>
                    <div class="w-full">
                        <label class="label" for="name-plural">{{ __('voyager::builder.name_plural') }}</label>
                        <LanguageInput
                            class="input w-full"
                            :class="{ error: errors.name_plural }"
                            id="name-plural"
                            type="text" :placeholder="__('voyager::builder.name_plural')"
                            :model-value="bread.name_plural"
                            @update:model-value="bread.name_plural = $event; setSlug($event)" />
                    </div>

                    <div>
                        <label class="label" for="icon">{{ __('voyager::generic.icon') }}</label>
                        <Modal ref="icon_modal" :title="__('voyager::generic.select_icon')">
                            <IconPicker @select="bread.icon = $event; $refs.icon_modal.close()" />
                            <template #opener>
                                <div class="w-full">
                                    <button class="button">
                                        <Icon class="my-1 content-center" :icon="bread.icon" :key="bread.icon" />
                                    </button>
                                </div>
                            </template>
                        </Modal>
                    </div>
                    <div>
                        <label class="label inline-flex" for="badge_color">
                            <span class="mx-2">{{ __('voyager::builder.badge_color') }}</span>
                            <Icon icon="question-mark-circle" v-tooltip="__('voyager::builder.badge_color_hint')" />
                        </label>
                        <select class="input w-full" v-model="bread.badge_color">
                            <option :value="null">{{ __('voyager::generic.none') }}</option>
                            <option v-for="color in colors" :key="color" :value="color">
                                {{ __('voyager::generic.color_names.'+color) }}
                            </option>
                        </select>
                    </div>
                </div>
                
                <div class="w-full flex-none lg:flex space-x-0 lg:space-x-4 mb-2">
                    <div class="w-full">
                        <label class="label" for="model">{{ __('voyager::builder.model') }}</label>
                        <input
                            class="input w-full"
                            :class="{ error: errors.model }"
                            id="model"
                            type="text" :placeholder="__('voyager::builder.model')"
                            v-model="bread.model">
                    </div>
                    <div class="w-full">
                        <label class="label" for="controller">{{ __('voyager::builder.controller') }}</label>
                        <input
                            class="input w-full"
                            :class="{ error: errors.controller }"
                            id="controller"
                            type="text" :placeholder="__('voyager::builder.controller')"
                            v-model="bread.controller">
                    </div>
                    <div class="w-full">
                        <label class="label" for="policy">{{ __('voyager::builder.policy') }}</label>
                        <input
                            class="input w-full"
                            :class="{ error: errors.policy }"
                            id="policy"
                            type="text" :placeholder="__('voyager::builder.policy')"
                            v-model="bread.policy">
                    </div>
                    <div class="w-full">
                        <label class="label inline-flex" for="global_search">
                            <span class="mx-2">{{ __('voyager::builder.global_search_display_field') }}</span>
                            <Icon icon="question-mark-circle" v-tooltip="__('voyager::builder.global_search_display_field_hint')" />
                        </label>
                        <select class="input w-full" v-model="bread.global_search_field">
                            <option :value="null">{{ __('voyager::generic.none') }}</option>
                            <option v-for="column in columns" :key="column">{{ column }}</option>
                        </select>
                    </div>
                    <div class="w-full">
                        <label class="label inline-flex" for="order_field">
                            <span class="mx-2">{{ __('voyager::builder.order_field') }}</span>
                            <Icon icon="question-mark-circle" v-tooltip="__('voyager::builder.order_field_hint')" />
                        </label>
                        <select class="input w-full" v-model="bread.order_field">
                            <option :value="null">{{ __('voyager::generic.none') }}</option>
                            <option v-for="column in columns" :key="column">{{ column }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="inline-flex space-x-1">
                <button class="button blue space-x-0" @click="save" :disabled="savingBread || backingUp">
                    <Icon icon="arrow-path" class="animate-spin-reverse" :size="savingBread ? 4 : 0" :transition-size="4" />
                    <span>{{ __('voyager::generic.save') }}</span>
                </button>

                <button class="button space-x-0" @click="backupBread" :disabled="savingBread || backingUp">
                    <Icon icon="arrow-path" class="animate-spin-reverse" :size="backingUp ? 4 : 0" :transition-size="4" />
                    <span>{{ __('voyager::generic.backup') }}</span>
                </button>
            </div>
        </Collapsible>

        <Card no-header>
            <!-- Toolbar -->
            <div class="w-full mb-5 flex space-x-1">
                <select class="input small self-center" v-model="currentLayoutName" :disabled="bread.layouts.length == 0">
                    <option :value="null" v-if="bread.layouts.length == 0">
                        {{ __('voyager::builder.create_layout_first') }}
                    </option>
                    <optgroup label="Views" v-if="views.length > 0">
                        <option v-for="view in views" :key="'view-' + view.name">{{ view.name }}</option>
                    </optgroup>
                    <optgroup label="Lists" v-if="lists.length > 0">
                        <option v-for="list in lists" :key="'list-' + list.name">{{ list.name }}</option>
                    </optgroup>
                </select>
                <Dropdown class="self-center" placement="auto">
                    <div>
                        <div class="grid grid-cols-2">
                            <a v-for="formfield in filteredFormfields"
                                :key="'formfield-'+formfield.type"
                                href="#"
                                @click.prevent="addFormfield(formfield)"
                                class="link rounded">
                                {{ formfield.name }}
                            </a>
                        </div>
                        <div class="divider"></div>
                        <Link
                            :href="route('voyager.plugins.index')+'/?type=formfield'"
                            target="_blank"
                            class="w-full italic link text-center">
                            {{ __('voyager::builder.formfields_more') }}
                        </Link>
                    </div>
                    <template #opener>
                        <button class="button small"
                                :disabled="bread.layouts.length == 0">
                            <Icon icon="plus" />
                            <span>
                                {{ __('voyager::builder.add_formfield') }}
                            </span>
                        </button>
                    </template>
                </Dropdown>
                <Dropdown class="self-center" placement="bottom">
                    <div>
                        <a href="#" @click.prevent="addLayout(false)" class="link">
                            {{ __('voyager::builder.list') }}
                        </a>
                        <a href="#" @click.prevent="addLayout(true)" class="link">
                            {{ __('voyager::builder.view') }}
                        </a>
                    </div>
                    <template #opener>
                        <button class="button small">
                            <Icon icon="plus" />
                            <span>
                                {{ __('voyager::builder.add_layout') }}
                            </span>
                        </button>
                    </template>
                </Dropdown>
                <Dropdown class="self-center" placement="bottom">
                    <div>
                        <a href="#" @click.prevent="renameLayout" class="link">
                            {{ __('voyager::builder.rename_layout') }}
                        </a>
                        <a href="#" @click.prevent="deleteLayout" class="link">
                            {{ __('voyager::builder.delete_layout') }}
                        </a>
                        <a href="#" @click.prevent="cloneLayout" class="link">
                            {{ __('voyager::builder.clone_layout') }}
                        </a>
                    </div>
                    <template #opener>
                        <button class="button small">
                            <Icon icon="fire" />
                            <span>
                                {{ __('voyager::generic.actions') }}
                            </span>
                        </button>
                    </template>
                </Dropdown>
                <SlideIn v-if="currentLayout" :title="__('voyager::generic.options')">
                    <template #actions>
                        <LocalePicker />
                    </template>
                    <div>
                        <div v-if="currentLayout.type == 'list'" class="input-group mt-2">
                            <label class="label">{{ __('voyager::builder.show_soft_deleted') }}</label>
                            <input type="checkbox" class="input" v-model="currentLayout.options.soft_deletes">
                        </div>
                        <div class="input-group mt-2">
                            <label class="label" for="scope">{{ __('voyager::builder.scope') }}</label>
                            <select class="input w-full" v-model="currentLayout.options.scope">
                                <option :value="null">{{ __('voyager::generic.none') }}</option>
                                <option v-for="(scope, i) in scopes" :key="i">{{ scope }}</option>
                            </select>
                        </div>
                        <div v-if="currentLayout.type == 'view'" class="input-group mt-2">
                            <label class="label" for="validate_locales">{{ __('voyager::builder.validate_locales') }}</label>
                            <select class="input w-full" v-model="currentLayout.options.validate_locales">
                                <option value="all">{{ __('voyager::builder.validate_all_locales') }}</option>
                                <option value="current">{{ __('voyager::builder.validate_current_locale') }}</option>
                            </select>
                        </div>
                    </div>
                    <template #opener>
                        <button class="button small">
                            <Icon icon="cog" />
                            <span>{{ __('voyager::generic.options') }}</span>
                        </button>
                    </template>
                </SlideIn>
            </div>

            <Card class="text-center text-xl py-4" v-if="!currentLayout" no-header>
                {{ __('voyager::builder.create_select_layout') }}
            </Card>
            <Card class="text-center text-xl py-4" v-else-if="currentLayout && currentLayout.formfields.length == 0" no-header>
                {{ __('voyager::builder.add_formfield_to_layout') }}
            </Card>
            <BreadBuilderList
                v-else-if="currentLayout && currentLayout.type == 'list'"
                :computed="computed"
                :columns="columns"
                :relationships="relationships"
                v-model:formfields="currentFormfields"
                v-model:options="currentLayout.options"
                v-on:delete="deleteFormfield($event)"
            />

            <template v-else-if="currentLayout && currentLayout.type == 'view'">
                <BreadBuilderView
                    :computed="computed"
                    :columns="columns"
                    :relationships="relationships"
                    :sizes="sizes"
                    v-model:formfields="currentFormfields"
                    v-model:options="currentLayout.options"
                    v-on:delete="deleteFormfield($event)"
                    v-on:smaller="smaller($event)"
                    v-on:bigger="bigger($event)"
                />
            </template>
        </Card>

        <Collapsible ref="bread_json" v-if="jsonOutput" :title="__('voyager::generic.json_output')" closed>
            <JsonEditor v-model="bread" />
        </Collapsible>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { Link } from '@inertiajs/inertia-vue3';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import focus from '@directives/focus';
import clickOutside from '@directives/click-outside';
import Store from '@/store';

import BreadBuilderList from '@components/Builder/List';
import BreadBuilderView from '@components/Builder/View';

export default {
    directives: {focus: focus, clickOutside: clickOutside},
    props: ['data', 'isNew'],
    components: {
        BreadBuilderList,
        BreadBuilderView,
        Link
    },
    data() {
        return {
            bread: this.data,
            computed: [],
            columns: [],
            scopes: [],
            relationships: [],
            softdeletes: false,
            loadingProps: false,
            savingBread: false,
            backingUp: false,
            creatingModel: false,
            currentLayoutName: null,
            focusMode: false,
            propsLoaded: false,
            errors: {},
            sizes: [
                'w-1/6',
                'w-2/6',
                'w-3/6',
                'w-4/6',
                'w-5/6',
                'w-full',
            ],
        };
    },
    methods: {
        save(e = null) {
            if (typeof e === 'object' && e instanceof KeyboardEvent) {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                } else {
                    return;
                }
            }

            if (this.validateLayouts()) {
                new this.$notification(this.nl2br(this.__('voyager::builder.layout_field_warning')))
                        .confirm()
                        .color('red')
                        .timeout()
                        .show()
                        .then((response) => {
                    if (response) {
                        this.storeBread();
                    }
                });
            } else {
                this.storeBread();
            }
        },
        storeBread() {
            this.savingBread = true;
            this.errors = {};

            axios.put(this.route('voyager.bread.update', this.bread.table), {
                bread: this.bread
            })
            .then(() => {
                new this.$notification(this.__('voyager::builder.bread_saved_successfully')).color('green').timeout().show();
            })
            .catch((response) => {
                if (response.response.status === 422) {
                    this.errors = response.response.data;
                }
            })
            .then(() => {
                this.savingBread = false;
            });
        },
        backupBread() {
            this.backingUp = true;

            axios.post(this.route('voyager.bread.backup-bread'), {
                table: this.bread.table
            })
            .then((response) => {
                new this.$notification(this.__('voyager::builder.bread_backed_up', { name: response.data })).timeout().show();
            })
            .catch((response) => {})
            .then(() => {
                this.backingUp = false;
            });
        },
        loadProperties() {
            if (this.loadingProps) {
                return;
            }

            this.loadingProps = true;

            axios.post(this.route('voyager.bread.get-properties'), {
                model: this.bread.model,
                table: this.bread.table,
                resolve_relationships: true,
            })
            .then((response) => {
                Object.keys(response.data).map((key) => {
                    this[key] = response.data[key];
                });
                this.propsLoaded = true;
            })
            .catch((response) => {
                if (response.response.status === 422) {
                    this.errors = response.response.data;
                }
            })
            .then(() => {
                this.loadingProps = false;
            });
        },
        createModel() {
            if (this.creatingModel) {
                return;
            }

            this.creatingModel = true;

            axios.post(this.route('voyager.bread.create-model'), {
                table: this.bread.table,
            })
            .then((response) => {
                if (response.data.exists) {
                    new this.$notification(this.__('voyager::builder.model_already_exists', { model: response.data.class })).color('yellow').timeout().show();
                } else {
                    new this.$notification(this.__('voyager::builder.model_created', { model: response.data.class })).color('green').timeout().show();
                }

                this.bread.model = response.data.class;
                this.loadProperties();
            })
            .catch((response) => {})
            .then(() => {
                this.creatingModel = false;
            });
        },
        addLayout(view) {
            new this
            .$notification(this.__('voyager::builder.enter_name'))
            .prompt()
            .timeout()
            .show()
            .then((value) => {
                if (value && value !== '') {
                    var filtered = this.bread.layouts.where('name', value);

                    if (filtered.length > 0) {
                        new this.$notification(this.__('voyager::builder.name_already_exists')).color('red').timeout().show();

                        return;
                    }

                    var view_options = {
                        scope: null,
                        validate_locales: 'current',
                    };
                    var list_options = {
                        default_order_column: {
                            column: null,
                            type: null,
                        },
                        soft_deletes: true,
                        scope: null,
                        filters: [],
                    };

                    this.bread.layouts.push({
                        name: value,
                        type: (view ? 'view' : 'list'),
                        options: (view ? view_options : list_options),
                        formfields: [],
                        tabs: [],
                    });

                    this.currentLayoutName = value;
                }
            });
        },
        renameLayout() {
            new this
            .$notification(this.__('voyager::builder.enter_new_name'))
            .timeout()
            .prompt(this.currentLayoutName)
            .show()
            .then((value) => {
                if (value && value !== '') {
                    if (value == this.currentLayoutName) {
                        return;
                    }
                    var filtered = this.bread.layouts.where('name', value);

                    if (filtered.length > 0) {
                        new this.$notification(this.__('voyager::builder.name_already_exists')).color('red').timeout().show();

                        return;
                    }

                    this.currentLayout.name = value;
                    this.currentLayoutName = value;
                }
            });
        },
        deleteLayout() {
            new this
            .$notification(this.__('voyager::builder.delete_layout_confirm'))
            .color('yellow')
            .timeout()
            .confirm()
            .show()
            .then((result) => {
                if (result) {
                    var name = this.currentLayoutName;
                    this.currentLayoutName = null;
                    this.bread.layouts = this.bread.layouts.whereNot('name', name);

                    if (this.bread.layouts.length > 0) {
                        this.currentLayoutName = this.bread.layouts[0].name;
                    }
                }
            });
        },
        cloneLayout() {
            var layout = JSON.parse(JSON.stringify(this.currentLayout));
            layout.name = layout.name + ' 2';
            this.bread.layouts.push(layout);
            this.currentLayoutName = layout.name;
        },
        addFormfield(formfield) {
            var options = {
                width: 'w-3/6',
            };

            var formfield = {
                type: formfield.type,
                column: {
                    column: null,
                    type: null,
                },
                translatable: false,
                options: this.currentLayout.type == 'list' ? {} : options,
                validation: [],
            };

            if (this.currentLayout.type == 'list') {
                formfield.title = null;
            }

            this.currentLayout.formfields.push(formfield);
        },
        deleteFormfield(key) {
            new this
            .$notification(this.__('voyager::builder.delete_formfield_confirm'))
            .color('yellow')
            .timeout()
            .confirm()
            .show()
            .then((result) => {
                if (result) {
                    this.currentLayout.formfields.splice(key, 1);
                }
            });
        },
        setSlug(value) {
            var l = Store.locale;
            this.bread.slug = this.get_translatable_object(this.bread.slug);
            this.bread.slug[l] = this.slugify(value[l], { strict: true, lower: true });
        },
        toggleFocusMode() {
            this.focusMode = !this.focusMode;

            if (this.focusMode) {
                this.$refs.bread_settings.close();
                if (this.jsonOutput) {
                    this.$refs.bread_json.close();
                }
                this.closeSidebar();
            } else {
                this.$refs.bread_settings.open();
                this.openSidebar();
            }
        },
        validateLayouts() {
            var failed = false;

            this.bread.layouts.forEach((layout) => {
                layout.formfields.forEach((formfield) => {
                    if (formfield.column == '' || formfield.column === null || (this.isObject(formfield.column) && (formfield.column.column == '' || formfield.column.column === null))) {
                        failed = true;
                    }
                });
            });

            return failed;
        },
        smaller(uuid) {
            let current = this.sizes.indexOf(this.currentFormfields.where('uuid', uuid).first().options.width);
            let index = this.currentFormfields.indexOf(this.currentFormfields.where('uuid', uuid).first());
            if (current > 0) {
                this.currentLayout.formfields[index].options.width = this.sizes[current-1];
            }
        },
        bigger(uuid) {
            let current = this.sizes.indexOf(this.currentFormfields.where('uuid', uuid).first().options.width);
            let index = this.currentFormfields.indexOf(this.currentFormfields.where('uuid', uuid).first());
            if (current < this.sizes.length - 1) {
                this.currentLayout.formfields[index].options.width = this.sizes[current+1];
            }
        },
    },
    computed: {
        views() {
            return this.bread.layouts.where('type', 'view');
        },
        lists() {
            return this.bread.layouts.where('type', 'list');
        },
        filteredFormfields() {
            return Store.formfields.filter((formfield) => {
                if (this.currentLayout && this.currentLayout.type == 'list') {
                    return formfield.in_lists;
                }
                return formfield.in_views;
            });
        },
        currentLayout() {
            return this.bread.layouts.filter((layout, key) => {
                if (layout.name == this.currentLayoutName) {
                    layout.formfields.map((formfield) => {
                        if (formfield.uuid == '' || formfield.uuid == null) {
                            formfield.uuid = uuidv4();
                        }
                    });
                    if (layout.uuid == '' || layout.uuid == null) {
                        layout.uuid = uuidv4();
                    }
                    this.pushToUrlHistory(this.addParameterToUrl('layout', key));

                    return true;
                }
                return false;
            })[0];
        },
        currentFormfields: {
            get() {
                if (this.currentLayout) {
                    return JSON.parse(JSON.stringify(this.currentLayout.formfields));
                }

                return [];
            },
            set(formfields) {
                if (this.currentLayout) {
                    this.currentLayout.formfields = formfields;
                }
            }
        },
        jsonOutput() {
            return Store.jsonOutput;
        }
    },
    mounted() {
        // Load model-properties (only when we already know the model-name)
        if (this.bread.model) {
            this.loadProperties();
        }

        document.addEventListener('keydown', this.save);
    },
    unmounted() {
        document.removeEventListener('keydown', this.save);
    },
    created() {
        var layout = parseInt(this.getParameterFromUrl('layout', 0));
        if (this.bread.layouts.length >= (layout+1)) {
            this.currentLayoutName = this.bread.layouts[layout].name;
        }
    },
};
</script>