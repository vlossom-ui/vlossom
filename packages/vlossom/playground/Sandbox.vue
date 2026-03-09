<template>
    <div class="sandbox">
        <h2>Bug Fix: vs-button primary + ghost / outline hover</h2>

        <section>
            <h3>ghost + primary</h3>
            <div class="row">
                <vs-button ghost>ghost only</vs-button>
                <vs-button primary>primary only</vs-button>
                <vs-button ghost primary @click="showToast('ghost + primary 버튼 클릭!')">
                    ghost + primary (hover me)
                </vs-button>
            </div>
        </section>

        <section>
            <h3>outline + primary</h3>
            <div class="row">
                <vs-button outline>outline only</vs-button>
                <vs-button primary>primary only</vs-button>
                <vs-button outline primary @click="showToast('outline + primary 버튼 클릭!')">
                    outline + primary (hover me)
                </vs-button>
            </div>
        </section>

        <section>
            <h3>color-scheme variants</h3>
            <div class="row">
                <vs-button ghost primary color-scheme="green" @click="showToast('green ghost + primary!')">
                    green ghost + primary
                </vs-button>
                <vs-button outline primary color-scheme="red" @click="showToast('red outline + primary!')">
                    red outline + primary
                </vs-button>
                <vs-button outline primary color-scheme="cyan" @click="showToast('cyan outline + primary!')">
                    cyan outline + primary
                </vs-button>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useVlossom } from '@/framework';
import VsButton from '@/components/vs-button/VsButton.vue';

export default defineComponent({
    name: 'Sandbox',
    components: { VsButton },
    setup() {
        const $vs = useVlossom();

        function showToast(message: string) {
            $vs.toast.show(message, { primary: true });
        }

        return { showToast };
    },
});
</script>

<style scoped>
.sandbox {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

h2 {
    font-size: 1.25rem;
    font-weight: 600;
}

h3 {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: #666;
}

section {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
}
</style>
