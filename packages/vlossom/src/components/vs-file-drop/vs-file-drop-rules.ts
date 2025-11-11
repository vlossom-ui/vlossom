import { type Ref } from 'vue';
import type { FileDropValueType } from './types';

export function useVsFileDropRules(
    required: Ref<boolean>,
    max: Ref<number | string>,
    min: Ref<number | string>,
    accept: Ref<string>,
    multiple: Ref<boolean>,
) {
    function requiredCheck(v: FileDropValueType): string {
        if (required.value && v.length === 0) {
            return 'required';
        }

        return '';
    }

    function maxCheck(v: FileDropValueType): string {
        const limit = Number(max.value);
        if (v.length > limit) {
            return `You can only upload up to ${max.value} files`;
        }

        return '';
    }

    function minCheck(v: FileDropValueType): string {
        const limit = Number(min.value);
        if (v.length < limit) {
            return `You must upload at least ${min.value} files`;
        }

        return '';
    }

    function acceptCheck(v: FileDropValueType): string {
        if (accept.value && v.length > 0) {
            const acceptedTypes = accept.value.split(',').map((type) => type.trim());

            const invalidFiles = v.filter((file) => {
                const fileType = file.type;
                const fileName = file.name;
                const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

                return !acceptedTypes.some((acceptedType) => {
                    if (acceptedType === fileType) {
                        return true;
                    }

                    if (acceptedType.startsWith('.') && acceptedType.toLowerCase() === fileExtension) {
                        return true;
                    }

                    if (acceptedType.includes('*')) {
                        const regex = new RegExp('^' + acceptedType.replace('*', '.*') + '$');
                        return regex.test(fileType);
                    }

                    return false;
                });
            });

            if (invalidFiles.length > 0) {
                return `Allowed: ${acceptedTypes.join(', ')}`;
            }
        }

        return '';
    }

    function verifyMultipleFileUpload(value: FileDropValueType): string {
        if (multiple.value) {
            return '';
        }

        if (Array.isArray(value) && value.length > 1) {
            return 'You can only upload one file';
        }

        return '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
        acceptCheck,
        verifyMultipleFileUpload,
    };
}
