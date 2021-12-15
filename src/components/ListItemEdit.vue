<script setup>
import { ref, reactive, watch, computed, onMounted, onBeforeUnmount, toRef, watchEffect, toRefs } from "vue";
import { useStore } from "vuex";
const store = useStore()
const colors = store.state.colors
const emits = defineEmits(['editItem', 'close'])
const props = defineProps({
    active: {
        type: Boolean,
        required: true
    },
    item: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
})
const colorActive = ref(null)
watch(() => props.active, (newVal, oldVal) => {
    colorActive.value = colors.findIndex(color => color == props.item.color)
})
const updateTask = () => {
    const result = props.item.title.trim() && props.item.title
    if (!result || colorActive.value < 0) return
    props.item.color = colors[colorActive.value]
    const data = { item: props.item, index: props.index }
    store.commit('UPDATE_LIST', data)
    emits('close', false)
}

</script>
<template>
    <div
        v-if="active"
        class="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
    ></div>

    <transition name="modal" mode="out-in">
        <div
            v-if="active"
            class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center z-30"
        >
            <div
                class="flex items-center bg-primary rounded-2xl mx-4 p-4 py-5 w-full md:w-6/12 sm:w-8/12 xl:w-4/12"
            >
                <div class="w-full relative">
                    <div class="font-bold text-lg text-center font-head">EDIT TASK</div>
                    <div
                        class="absolute right-0 top-0 cursor-pointer"
                        @click="emits('close', false)"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 6L6 18"
                                stroke="#BDBDBD"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M6 6L18 18"
                                stroke="#BDBDBD"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                    <div class="my-10">
                        <div>
                            <input
                                type="text"
                                class="bg-secondary placeholder-white placeholder-opacity-60 w-full rounded-lg py-2 px-3 focus:ring focus:ring-blue-400 outline-none"
                                placeholder="Task title . . ."
                                v-model="item.title"
                            />
                        </div>
                        <div class="mt-5">
                            <div class="text-text-color">Choose Color :</div>
                            <div class="flex items-center space-x-2 flex-wrap">
                                <div
                                    class="w-9 h-9 rounded-full flex mt-2 cursor-pointer"
                                    :class="{ 'border-4 border-sky-300': colorActive == index }"
                                    @click="colorActive = index"
                                    v-for="(color, index) in colors"
                                    :style="`background-color: ${color};`"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <div
                            class="w-14 h-14 bg-third rounded-full flex items-center justify-center cursor-pointer add-btn"
                            @click="updateTask"
                        >
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20 10L20 30"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M30 20L10 20"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<style scoped>
.add-btn {
    box-shadow: 0px 4px 20px rgba(235, 6, 255, 0.3);
}
.modal-enter-active {
    animation: bounce-in 0.35s ease-out both;
}
.modal-leave-active {
    animation: bounce-in 0.4s ease-out both reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0.2);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
</style>