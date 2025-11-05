import { type Ref } from 'vue';
import type { FileDropValueType } from './types';

export function useVsFileDropRules(
    required: Ref<boolean>,
    max: Ref<number | string>,
    min: Ref<number | string>,
    accept: Ref<string>,
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
            const files = v.map((file) => file.type);
            const invalidFiles = files.filter((file) => !acceptedTypes.includes(file));
            if (invalidFiles.length > 0) {
                return `You can only upload files with the following extensions: ${acceptedTypes.join(', ')}`;
            }
        }

        return '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
        acceptCheck,
    };
}
