<template>
    <div class="w-full media-manager border rounded-lg p-4 mb-4 min-h-64">
        <input class="hidden" type="file" :multiple="multiple" @change="addUploadFiles($event.target.files)" ref="upload_input">
        <div class="w-full mb-2" v-if="showToolbar">
            <div class="flex-wrap space-x-1 space-y-1">
                <button class="button green small" @click="upload()" :disabled="filesToUpload.length == 0" v-if="!instantUpload">
                    <Icon icon="upload" />
                    <span>{{ __('voyager::media.upload') }}</span>
                </button>
                <button class="button accent small" @click="selectFilesToUpload()">
                    <Icon icon="check-circle" />
                    <span>{{ __('voyager::media.select_upload_files') }}</span>
                </button>
                <button class="button accent small space-x-0" @click="loadFiles()" :disabled="store.pageLoading">
                    <Icon icon="arrow-path" class="animate-spin-reverse" :size="store.pageLoading ? 5 : 0" :transition-size="5" />
                    <span>{{ __('voyager::generic.reload') }}</span>
                </button>
                <button class="button accent small" @click="createFolder()">
                    <Icon icon="folder-plus" />
                    <span>{{ __('voyager::media.create_folder') }}</span>
                </button>
                <button class="button red small" @click="deleteSelected()" v-if="selectedFiles.length > 0">
                    <Icon icon="trash" />
                    <span>{{ trans_choice('voyager::media.delete_files', selectedFiles.length) }}</span>
                </button>
                <button class="button accent small" v-show="selectedFiles.length > 0" @click="downloadFiles()">
                    <Icon icon="arrow-down-tray" />
                    <span>{{ trans_choice('voyager::media.download_files', selectedFiles.length) }}</span>
                </button>
                <button class="button accent small" @click="thumbSizeUp()">
                    <Icon icon="plus" />
                </button>
                <button class="button accent small" @click="thumbSizeDown()">
                    <Icon icon="minus" />
                </button>
                <!-- Hidden until ImageEditor is implemented -->
                <!--
                <button class="button accent small" v-show="imageSelected" @click="$refs.image_edit_modal.open()">
                    <Icon icon="pencil" />
                    <span>{{ __('voyager::generic.edit') }}</span>
                </button>
                -->
            </div>
        </div>
        <div class="w-full mb-2 rounded-md breadcrumbs">
            <div class="flex">
                <span v-for="(path, i) in pathSegments" :key="'path-'+i" class="h-full flex items-center my-2 pl-2 space-x-2">
                    <button @click.prevent.stop="openPath(path, i)" class="focus:outline-none" :class="path == '' ? 'h-5 w-5' : null">
                        <Icon v-if="path == ''" icon="home" />
                        <span v-else>{{ path }}</span>
                    </button>
                    <button class="cursor-default focus:outline-none" v-if="pathSegments.length !== (i+1)">
                        /
                    </button>
                </span>
            </div>
        </div>
        <div class="flex w-full min-h-64">
            <div class="w-full max-h-256 overflow-y-auto px-2" @click="selectedFiles = []">
                <div class="relative flex-grow grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div class="absolute w-full h-full flex items-center justify-center dragdrop pointer-events-none" v-if="((filesToUpload.length == 0 && files.length == 0) || dragging) && !store.pageLoading">
                        <h4>{{ dragging ? dropText : dragText }}</h4>
                    </div>
                    <div v-if="combinedFiles.length == 0" class="h-64"></div>
                    <div
                        class="item w-full rounded-md border cursor-pointer select-none h-auto"
                        v-for="(file, i) in combinedFiles"
                        :key="i"
                        :class="[fileSelected(file) ? 'selected' : '', filePicked(file) ? 'picked' : '', file.is_upload ? 'opacity-50' : '']"
                        v-on:click.prevent.stop="selectFile(file, $event)"
                        v-on:dblclick.prevent.stop="openFile(file)"
                        v-tooltip="file.file.name">
                        <div class="flex space-x-3 p-3">
                            <div class="flex-none">
                                <div class="w-full flex justify-center">
                                    <img :data-src="file.preview" :class="`rounded object-contain h-${thumbnailSizes[thumbSize]} max-w-full`" v-if="file.preview" v-lazy-load />
                                    <img :data-src="file.file.url" :class="`rounded object-contain h-${thumbnailSizes[thumbSize]} max-w-full`" v-else-if="matchMime(file.file.type, 'image/*')" v-lazy-load />
                                    <div v-else :class="`h-${thumbnailSizes[thumbSize]}`">
                                        <Icon :icon="getFileIcon(file.file.type)" :size="thumbnailSizes[thumbSize]" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex-grow overflow-hidden">
                                <div class="flex flex-col h-full">
                                    <div class="flex-none">
                                        <span class="whitespace-nowrap">{{ file.file.name }}</span>
                                        <p class="text-sm" v-if="file.file.thumbnails.length > 0">
                                            {{ trans_choice('voyager::media.thumbnail_amount', file.file.thumbnails.length) }}
                                        </p>
                                        <p class="text-xs" v-if="file.file.type !== 'directory'">{{ readableFileSize(file.file.size) }}</p>
                                    </div>
                                    <div class="flex items-end justify-end flex-grow">
                                        <button @click.stop="deleteUpload(file)" v-if="file.is_upload">
                                            <Icon icon="x-mark" :size="4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex-none h-1 bg-blue-500 rounded-b-md"
                            v-if="file.status == Status.Uploading && file.progress < 100"
                            :style="{ width: file.progress+'%' }">
                        </div>
                        <div class="max-w-full h-1 overflow-hidden" v-if="file.status == Status.Uploading && file.progress >= 100">
                            <div class="indeterminate">
                                <div class="before bg-blue-500 rounded"></div>
                                <div class="after bg-blue-500 rounded"></div>
                            </div>
                        </div>
                        <div
                            class="flex-none h-1 w-full bg-green-500 rounded-b-md"
                            v-if="file.status == Status.Finished">
                        </div>
                        <div
                            class="flex-none h-1 w-full bg-red-500 rounded-b-md"
                            v-if="file.status == Status.Failed">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-none">
                <div class="sidebar h-full border rounded-md p-2 ml-3 w-56">
                    <div v-if="selectedFiles.length > 0">
                        <div class="w-full flex justify-center">
                            <div v-if="selectedFiles.length > 1" class="w-full flex justify-center h-32">
                                <Icon icon="document-duplicate" :size="32" />
                            </div>
                            <img :src="selectedFiles[0].preview" class="rounded object-contain h-32 max-w-full" v-else-if="selectedFiles[0].preview" />
                            <img :src="selectedFiles[0].file.url" class="rounded object-contain h-32 max-w-full" v-else-if="matchMime(selectedFiles[0].file.type, 'image/*')" />
                            <video v-else-if="matchMime(selectedFiles[0].file.type, 'video/*')" controls>
                                <source :src="selectedFiles[0].file.url" :type="selectedFiles[0].file.type" />
                            </video>
                            <audio v-else-if="matchMime(selectedFiles[0].file.type, 'audio/*')" controls>
                                <source :src="selectedFiles[0].file.url" :type="selectedFiles[0].file.type" />
                            </audio>
                            <div v-else class="w-full flex justify-center h-32">
                                <Icon :icon="getFileIcon(selectedFiles[0].file.type)" :size="32" />
                            </div>
                        </div>
                        <div class="w-full flex justify-start mt-2">
                            <div v-if="selectedFiles.length == 1">
                                <p>{{ selectedFiles[0].file.name }}</p>
                                <p>{{ __('voyager::media.size') }}: {{ readableFileSize(selectedFiles[0].file.size) }}</p>
                                <input
                                    type="text"
                                    class="input small w-full mt-1 select-none"
                                    v-if="selectedFiles[0].file.type !== 'directory'"
                                    :value="encodeURI(selectedFiles[0].file.url)"
                                    @dblclick="copyPath(encodeURI(selectedFiles[0].file.url))">

                                <ul v-if="selectedFiles[0].file.thumbnails.length > 0" class="mt-2">
                                    <span>{{ __('voyager::media.thumbnails.thumbnails') }}</span>
                                    <li v-for="(thumb, i) in selectedFiles[0].file.thumbnails" :key="i" @dblclick="copyPath(encodeURI(thumb.file.url))">
                                        <a :href="thumb.file.url" target="_blank">{{ thumb.file.name }}</a>
                                    </li>
                                </ul>
                            </div>
                            <div v-else>
                                <p>{{ __('voyager::media.files_selected', { num: selectedFiles.length }) }}</p>
                                <p>{{ __('voyager::media.approximately') }} {{ readableFileSize(selectedFilesSize) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal ref="lightbox" :title="openedFile ? openedFile.name : ''">
            <div v-if="openedFile">
                <div class="w-full flex justify-center">
                    <img :src="openedFile.url" class="rounded object-contain max-w-full" />
                </div>
                <div class="w-full mt-2 justify-center items-center flex flex-wrap space-x-1 space-y-1">
                    <img
                        v-for="(image, i) in images"
                        :key="i"
                        v-tooltip="image.file.relative_path+image.file.name"
                        class="rounded object-contain h-24 cursor-pointer"
                        :class="openedFile.url == image.file.url ? 'border border-blue-500' : null"
                        :src="image.file.url"
                        @click="openedFile = image.file"
                    />
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import axios from 'axios';

import closable from '@mixins/closable';
import matchMime from '@helper/match-mime';
import Store from '@/store';

export default {
    mixins: [closable],
    emits: ['update:modelValue'],
    props: {
        'uploadUrl': {
            type: String,
            required: true,
        },
        'listUrl': {
            type: String,
            required: true,
        },
        'instantUpload': {
            type: Boolean,
            default: true,
        },
        'multiple': {
            type: Boolean,
            default: true,
        },
        'maxSize': {
            type: Number,
            default: 0,
        },
        'multiSelect': {
            type: Boolean,
            default: true,
        },
        'dragText': {
            type: String,
            default: 'Drag your files here',
        },
        'dropText': {
            type: String,
            default: 'Drop it like its 🔥',
        },
        'showToolbar': {
            type: Boolean,
            default: true,
        },
        'allowedMimeTypes': {
            type: Array,
            default: () => {
                return [];
            }
        },
        'max': {
            type: Number,
            default: 0,
        },
        'closed': {
            type: Boolean,
            default: false,
        },
        'modelValue': {
            type: [Array, undefined],
            default: undefined,
        }
    },
    data() {
        return {
            store: Store,
            filesToUpload: [],
            uploading: 0,
            files: [],
            selectedFiles: [],
            path: '',
            ddCapable: true,
            dragging: false,
            loadingFiles: false,
            dragEnterTarget: null,
            openedFile: null,
            thumbnailSizes: [
                10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40
            ],
            thumbSize: 6,
        };
    },
    methods: {
        matchMime: matchMime,
        addUploadFiles(files) {
            this.filesToUpload = this.filesToUpload.concat(Array.from(files).map((file) => {
                // Validate size
                if (this.maxSize > 0 && (file.size > this.maxSize)) {
                    // TODO: Show error
                    return null;
                }

                if (file.type !== '') {
                    // Validate mime type
                    if (this.allowedMimeTypes.length > 0) {
                        var result = false;
                        this.allowedMimeTypes.forEach((mime) => {
                            if (mime == '' || mime === null || mime == 'directory') {
                                return;
                            }
                            if (matchMime(file.type, mime)) {
                                result = true;
                            }
                        });

                        if (!result) {
                            return null;
                        }
                    }
                } else {
                    // TODO: Not all documents send a mimetype. Check extension?
                }

                // Check if file already exists by name AND size
                var exists = false;
                this.filesToUpload.forEach((ex_file) => {
                    if (ex_file.file.name == file.name && ex_file.file.size == file.size) {
                        exists = true;
                    }
                });
                if (exists) {
                    return null;
                }

                file.thumbnails = [];

                var f = {
                    file: file,
                    is_upload: true,
                    status: Status.Pending,
                    progress: 0,
                    preview: null,

                }
                // Create FileReader if it is an image
                if (matchMime(file.type, 'image/*')) {
                    let reader  = new FileReader();
                    reader.addEventListener('load', () => {
                        f.preview = reader.result;
                    });
                    reader.readAsDataURL(file);
                }

                return f;
            }).filter(x => !!x));

            if (this.instantUpload) {
                this.upload();
            }
        },
        loadFiles() {
            this.selectedFiles = [];

            axios.post(this.listUrl, { path: this.path })
            .then((response) => {
                this.files = response.data;
            })
            .catch((response) => {})
            .then(() => {});
        },
        upload() {
            var files = this.filesToUpload.whereNot('status', Status.Finished);

            if (files.length == 0) {
                this.loadFiles();
                this.filesToUpload = this.filesToUpload.whereNot('status', Status.Finished);
                return;
            }

            let formData = new FormData();
            formData.append('path', this.path);

            files.forEach((file) => {
                file.status = Status.Uploading;
                file.progress = 100;
                formData.append('files[]', file.file);
            });

            axios.post(this.uploadUrl, formData)
            .then((response) => {
                response.data.forEach((file) => {
                    var uploadFile = null;
                    files.forEach((f) => {
                        if (f.file.name == file.original) {
                            uploadFile = f;
                        }
                    });
                    
                    if (uploadFile) {
                        uploadFile.progress = 100;

                        if (file.uploaded === false) {
                            uploadFile.status = Status.Failed;
                            new this.$notification(this.__('voyager::media.file_upload_failed', { file: file.original })).color('red').timeout().show();
                        } else {
                            uploadFile.status = Status.Finished;
                            // TODO: Display a message?
                        }
                    }
                });

                // Cleanup finished files
                this.loadFiles();
                this.filesToUpload = this.filesToUpload.whereNot('status', Status.Finished);
            })
            .catch(() => {
                // TODO: Handle fails
            });
        },
        downloadFiles() {
            if (this.selectedFiles.length > 0) {
                // TODO: Fix this
                axios.post(this.route('voyager.media.download'), { files: this.selectedFiles }, 'blob')
                .blob((response) => {
                    if (this.selectedFiles.length == 1 && this.selectedFiles[0]['file']['type'] != 'directory') {
                        this.downloadBlob(response, this.selectedFiles[0]['file']['name']);
                    } else {
                        this.downloadBlob(response, 'download.zip');
                    }
                })
                .catch((response) => {});
            }
        },
        downloadBlob(blob, name) {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            link.click();
            window.URL.revokeObjectURL(url);
        },
        selectFilesToUpload() {
            this.$refs.upload_input.click();
        },
        selectFile(file, e) {
            if (!e.ctrlKey || !this.multiSelect) {
                this.selectedFiles = [];
            }
            this.selectedFiles.push(file);
        },
        fileSelected(file) {
            return this.selectedFiles.indexOf(file) >= 0;
        },
        filePicked(file) {
            return this.pickedFilePosition(file) >= 0;
        },
        pickedFilePosition(file) {
            var index = -1;
            if (this.isArray(this.modelValue)) {
                this.modelValue.filter((f, i) => {
                    if (f.disk == file.file.disk && file.file.relative_path == f.relative_path && f.name == file.file.name) {
                        index = i;
                    }
                });
            }

            return index;
        },
        openFile(file) {
            if (file.file.type == 'directory') {
                this.path = this.path + '/' + file.file.name;
                this.pushCurrentPathToUrl();
                this.loadFiles();
            } else {
                if (this.filePicked(file)) {
                    this.$emit('update:modelValue', this.modelValue.removeAtIndex(this.pickedFilePosition(file)));
                } else {
                    this.$emit('update:modelValue', [...this.modelValue || [], file.file]);
                }

                if (matchMime(file.file.type, 'image/*') && this.modelValue === undefined) {
                    this.openedFile = file.file;
                    this.$refs.lightbox.open();
                }
            }
        },
        deleteUpload(file) {
            this.filesToUpload.splice(this.filesToUpload.indexOf(file), 1);
        },
        getExtensionFromFilename(name) {
            return this.stringAfterLast('.', name).toLowerCase();
        },
        isFileImage(name) {
            var ext = this.getExtensionFromFilename(name);

            if (ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'bmp') {
                return true;
            }

            return false;
        },
        getFileIcon(type) {
            if (type == 'directory') {
                return 'folder';
            }

            return 'document';
        },
        openPath(path, index) {
            this.path = this.pathSegments.slice(0, (index + 1)).join('/');

            // Push path to URL
            this.pushCurrentPathToUrl();

            this.loadFiles();
        },
        pushCurrentPathToUrl() {
            var url = window.location.href.split('?')[0];
            url = this.addParameterToUrl('path', this.path, url);
            this.pushToUrlHistory(url);
        },
        deleteSelected() {
            new this
            .$notification(this.trans_choice('voyager::media.delete_files_confirm', this.selectedFiles.length))
            .color('red')
            .timeout()
            .confirm()
            .show()
            .then((response) => {
                if (response === true) {
                    axios.delete(this.route('voyager.media.delete'), { data: { files: this.selectedFiles }})
                    .then((response) => {
                        if (response.data.files > 0) {
                            new this.$notification(this.trans_choice('voyager::media.delete_files_success', response.data.files)).color('green').timeout().show();
                        }
                        if (response.data.dirs > 0) {
                            new this.$notification(this.trans_choice('voyager::media.delete_folder_success', response.data.dirs)).color('green').timeout().show();
                        }
                    })
                    .catch((response) => {})
                    .then(() => {
                        this.loadFiles();
                        this.selectedFiles = [];
                    });
                }
            });
        },
        createFolder() {
            new this
            .$notification(this.__('voyager::media.create_folder_prompt'))
            .timeout()
            .prompt()
            .addButton({ key: true, value: this.__('voyager::generic.ok'), color: 'green'})
            .addButton({ key: false, value: this.__('voyager::generic.cancel'), color: 'red'})
            .show()
            .then((result) => {
                if (result !== false) {
                    // Check if a folder with this name already exists
                    var exists = false;
                    this.files.forEach((file) => {
                        if (file.file.type == 'directory' && file.file.name == result) {
                            new this.$notification(this.__('voyager::media.folder_exists', { name: result })).color('yellow').timeout().show();
                            exists = true;
                        }
                    });

                    if (exists) {
                        return;
                    }

                    axios.post(this.route('voyager.media.create_folder'), { type: 'directory', name: result, })
                    .then(() => {
                        new this.$notification(this.__('voyager::media.create_folder_success', { name: result })).color('green').timeout().show();
                        this.openFile({
                            file: {
                                type: 'directory',
                                name: result,
                            }
                        });
                    })
                    .catch((response) => {})
                    .then(() => {
                        this.loadFiles();
                    });
                }
            });
        },
        copyPath(path) {
            this.copyToClipboard(path);
            new this.$notification(this.__('voyager::media.path_copied')).timeout().show();
        },
        thumbSizeUp() {
            if (this.thumbSize < this.thumbnailSizes.length - 1) {
                this.thumbSize += 1;
            }
        },
        thumbSizeDown() {
            if (this.thumbSize > 0) {
                this.thumbSize -= 1;
            }
        }
    },
    computed: {
        combinedFiles() {
            return this.files.filter((file) => {
                if (this.allowedMimeTypes.length == 0) {
                    return true;
                }
                var result = false;
                this.allowedMimeTypes.forEach((mime) => {
                    if (mime === 'directory') {
                        if (file.file.type === 'directory') {
                            result = true;
                        }
                    } else if (matchMime(file.file.type, mime)) {
                        result = true;
                    }
                });

                return result;
            }).concat(this.filesToUpload);
        },
        selectedFilesSize() {
            var size = 0;

            this.selectedFiles.forEach((file) => {
                size += file.file.size;
            });

            return size;
        },
        pathSegments() {
            return this.path.split('/');
        },
        images() {
            return this.files.filter((file) => {
                return matchMime(file.file.type, 'image/*');
            });
        },
        imageSelected() {
            return this.selectedFiles.length == 1 && matchMime(this.selectedFiles[0].file.type, 'image/*');
        },
    },
    mounted() {
        var div = document.createElement('div');
        this.ddCapable = (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;

        if (this.ddCapable) {
            // Prevent browser opening a new tab
            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((event) => {
                this.$el.addEventListener(event, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            // Indicates that we are dragging files over our wrapper
            ['drag', 'dragstart', 'dragover', 'dragenter'].forEach((event) => {
                this.$el.addEventListener(event, (e) => {
                    if (e.dataTransfer.files.length > 0) {
                        this.dragEnterTarget = e.target;
                        e.stopPropagation();
                        e.preventDefault();
                        this.dragging = true;
                    }
                });
            });

            // Indicates that we left our wrapper or dropped files
            ['dragend', 'dragleave', 'drop'].forEach((event) => {
                this.$el.addEventListener(event, (e) => {
                    if (this.dragEnterTarget == e.target) {
                        e.stopPropagation();
                        e.preventDefault();
                        this.dragging = false;
                    }
                });
            });

            this.$el.addEventListener('drop', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.dragging = false;
                this.addUploadFiles(e.dataTransfer.files);
            });
        }

        var path = this.getParameterFromUrl('path', '');
        if (path !== '/') {
            this.path = path;
        }

        this.loadFiles();
    },
    created() {
        if (this.closed) {
            this.close();
        } else {
            this.open();
        }
    }
};
</script>

<style lang="scss">
@import "@sassmixins/bg-color";
@import "@sassmixins/border-color";
@import "@sassmixins/text-color";

.dark .media-manager {
    @include bg-color(media-bg-color-dark, 'colors.gray.850');
    @include border-color(media-border-color-dark, 'colors.gray.700');

    .item {
        @include bg-color(media-item-bg-color-dark, 'colors.gray.800');
        @include border-color(media-item-border-color-dark, 'colors.gray.700');

        &:hover {
            @include bg-color(media-item-hover-bg-color-dark, 'colors.gray.700');
        }

        &.selected {
            @include bg-color(media-item-selected-bg-color-dark, 'colors.gray.750');
            @include border-color(media-item-selected-border-color-dark, 'colors.blue.700');
        }

        &.picked {
            @include bg-color(media-item-picked-bg-color-dark, 'colors.gray.750');
            @include border-color(media-item-picked-border-color-dark, 'colors.green.700');
        }
    }

    .breadcrumbs {
        @include bg-color(media-breadcrumbs-bg-color-dark, 'colors.gray.800');
        @include border-color(media-breadcrumbs-border-color-dark, 'colors.gray.700');
    }

    .sidebar {
        @include bg-color(media-sidebar-bg-color-dark, 'colors.gray.800');
        @include border-color(media-sidebar-border-color-dark, 'colors.gray.700');
    }

    .dragdrop {
        @include bg-color(media-bg-color-dark, 'colors.gray.850');
    }

    .loading {
        @include bg-color(media-bg-color-dark, 'colors.gray.850');
    }
}

.media-manager {
    @include bg-color(media-bg-color, 'colors.white');
    @include border-color(media-border-color, 'colors.gray.300');

    .item {
        @include bg-color(media-item-bg-color, 'colors.gray.100');
        @include border-color(media-item-border-color, 'colors.gray.300');

        &:hover {
            @include bg-color(media-item-hover-bg-color, 'colors.gray.200');
        }

        &.selected {
            @include bg-color(media-item-selected-bg-color, 'colors.gray.250');
            @include border-color(media-item-selected-border-color, 'colors.blue.300');
        }

        &.picked {
            @include bg-color(media-item-picked-bg-color, 'colors.gray.250');
            @include border-color(media-item-picked-border-color, 'colors.green.300');
        }
    }

    .breadcrumbs {
        @include bg-color(media-breadcrumbs-bg-color, 'colors.gray.100');
        @include border-color(media-breadcrumbs-border-color, 'colors.gray.300');
    }

    .sidebar {
        @include bg-color(media-sidebar-bg-color, 'colors.white');
        @include border-color(media-sidebar-border-color, 'colors.gray.300');
    }

    .dragdrop {
        @include bg-color(media-bg-color, 'colors.white');
    }

    .loader {
        @include bg-color(media-bg-color, 'colors.white');
    }

    @keyframes indeterminate {
        0% {
            width: 30%;
            left: -40%;
        }
        50% {
            left: 100%;
            width: 100%;
        }
        to {
            left: 100%;
            width: 0;
        }
    }

    .progress_bar_indeterminate {
        transition: width 0.25s ease;
        animation: indeterminate 2s ease infinite;
    }
}
</style>