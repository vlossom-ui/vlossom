<template>
    <div>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Form Example: Sign Up</h2>

        <vs-form ref="formRef" :grid-size="12" column-gap="1rem" row-gap="1.5rem">
            <vs-input
                v-model="form.email"
                label="Email"
                placeholder="example@email.com"
                required
                :rules="[rules.required, rules.email]"
                :grid="{ xs: 12, md: 6 }"
            />
            <vs-input
                v-model="form.username"
                label="Username"
                placeholder="Enter username"
                required
                :rules="[rules.required, rules.minLength(3)]"
                :grid="{ xs: 12, md: 6 }"
            />
            <vs-input
                v-model="form.password"
                type="password"
                label="Password"
                placeholder="Enter password"
                required
                :rules="[rules.required, rules.minLength(8)]"
                :grid="{ xs: 12, md: 6 }"
            />
            <vs-input
                v-model="form.confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm password"
                required
                :rules="[rules.required, rules.matchPassword]"
                :grid="{ xs: 12, md: 6 }"
            />

            <vs-input
                v-model="form.age"
                type="number"
                label="Age"
                placeholder="Enter age"
                :rules="[rules.minValue(1), rules.maxValue(120)]"
                :grid="{ xs: 12, md: 6 }"
            />
            <vs-radio-set v-model="form.gender" label="Gender" :options="genderOptions" :grid="{ xs: 12, md: 6 }" />

            <vs-textarea v-model="form.bio" label="Bio" placeholder="Tell us about yourself..." :grid="12" />

            <vs-checkbox-set v-model="form.interests" label="Interests" :options="interestOptions" :grid="12" />

            <vs-switch
                v-model="form.newsletter"
                label="Subscribe to Newsletter"
                true-label="Yes"
                false-label="No"
                :grid="{ xs: 12, md: 6 }"
            />

            <vs-file-drop
                v-model="form.avatar"
                label="Profile Picture"
                placeholder="Drop image here or click to upload"
                accept="image/*"
                :grid="12"
            />

            <vs-checkbox
                v-model="form.agreeTerms"
                check-label="I agree to the Terms of Service and Privacy Policy"
                required
                :rules="[rules.mustBeTrue]"
                :grid="12"
            />
        </vs-form>

        <div class="my-6 h-px bg-gray-200 dark:bg-gray-700" />

        <div class="flex gap-4">
            <vs-button color-scheme="blue" @click="handleSubmit">Sign Up</vs-button>
            <vs-button @click="handleClear">Clear</vs-button>
        </div>

        <div class="my-6 h-px bg-gray-200 dark:bg-gray-700" />

        <div class="rounded bg-gray-100 p-4 dark:bg-gray-800">
            <h3 class="mb-2 font-semibold">Form Data</h3>
            <pre class="text-sm">{{ JSON.stringify(form, null, 2) }}</pre>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useTemplateRef } from 'vue';

interface SignUpForm {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    age: number | null;
    gender: string | null;
    bio: string;
    interests: string[];
    newsletter: boolean;
    avatar: File[];
    agreeTerms: boolean;
}

export default defineComponent({
    name: 'FormExample',
    setup() {
        const formRef = useTemplateRef<{ validate: () => Promise<boolean>; clear: () => void }>('formRef');

        const form: SignUpForm = reactive({
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            age: null,
            gender: null,
            bio: '',
            interests: [],
            newsletter: false,
            avatar: [],
            agreeTerms: false,
        });

        const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
        const interestOptions = ['Technology', 'Sports', 'Music', 'Art', 'Travel', 'Food'];

        const rules = {
            required: (v: unknown) => (!!v ? '' : 'This field is required'),
            email: (v: unknown) => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) ? '' : 'Invalid email format';
            },
            minLength: (min: number) => (v: unknown) => {
                return String(v).length >= min ? '' : `Minimum ${min} characters required`;
            },
            minValue: (min: number) => (v: unknown) => {
                return v === null || Number(v) >= min ? '' : `Minimum value is ${min}`;
            },
            maxValue: (max: number) => (v: unknown) => {
                return v === null || Number(v) <= max ? '' : `Maximum value is ${max}`;
            },
            matchPassword: (v: unknown) => (v === form.password ? '' : 'Passwords do not match'),
            mustBeTrue: (v: unknown) => (v === true ? '' : 'You must agree to continue'),
        };

        async function handleSubmit() {
            if (!formRef.value) {
                return;
            }

            const isValid = await formRef.value.validate();
            if (isValid) {
                alert('Form submitted successfully!');
                console.log('Form data:', form);
            }
        }

        function handleClear() {
            if (!formRef.value) {
                return;
            }

            formRef.value.clear();
        }

        return {
            formRef,
            form,
            genderOptions,
            interestOptions,
            rules,
            handleSubmit,
            handleClear,
        };
    },
});
</script>
