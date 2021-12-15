<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import NavbarMenu from "./components/NavbarMenu.vue";
import AddButton from "./components/AddButton.vue";
import { ref, onMounted, computed, reactive } from 'vue';
import { useStore } from "vuex";
import ListItemEdit from "./components/ListItemEdit.vue";

const store = useStore()
const name = ref(localStorage.getItem('todo-app__name') || null)
onMounted(() => {
	if (!name.value) {
		while (true) {
			const newName = prompt('Insert your name to continue : ')
			if (newName && newName.trim()) {
				localStorage.setItem('todo-app__name', newName)
				name.value = newName
				break
			}
		}
	}
})
const items = computed(() => store.state.lists)
const pushItems = (data) => {
	store.commit('PUSH_LIST', data)
}
const finished = (i) => {
	store.commit('SET_FINISH_LIST', i)
}
const editTask = (item, index) => {
	editItem.item = item
	editItem.index = index
	editItem.isEdit = true
	// store.commit('SET_FINISH_LIST', i)
}
const editItem = reactive({
	isEdit: false,
	index: 0,
	item: {}
})
const deleteTask = (i) => {
	store.commit('DELETE_LIST', i)
	dragged.value = null
	const todoItems = document.querySelectorAll('#todoItem')
	todoItems.forEach((item) => item.style.transform = `translateX(0px)`)
}
let xOffset = 0
let dragged = ref(null)
const touchStart = (e) => {
	const todoItems = document.querySelectorAll('#todoItem')
	todoItems.forEach((item) => item.style.transform = `translateX(0px)`)
	e = e.changedTouches ? e.changedTouches[0] : e;
	xOffset = e.clientX
	dragged.value = null
}

const touchMove = (i, e) => {
	const todoItem = document.querySelectorAll('#todoItem')[i]
	e = e.changedTouches ? e.changedTouches[0] : e;
	const xDiff = xOffset - e.clientX
	if (xDiff > 40) {
		todoItem.style.transform = `translateX(-4rem)`
		dragged.value = i
	} else {
		todoItem.style.transform = `translateX(0)`
		dragged.value = null
	}

}
</script>

<template>
	<div class="min-h-screen min-w-screen px-4 relative md:flex md:justify-end md:p-0">
		<NavbarMenu />
		<div class="flex flex-col md:w-7/12 lg:w-8/12 md:px-6">
			<div class="text-3xl font-bold pt-5 pb-2 font-head">
				What’s up,
				<span class="text-capitalize">{{ name }}</span>
			</div>
			<div class="text-text-color text-sm">Manage your task manager here.</div>
			<div class="mt-8">
				<div class="text-text-color uppercase tracking-wider font-semibold text-sm mb-3">Today’s tasks</div>
				<!-- Task list -->
				<div v-for="(item, index) in items" class="relative transform transition">
					<div
						class="bg-primary rounded-2xl py-4 px-3 mb-3 shadow-md hover:shadow-2xl transform transition lg:w-11/12"
						id="todoItem"
						@touchmove="touchMove(index, $event)"
						@touchstart="touchStart"
					>
						<div class="flex items-center w-full">
							<div class="ml-1 mr-3 cursor-pointer" @click="finished(index)">
								<div
									v-if="item.isFinished"
									class="rounded-full w-6 h-6 flex items-center justify-center bg-secondary"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M3.63636 10.909L7.91669 14.5833L15 6.81812" stroke="white" stroke-width="2" />
									</svg>
								</div>
								<div v-else :class="`border-2 rounded-full w-6 h-6`" :style="`border-color: ${item.color}`"></div>
							</div>
							<div
								class="cursor-pointer text-sm"
								@click="finished(index)"
								:class="{ 'line-through': item.isFinished }"
							>{{ item.title }}</div>
						</div>
					</div>
					<div
						:class="{ 'hidden lg:flex': dragged != index }"
						class="absolute top-3 right-0 z-10 cursor-pointer flex"
					>
						<svg
							@click="editTask(item, index)"
							class="ml-1 cursor-pointer"
							width="30"
							height="30"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8.64645 4.64645L4.03816 9.25473C4.02714 9.26575 4.0162 9.27668 4.00533 9.28752C3.84286 9.44965 3.69903 9.59317 3.59767 9.7722C3.4963 9.95123 3.44723 10.1484 3.3918 10.3711C3.38809 10.386 3.38436 10.401 3.38057 10.4162L3.05038 11.7369C3.04816 11.7458 3.04593 11.7547 3.04369 11.7636C3.00445 11.9203 2.96254 12.0877 2.9488 12.2282C2.93366 12.3829 2.93719 12.644 3.1466 12.8534C3.35601 13.0628 3.61706 13.0663 3.7718 13.0512C3.91233 13.0375 4.07967 12.9955 4.23636 12.9563C4.2453 12.9541 4.2542 12.9518 4.26306 12.9496L5.58384 12.6194C5.59896 12.6156 5.61397 12.6119 5.62886 12.6082C5.8516 12.5528 6.04877 12.5037 6.2278 12.4023C6.40683 12.301 6.55036 12.1571 6.71248 11.9947C6.72332 11.9838 6.73425 11.9729 6.74527 11.9618L11.3536 7.35355C11.3701 7.33701 11.3865 7.32065 11.4027 7.30446C11.6262 7.08162 11.8194 6.88892 11.9298 6.66602C12.1378 6.24636 12.1378 5.75364 11.9298 5.33398C11.8194 5.11108 11.6262 4.91838 11.4027 4.69554C11.3865 4.67935 11.3701 4.66299 11.3536 4.64645C11.337 4.62991 11.3207 4.61351 11.3045 4.59727C11.0816 4.37384 10.8889 4.18064 10.666 4.07018C10.2464 3.86222 9.75364 3.86222 9.33398 4.07018C9.11108 4.18064 8.91838 4.37384 8.69554 4.59727C8.67934 4.61351 8.66299 4.62991 8.64645 4.64645Z"
								stroke="#CCD2E3"
							/>
							<path
								d="M8.33334 5.00002L10.3333 3.66669L12.3333 5.66669L11 7.66669L8.33334 5.00002Z"
								fill="#CCD2E3"
							/>
						</svg>
						<svg
							@click="deleteTask(index)"
							width="30"
							height="30"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M10 15L10 12" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round" />
							<path d="M14 15L14 12" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round" />
							<path
								d="M3 7H21V7C20.0681 7 19.6022 7 19.2346 7.15224C18.7446 7.35523 18.3552 7.74458 18.1522 8.23463C18 8.60218 18 9.06812 18 10V16C18 17.8856 18 18.8284 17.4142 19.4142C16.8284 20 15.8856 20 14 20H10C8.11438 20 7.17157 20 6.58579 19.4142C6 18.8284 6 17.8856 6 16V10C6 9.06812 6 8.60218 5.84776 8.23463C5.64477 7.74458 5.25542 7.35523 4.76537 7.15224C4.39782 7 3.93188 7 3 7V7Z"
								stroke="#CCD2E3"
								stroke-width="2"
								stroke-linecap="round"
							/>
							<path
								d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059"
								stroke="#CCD2E3"
								stroke-width="2"
								stroke-linecap="round"
							/>
						</svg>
					</div>
				</div>
				<div v-if="!items.length" class="text-center text-text-color">You don't have task :(</div>
			</div>
		</div>

		<!-- Add Button -->
		<AddButton @push-items="pushItems" />
		<ListItemEdit
			:active="editItem.isEdit"
			:item="editItem.item"
			:index="editItem.index"
			@close="editItem.isEdit = false"
		/>
	</div>
</template>

<style>
#app {
	font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	@apply bg-secondary text-white;
}
</style>