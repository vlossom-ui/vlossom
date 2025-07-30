import { VsComponent } from '@/declaration';
import { VsButtonAsync } from './vs-button';
import { VsSectionAsync } from './vs-section';
import type { Component } from 'vue';

export const componentsMap: { [key in VsComponent]: Component } = {
    [VsComponent.VsButton]: VsButtonAsync,
    [VsComponent.VsSection]: VsSectionAsync,
};
