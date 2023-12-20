<template>
  <div class="row p-3" style="box-shadow: inset 0 -3em 3em #ebe5e5, 0 0 0 2px #ebe5e5, 0.3em 0.3em 1em #ebe5e5; min-height: 40vw;">
		<div class="col-12">
			<div class="row mb-3">
				<div class="col-12">
					<h1>The Website Image/Word Analysis Dashboard</h1>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-12">
					<div class="row pb-sm-1">
						<label class="col-xs-12 mb-1">Please type in any URL to analyze the images used and word count. (Some images may contain broken links)</label>
						<div class="col-12 col-sm-9 mt-2 mb-2 mb-sm-3">
							<input v-model="searchText" class="form-control" type="text" value="" placeholder="Example: https://www.neb.com/en-us/">
						</div>
						<div class="col-12 col-sm-3 mt-2 mb-2 mb-sm-3">
							<button style="width: 100%;" type="button" class="btn btn-primary" @click="updateSearch()">Analyze Website</button>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<div class="row">
						<VueSlickCarousel :newSearch="searchData"></VueSlickCarousel>
						<BarChart :newSearch="searchData"></BarChart>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import VueSlickCarousel from './carousel.vue'
	import BarChart  from './chart.vue'
	export default {
		name: 'Dashboard',
		components: {
			VueSlickCarousel,
			BarChart
		},
		props: ['searchTextHolder'],
		data() {
			return {
				searchText: this.searchTextHolder,
				searchData: ""
			}
		},
		methods: {
			updateSearch(){
				document.querySelectorAll('carousel-player').innerHTML = ""
				document.querySelectorAll('chart').innerHTML = ""
				this.renderComponent = true
				this.SearchData = ""
				this.searchData = this.searchText
			}
		}
	}
</script>