<template>
	<div class="col-12" v-if="loaded" >
		<h4 class="mb-3">Graph Analysis of words on the page:</h4>
		<Bar id="my-chart-id" :options="options" :data="data"></Bar>
	</div>
</template>

<script>
	import { Bar } from 'vue-chartjs'
	import { Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'
	
	ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale)
	
	export default {
		name: 'BarChart',
		components: { Bar },
		props: ['newSearch'],
		data() {
			return {
				data: {
					labels: [],
					datasets: [ { data: [] } ]
				},
				options: {
					plugins: {
						responsive: true,
						title: {
							display: true,
							text: ""
						}
					}
				},
				loaded: false
			}
		},

		methods: {
			async getWords(url) {
				try {
					// Remove old interface data and set visibility off till a new cache is received
					this.loaded = false
					this.data.labels = []
					this.data.datasets = []
					
					// Retrieves remote website content via a proxy
					await fetch('https://corsproxy.io/?' + encodeURIComponent(url)).then(res => res.text()).then((responseText) => {
						// Establish variables
						const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
						const noScriptRegex = /<noscript\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/noscript>/gi
						let doc = new DOMParser().parseFromString(responseText, 'text/html')
						let elm = doc.querySelector('body')
						// Clean textcontent
						let elmInners = elm.innerHTML.replace(scriptRegex,"").replace(noScriptRegex,"").replace("  "," ").replace("&nbsp;","")
						elm.innerHTML = elmInners
						let input = elm.textContent
						let counters = {}
						
						input.toLowerCase().split(' ')
						// remove strings that aren't words
						.map(x => x.replace(/\W/g, ''))
						// count number of occurences of each word
						.forEach(x => counters[x] = (counters[x] || 0) + 1)						
						
						// sort occurences
						let byOccurence = Object.entries(counters).sort((a, b) => b[1] - a[1])
						
						// get top 7 words
						let topResults = byOccurence.slice(0, 8).map(([word, times]) => `${word} ${times}\n`).join(',')
						this.dataEmpty = false
						
						// take payload array and load needed values for chart arrays
						let removeCarriagesArray = topResults.replace(/[\n]+/g, '')
						let convertedTopResults = removeCarriagesArray.split(',')
						let totalCount = convertedTopResults[0].replace(' ','')
						convertedTopResults.shift()
						
						// Take payload and split into usable parts to fill chart arrays
						for (var i = 0; i < convertedTopResults.length; i++) {
							let newArray = convertedTopResults[i].split(' ')
							let newWord = newArray[0]
							let newOccurence = newArray[1]
							this.data.labels.push(newWord.toString())
							this.data.datasets.push(parseInt(newOccurence))
						}
						
						// set new chart data and show change
						this.data.datasets = [ { data: this.data.datasets } ]
						this.options.plugins.title.text = 'Below is the top 7 words that appear on this page while the total count of relevant words on the page is ' + parseInt(byOccurence.length)
						this.submitData()
					})
				}
				catch(error) {
					// Error message not needed here since it is taken care of in the carousel component
					this.loaded = false
					this.data.labels = []
					this.data.datasets = []
				}
			},
			submitData() {
				// Makes new chart visible
				this.loaded = true
			}
		},
		watch: {
			newSearch: function() {
				// listen for passed data from parent component then run method again
				let newUrl = this.newSearch
				this.getWords(newUrl)
			}
		}
	}
</script>