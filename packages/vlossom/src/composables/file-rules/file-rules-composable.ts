import { type Ref } from 'vue';
import { useMessages } from '@/composables/messages/messages-composable';

export function useFileRules(
    accept: Ref<string>,
    multiple: Ref<boolean>,
    required: Ref<boolean>,
    max?: Ref<number | string>,
    min?: Ref<number | string>,
) {
    const { optionMessages, formatMessage } = useMessages();

    function requiredCheck(files: File[]): string {
        if (required.value && files.length === 0) {
            return optionMessages.value.VS_VALIDATION_REQUIRED;
        }

        return '';
    }

    function maxCheck(files: File[]): string {
        if (!max) {
            return '';
        }

        const limit = Number(max.value);
        if (files.length > limit) {
            return formatMessage(optionMessages.value.VS_VALIDATION_FILE_MAX, { value: max.value });
        }

        return '';
    }

    function minCheck(files: File[]): string {
        if (!min) {
            return '';
        }

        const limit = Number(min.value);
        if (files.length < limit) {
            return formatMessage(optionMessages.value.VS_VALIDATION_FILE_MIN, { value: min.value });
        }

        return '';
    }

    function acceptCheck(files: File[]): string {
        if (accept.value && files.length > 0) {
            const acceptedTypes = accept.value.split(',').map((type) => type.trim());

            const invalidFiles = files.filter((file) => {
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
                return formatMessage(optionMessages.value.VS_VALIDATION_FILE_TYPE, { value: acceptedTypes.join(', ') });
            }
        }

        return '';
    }

    function verifyMultipleFileUpload(files: File[]): string {
        if (multiple.value) {
            return '';
        }

        if (Array.isArray(files) && files.length > 1) {
            return formatMessage(optionMessages.value.VS_VALIDATION_SINGLE_FILE);
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
