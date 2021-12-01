<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import NavbarMenu from "./components/NavbarMenu.vue";
import AddButton from "./components/AddButton.vue";
import { reactive, ref, onMounted } from 'vue';

const name = ref(localStorage.getItem('name') || null)
onMounted(() => {
	if (!name.value) {
		while (true) {
			const newName = prompt('Insert your name to continue : ')
			if (newName && newName.trim()) {
				localStorage.setItem('name', newName)
				name.value = newName
				break
			}
		}
	}
})
const items = reactive(JSON.parse(localStorage.getItem('items') || '[]'))
const pushItems = (data) => {
	items.unshift(data)
	localStorage.setItem('items', JSON.stringify(items))
}
const finished = (i) => {
	items[i].isFinished = items[i].isFinished ? false : true
	localStorage.setItem('items', JSON.stringify(items))
}
let xOffset = 0
let dragged = ref(null)
const deleteTask = (i) => {
	items.splice(i, 1)
	localStorage.setItem('items', JSON.stringify(items))
	todoItems[i].style.transform = `translateX(0)`
	dragged.value = null
}
const touchStart = (e) => {
	const todoItems = document.querySelectorAll('#todoItem')
	e = e.changedTouches ? e.changedTouches[0] : e;
	xOffset = e.clientX
	todoItems.forEach((item) => item.style.transform = `translateX(0px)`)
	dragged.value = null
}
const touchMove = (i, e) => {
	const todoItem = document.querySelectorAll('#todoItem')[i]
	e = e.changedTouches ? e.changedTouches[0] : e;
	const xDiff = xOffset - e.clientX
	if (xDiff > 40) {
		todoItem.style.transform = `translateX(-3rem)`
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
				<div
					@touchmove="touchMove(index, $event)"
					@touchstart="touchStart"
					v-for="(item, index) in items"
					class="relative"
				>
					<div
						class="bg-primary rounded-2xl py-4 px-3 mb-3 shadow-md hover:shadow-2xl transform transition"
						id="todoItem"
						:class="{ '-translate-x-12': dragged == index }"
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
					<div v-if="dragged == index" class="absolute top-3 right-1" @click="deleteTask(index)">
						<svg
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
