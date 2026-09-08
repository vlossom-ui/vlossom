import { type Ref } from 'vue';
import type { FileDropValueType } from './types';
import { useMessages } from '@/composables';

export function useVsFileDropRules(
    required: Ref<boolean>,
    max: Ref<number | string>,
    min: Ref<number | string>,
    accept: Ref<string>,
    multiple: Ref<boolean>,
) {
    const { messages, formatMessage } = useMessages();
    function requiredCheck(v: FileDropValueType): string {
        if (required.value && v.length === 0) {
            return messages.value.VS_VALIDATION_REQUIRED;
        }

        return '';
    }

    function maxCheck(v: FileDropValueType): string {
        const limit = Number(max.value);
        if (v.length > limit) {
            return formatMessage(messages.value.VS_VALIDATION_FILE_MAX, { value: max.value });
        }

        return '';
    }

    function minCheck(v: FileDropValueType): string {
        const limit = Number(min.value);
        if (v.length < limit) {
            return formatMessage(messages.value.VS_VALIDATION_FILE_MIN, { value: min.value });
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
                return formatMessage(messages.value.VS_VALIDATION_FILE_TYPE, { value: acceptedTypes.join(', ') });
            }
        }

        return '';
    }

    function verifyMultipleFileUpload(value: FileDropValueType): string {
        if (multiple.value) {
            return '';
        }

        if (Array.isArray(value) && value.length > 1) {
            return formatMessage(messages.value.VS_VALIDATION_SINGLE_FILE);
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
