<template>
    <Card :title="__('voyager::settings.settings')" icon="cog">
        <Alert v-if="settings.length === 0" color="red" class="mb-2">
            <template #title>{{ __('voyager::settings.no_settings_title') }}</template>
            <p>{{ __('voyager::settings.no_settings') }}</p>
        </Alert>
        <template #actions>
            <div class="flex space-x-1 items-center">
                <input type="text" class="input small" @dblclick="query = ''" @keydown.esc="query = ''" v-model="query" :placeholder="__('voyager::settings.search_settings')">
                <button class="button space-x-0" @click="save" :disabled="savingSettings">
                    <Icon icon="arrow-path" class="animate-spin-reverse text-accent-500" :size="savingSettings ? 4 : 0" :transition-size="4" />
                    <span>{{ __('voyager::generic.save') }}</span>
                </button>
                <Dropdown placement="bottom-end">
                    <div>
                        <div class="grid grid-cols-2">
                            <a v-for="formfield in filteredFormfields"
                                :key="'formfield-'+formfield.type"
                                href="#"
                                @click.prevent="addSetting(formfield)"
                                class="link rounded">
                                {{ formfield.name }}
                            </a>
                        </div>
                        <div class="divider"></div>
                        <a
                            :href="route('voyager.plugins.index')+'/?type=formfield'"
                            target="_blank"
                            class="w-full text-center italic link">
                            {{ __('voyager::builder.formfields_more') }}
                        </a>
                    </div>
                    <template #opener>
                        <button class="button">
                            <Icon icon="plus" :size="4" class="text-green-500" />
                            <span>{{ __('voyager::settings.add_setting') }}</span>
                        </button>
                    </template>
                </Dropdown>
                <button class="button" @click="addGroup">
                    <Icon icon="plus" class="text-green-500" :size="4" />
                    <span>{{ __('voyager::settings.add_group') }}</span>
                </button>
                <LocalePicker />
            </div>
        </template>
        <div class="w-full inline-flex space-x-1 mb-4">
            <Badge
                v-for="group in groups"
                @click="setCurrentGroup(group)"
                :icon="currentGroup == group ? 'x-mark' : null"
                :color="badgeColor(group)"
                :key="group"
            >
                {{ titleCase(group ? group : __('voyager::settings.no_group')) }} ({{ settingsInGroup(group).length }})
            </Badge>
        </div>

        <Alert v-if="errors.hasOwnProperty(currentGroup+'.') || (currentGroup == null && errors.hasOwnProperty('.'))" color="red" class="my-2">
            {{ __('voyager::settings.validation_no_key') }}
        </Alert>

        <Alert color="blue" class="mb-2">
            <span v-if="selectedSetting === null">
                {{ __('voyager::settings.click_setting') }}
            </span>
            <template v-else>
                <p>{{ __('voyager::settings.usage_information') }}</p>
                <code v-if="selectedSetting.group == null" @dblclick.prevent.stop="copyUsage" class="select-none cursor-pointer">
                    \Voyager\Admin\Facades\Voyager::setting('{{ selectedSetting.key }}');
                </code>
                <code v-else @dblclick.prevent.stop="copyUsage" class="select-none cursor-pointer">
                    \Voyager\Admin\Facades\Voyager::setting('{{ selectedSetting.group }}.{{ selectedSetting.key }}');
                </code>
            </template>
        </Alert>

        <Draggable v-model="settings" index="uuid" handle=".dd-handle">
            <template v-slot:item="{ item: setting }">
                <Card
                    :title="translate(setting.name, false) || __('voyager::settings.no_name')"
                    v-show="settingsInGroup(currentGroup).where('uuid', setting.uuid).length > 0"
                    @clickTitle="selectedSetting = setting"
                >
                    <template #actions>
                        <div class="flex flex-wrap space-x-1">
                            <LanguageInput type="text" class="input small" v-model="setting.name" :placeholder="__('voyager::settings.name')" />

                            <input type="text" class="input small" v-model="setting.key" :placeholder="__('voyager::settings.key')" />

                            <select class="input small" v-model="setting.group">
                                <option v-for="group in groups" :value="group" :key="group">
                                    {{ titleCase(group ? group : __('voyager::settings.no_group')) }}
                                </option>
                            </select>

                            <button class="button small" @click="generateKey(setting)" v-tooltip="__('voyager::settings.generate_key')">
                                <Icon icon="finger-print" />
                            </button>

                            <button class="button small" @click="cloneSetting(setting)" v-tooltip="__('voyager::settings.clone')">
                                <Icon icon="document-duplicate" />
                            </button>

                            <SlideIn :title="__('voyager::generic.options')">
                                <template #actions>
                                    <LocalePicker />
                                </template>
                                <div v-if="getFormfieldByType(setting.type).can_be_translated">
                                    <label class="label mt-4">{{ __('voyager::generic.translatable') }}</label>
                                    <input type="checkbox" class="input" v-model="setting.translatable">
                                </div>
                                <component
                                    :is="getFormfieldByType(setting.type).builder_component"
                                    v-model:options="setting.options"
                                    :column="{}"
                                    action="view-options" />
                                <BreadBuilderValidation v-model="setting.validation" />
                                <template #opener>
                                    <button class="button" v-tooltip="__('voyager::generic.options')">
                                        <Icon icon="cog" />
                                    </button>
                                </template>
                            </SlideIn>

                            <button class="button small dd-handle cursor-move" v-tooltip="__('voyager::generic.move')">
                                <Icon icon="arrows-up-down" />
                            </button>

                            <button class="button small" @click="deleteSetting(setting)" v-tooltip="__('voyager::generic.delete')">
                                <Icon icon="trash" class="text-red-500" />
                            </button>
                        </div>
                    </template>

                    <Alert v-if="getErrors(setting).length > 0" color="red" class="my-2">
                        <ul class="list-disc">
                            <li v-for="(error, i) in getErrors(setting)" :key="'error-'+i">
                                {{ error }}
                            </li>
                        </ul>
                    </Alert>

                    <p v-if="setting.info != ''" class="mb-2">{{ setting.info }}</p>

                    <component
                        :is="getFormfieldByType(setting.type).component"
                        :model-value="data(setting, null)"
                        @update:model-value="data(setting, $event)"
                        :options="setting.options"
                        :column="{}"
                        action="edit"
                    />
                </Card>
            </template>
        </Draggable>
        <h3 class="text-center" v-if="!groupHasSettings() && query == ''">{{ __('voyager::settings.no_settings_in_group') }}</h3>
        <h3 class="text-center" v-else-if="!groupHasSettings()">{{ __('voyager::settings.no_settings_match') }}</h3>
    </Card>
    <Collapsible v-if="jsonOutput" :title="__('voyager::generic.json_output')" closed>
        <JsonEditor v-model="settings" />
    </Collapsible>
</template>

<script>
import axios from 'axios';
import Draggable from './UI/Draggable.vue';
import { v4 as uuidv4 } from 'uuid';

import BreadBuilderValidation from '@components/Builder/ValidationForm.vue';
import EventBus from '@/eventbus';
import Store from '@/store';

export default {
    provide: {
        bread: null,
        relationships: [],
    },
    components: {
        BreadBuilderValidation,
        Draggable,
    },
    props: {
        input: {
            type: Array,
            required: true,
        },
        editMode: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            savingSettings: false,
            currentGroup: null,
            selectedSetting: null,
            query: '',
            errors: [],
            tempGroups: [], // Temporarily used when adding groups
        };
    },
    methods: {
        setCurrentGroup(group) {
            if (this.currentGroup !== group) {
                this.currentGroup = group;
            } else {
                this.currentGroup = null;
            }

            if (!this.currentGroup) {
                history.replaceState(null, null, ' ');
            } else {
                window.location.hash = this.currentGroup;
            }

            this.selectedSetting = null;
        },
        save(e = null) {
            if (this.savingSettings) {
                return;
            }
            if (typeof e === 'object' && e instanceof KeyboardEvent) {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                } else {
                    return;
                }
            }
            this.savingSettings = true;
            this.errors = [];

            axios.post(this.route('voyager.settings.store'), { settings: this.settings })
            .then((response) => {
                new this.$notification(this.__('voyager::settings.settings_saved')).color('green').timeout().show();
            })
            .catch((response) => {
                if (response.response.status == 422) {
                    this.errors = response.response.data;
                    new this.$notification(this.__('voyager::settings.validation_errors')).color('red').timeout().show();
                }
            })
            .then(() => {
                this.savingSettings = false;
            });
        },
        addSetting(formfield) {
            this.settings.push({
                type: JSON.parse(JSON.stringify(formfield.type)),
                group: this.currentGroup,
                key: null,
                name: null,
                value: null,
                info: '',
                translatable: false,
                options: {},
                validation: [],
            });
        },
        deleteSetting(setting) {
            new this
            .$notification(this.trans_choice('voyager::bread.delete_type_confirm', 1, { type: this.__('voyager::settings.setting') }))
            .color('red')
            .timeout()
            .confirm()
            .show()
            .then((response) => {
                if (response) {
                    this.settings.splice(this.settings.indexOf(setting), 1);

                    // Go to another group when there are no settings left in this group (effectively the group doesn't exist anymore)
                    if (this.settingsInGroup(setting.group) == 0 && setting.group !== null) {
                        this.setCurrentGroup(null);
                    }
                }
            });
        },
        cloneSetting(setting) {
            setting = JSON.parse(JSON.stringify(setting));
            setting.key = null;

            this.settings.push(setting);
        },
        addGroup() {
            new this
            .$notification(this.__('voyager::settings.enter_group_name'))
            .prompt()
            .timeout()
            .show()
            .then((value) => {
                if (value && value !== '') {
                    let group = this.slugify(value, { lower: true, strict:true });
                    this.tempGroups.push(group);
                    this.currentGroup = group;
                }
            });
        },
        data(setting, value = null) {
            if (setting.translatable || false && setting.value && this.isString(setting.value)) {
                setting.value = this.get_translatable_object(setting.value);
            }
            if (value !== null) {
                if (setting.translatable || false) {
                    setting.value[Store.locale] = value;
                } else {
                    setting.value = value;
                }

                EventBus.emit('setting-updated', setting);
            }
            if (setting.translatable || false) {
                return this.translate(this.get_translatable_object(setting.value));
            }
            return setting.value;
        },
        getErrors(setting) {
            var key = setting.key;
            if (setting.group !== null) {
                key = setting.group+'.'+setting.key;
            }

            return this.errors[key] || [];
        },
        groupHasErrors(group) {
            let errors = false;
            this.settings.forEach((setting) => {
                if (setting.group == group && this.getErrors(setting).length > 0) {
                    errors = true;
                }
            });

            // Special case where a setting doesn't have a key
            if (this.errors.hasOwnProperty(group+'.') || (group === null && this.errors.hasOwnProperty('.'))) {
                errors = true;
            }
            
            return errors;
        },
        groupHasSettings() {
            return this.filteredSettings.filter((setting) => {
                return setting.group == this.currentGroup;
            }).length > 0;
        },
        settingsInGroup(group) {
            return this.filteredSettings.filter((setting) => {
                return setting.group == group;
            });
        },
        generateKey(setting) {
            setting.key = this.slugify(this.translate(setting.name, false), { lower: true, strict: true });
        },
        badgeColor(group) {
            if (this.groupHasErrors(group)) {
                return 'red';
            } else if (this.currentGroup == group) {
                return 'green';
            } else if (this.settingsInGroup(group).length == 0) {
                return 'gray';
            }

            return 'accent';
        },
        copyUsage() {
            if (this.selectedSetting.group === null) {
                this.copyToClipboard(`\\Voyager\\Admin\\Facades\\Voyager::setting('${this.selectedSetting.key}');`);
            } else {
                this.copyToClipboard(`\\Voyager\\Admin\\Facades\\Voyager::setting('${this.selectedSetting.group}.${this.selectedSetting.key}');`);
            }

            new this.$notification(this.__('voyager::generic.copied_to_clipboard')).timeout().show();
        }
    },
    computed: {
        groups() {
            return [null, ...[...this.tempGroups, ...this.settings.map((setting) => {
                return setting.group;
            })].filter((group, key, self) => {
                return self.indexOf(group) === key && group;
            }).sort()];
        },
        filteredFormfields() {
            return Store.formfields.filter((formfield) => {
                return formfield.in_settings;
            });
        },
        settings() {
            return this.input.map((setting) => {
                setting.uuid = uuidv4();

                return setting;
            })
        },
        filteredSettings() {
            return this.settings.filter((s) => {
                return this.translate(s.title, false).toLowerCase().includes(this.query) || (s.key || '').toLowerCase().includes(this.query);
            });
        },
        jsonOutput() {
            return Store.jsonOutput;
        }
    },
    mounted() {
        document.addEventListener('keydown', this.save);

        if (this.groups.includes(window.location.hash.substr(1))) {
            this.currentGroup = window.location.hash.substr(1);
        }
    },
    unmounted() {
        document.removeEventListener('keydown', this.save);
    }
};
</script>