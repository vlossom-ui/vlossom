> 한국어: [README.ko.md](./README.ko.md)

# VsForm

A grid-based form component for managing and validating form elements. Provides state management via FormStore and validation, with a responsive CSS Grid layout.

**Available Version**: 2.0.0+

## Basic Usage

### Default Form

```html
<template>
    <vs-form ref="form-ref">
        <vs-input v-model="formData.username" label="Username" />
        <vs-input v-model="formData.email" type="email" label="Email" />
        <vs-input v-model="formData.password" type="password" label="Password" />
    </vs-form>
</template>

<script setup>
    const formRef = useTemplateRef('form-ref');

    function validation() {
        console.log(formRef.value.changed);
        console.log(formRef.value.valid);
        return formRef.value.validate();
    }
</script>
```

### Grid Layout

```html
<template>
    <vs-form :grid-size="6" :column-gap="16" :row-gap="8">
        <vs-input v-model="userData.firstName" label="First Name" grid="3" />
        <vs-input v-model="userData.lastName" label="Last Name" grid="3" />
        <vs-input v-model="userData.email" label="Email" grid="4" />
        <vs-input v-model="userData.phone" label="Phone" grid="2" />
    </vs-form>
</template>
```

### Form-Wide Readonly and Disabled

```html
<template>
    <vs-form readonly>
        <vs-input v-model="userData.name" label="Name" />
    </vs-form>

    <vs-form disabled>
        <vs-input v-model="formData.title" label="Title" />
    </vs-form>
</template>
```

## Props

| Prop        | Type               | Default | Required | Description                 |
| ----------- | ------------------ | ------- | -------- | --------------------------- |
| `gridSize`  | `string \| number` | -       | -        | Number of grid columns      |
| `columnGap` | `string \| number` | -       | -        | Gap between columns         |
| `rowGap`    | `string \| number` | -       | -        | Gap between rows            |
| `disabled`  | `boolean`          | `false` | -        | Disable all form elements   |
| `readonly`  | `boolean`          | `false` | -        | Set entire form to readonly |

## Types

```typescript
// No StyleSet for this component
```

## Events

| Event   | Payload    | Description                                          |
| ------- | ---------- | ---------------------------------------------------- |
| `error` | `string[]` | Emitted on validation failure with invalid field IDs |

## Slots

| Slot      | Description                        |
| --------- | ---------------------------------- |
| `default` | Form elements to place in the form |

## Methods

| Method     | Parameters | Return Type | Description                                                          |
| ---------- | ---------- | ----------- | -------------------------------------------------------------------- |
| `validate` | -          | `boolean`   | Run form validation; returns `true` if all fields pass, else `false` |
| `clear`    | -          | `void`      | Reset all input elements in the form                                 |

## Features

- **Grid-based layout**: Responsive form layout using CSS Grid
- **State management**: Shares form state with child components by providing FormStore
- **Validation system**: Real-time validation and integrated validation
- **Global state control**: Apply disabled/readonly state to the entire form
