import type { GlobalStyleSets } from '@/declaration';
import type { VsAvatarStyleSet } from '@/components';

const VsAvatar: VsAvatarStyleSet = {
    backgroundColor: '#1e88e5',
    borderRadius: '50%',
    fontColor: '#fff',
    fontSize: '1.5rem',
    fontWeight: '600',
    width: '5rem',
} as const;

export const styleSet: GlobalStyleSets = {
    myStyleSet: {
        VsAvatar,
    },
};
