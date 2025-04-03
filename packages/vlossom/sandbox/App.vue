<template>
    <div>
        <h1>Hello Vlossom</h1>
        {{ proxy.name }}
        {{ proxy.plugin1 }}
        {{ proxy.plugin2 }}
        {{ proxy.plugin3 }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Store1 {
    brand: string;
}

interface Store2 {
    brand: string;
}

interface Store3 {
    brand: string;
}

interface CarPlugins {
    plugin1: Store1;
    plugin2: Store2;
    plugin3: Store3;
}

class Car {
    public name: string;
    public plugins: Partial<CarPlugins>;

    constructor(name: string) {
        this.name = name;
        this.plugins = {};
    }

    addPlugin<K extends keyof CarPlugins>(name: K, store: CarPlugins[K]) {
        this.plugins[name] = store;
    }
}

type CarProxy = Car & CarPlugins;

export default defineComponent({
    setup() {
        const car = new Car('My Car');
        car.addPlugin('plugin1', { brand: 'BMW' });
        car.addPlugin('plugin2', { brand: 'BENZ' });
        const proxy = new Proxy(car, {
            get(target, prop) {
                if (prop in target.plugins) {
                    return target.plugins[prop as keyof CarPlugins];
                }
                return target[prop as keyof Car];
            },
        }) as CarProxy;
        car.addPlugin('plugin3', { brand: 'AUDI' });
        return { car, proxy };
    },
});
</script>
