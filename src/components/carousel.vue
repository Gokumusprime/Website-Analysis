<template>
	<div class="col-12" v-if="!(listEmpty)" style="transition: all .3s ease-in-out;">
		<div class="row">
			<h4 class="col-12 mb-3">List of all images on the page:</h4>
			<div style="max-height: 16rem; overflow-y: scroll; overflow-x: hidden; border: 1px solid gray;" class="col-12 mb-3 image-list list-group">
				<a class="list-group-item" target="_blank" style="display: block; color: #ca4a05 !important; width: 104%;" v-for="image in imgSrcList" v-bind:href="image">{{image}}</a>
			</div>
			<h4 class="col-12 mb-3">Carousel of all images on the page:</h4>
			<VueSlickCarousel class="col-12 px-5 mb-3 image-carousel" v-bind="settings">
				<img v-for="image in imgSrcList" class="img-fluid" v-bind:src="image" />
			</VueSlickCarousel >
		</div>
	</div>
	<div v-else style="margin-top: -2em; transition: all .8s ease-in-out;">
		<span style="color: red;">{{errorReason}}</span>
	</div>
</template>

<script>
	import VueSlickCarousel from 'vue-slick-carousel'
	import 'vue-slick-carousel/dist/vue-slick-carousel.css'
	// optional style for arrows & dots
	import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
	import '../assets/css/slick-slider.css'

	export default {
		name: 'Carousel',
		props: ['newSearch'],
		data() {
			return {
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					autoplay: true,
					autoplaySpeed: 2000,
					variableWidth: false,
					adaptiveHeight: false,
					arrows: true,
					dots: false
				},
				imgSrcList: [],
				listEmpty: true,
				errorReason: ""
			}
		},
		methods: {
			async getImages(url) {
				// Retrieves remote website content via a proxy
				this.listEmpty = true
				this.imgSrcList = []
				
				// Attempts to retrieve data from remote website via a proxy
				try {
					await fetch('https://corsproxy.io/?' + encodeURIComponent(url)).then(res => res.text()).then((responseText) => {
						
						// Establish variables
						const doc = new DOMParser().parseFromString(responseText, 'text/html')
						const elm = doc.querySelector('body')
						let domain = (new URL(url))
						let newURL = "https://" + domain.hostname
						let imgs = elm.querySelectorAll('img')
						
						// Loop through all images found and push them to a new array
						for (var i = 0; i < imgs.length; i++) {
							this.imgSrcList.push(newURL + imgs[i].src.replace(window.location.href,'/'))
						}
						
						// If new image array is empty, remove component
						if (this.imgSrcList.length > -1){
							this.listEmpty = false
						}
					})
				}
				catch(error) {
					// If a CORS error is caught, remove component and reset arrays to empty.  Produce reason to view
					this.listEmpty = true
					this.imgSrcList = []
					this.errorReason = "*This url has super secret squirrel CORS policies.  Please try another."
				}
			}
		},
		components: {
			VueSlickCarousel
		},
		watch: {
			newSearch: function() {
				// listen for passed data from parent component then run method again
				this.listEmpty = true
				this.imgSrcList = []
				let newUrl = this.newSearch
				this.getImages(newUrl)
			}
		}
	}
</script>