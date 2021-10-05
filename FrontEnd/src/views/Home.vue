<template>
	<div class="h100">
		<div class="container">
			<div class="with70">
				<GmapMap ref="mapRef" :center="center" :zoom="zoom" class="h100 w100">
					<GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="false" :draggable="true" @click="center = m.position" />
				</GmapMap>
			</div>
			<div class="with30">
				<div class="m10">
					<div class="text-right">Bienvenido {{ userData.name }}<br /><a href="#" @click="doSignOut()">Cerrar sesión</a></div>
					<img class="logo" src="@/assets/logoEsime.png" />
					<h3>Taller "Prácticas de seguridad en el desarrollo de microservicios en AWS"</h3>
					<div class="separation">
						<button v-if="!makingPolygon" @click="makePolygon">Hacer nueva zona</button>
						<div class="warning" v-if="pointsOfPolygon.length == 0 && makingPolygon && polygon && polygon.getPaths().length === 0">
							Debe hacer varios clicks sobre el mapa para delimitar la zona a crear. Al terminar el poligono se iluminará, agregue un nombre y seleccione el botón de "Agregar Zona" para almacenarlo.
						</div>
						<div v-if="makingPolygon">
							<form @submit.prevent="onAddZone">
								<input v-model="zoneName" required="true" placeholder="Nombre de la zona" />
								<select required class="text-center" v-model="typeZone">
									<option value="">Tipo de zona</option>
									<option value="private">Privada</option>
									<option value="public">Pública</option>
								</select>
								<pulse-loader class="m10" v-if="loaders.addingZone"></pulse-loader>
								<button v-show="!loaders.addingZone" :disabled="polygon.getPaths().length === 0" type="submit">Agregar zona</button>
								<button v-show="!loaders.addingZone" type="reset" @click="cancelAddZone">Cancelar</button>
							</form>

							<div class="error" v-if="errors.addZone">{{ errors.addZone }}</div>
						</div>
					</div>
					<div class="separation">
						<select :disabled="makingPolygon" class="text-center" v-model="selectedZone" @change="changeSelectZone">
							<option value="">Seleccione una zona</option>
							<option v-for="zone in zones" :value="zone" :key="zone.idZone">{{ zone.name }} ({{ zone.typePolygon }})</option>
						</select>
						<pulse-loader v-if="loaders.loadingZones"></pulse-loader>
						<div class="error" v-if="errors.loadZones">{{ errors.loadZones }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import { mapActions, mapState } from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
	name: 'Home',
	computed: {
		...mapState({ userData: state => state.userData }),
		google: gmapApi
	},
	data() {
		return {
			typeZone: '',
			selectedZone: '',
			zones: [
				{
					'name': 'Esime',
					'typePolygon': 'private',
					'polygon': [
						{ 'lat': 19.331422865974794, 'lng': -99.11288456945037 },
						{ 'lat': 19.329651166970827, 'lng': -99.11394672422027 },
						{ 'lat': 19.328659007134387, 'lng': -99.11079244641876 },
						{ 'lat': 19.329641042921292, 'lng': -99.10968737630462 },
						{ 'lat': 19.331271006813214, 'lng': -99.10988049535369 },
						{ 'lat': 19.331878442612364, 'lng': -99.11110358266448 }
					]
				}
			],
			center: { lat: 19.32874, lng: -99.112096 },
			markers: [],
			map: null,
			zoom: 17,
			pointsOfPolygon: [],
			polyline: null,
			polygon: null,
			makingPolygon: false,
			zoneName: '',
			loaders: {
				addingZone: false,
				loadingZones: false
			},
			errors: {
				addZone: '',
				loadZones: ''
			}
		}
	},
	components: {
		PulseLoader
	},
	async mounted() {
		this.loadZones()
		this.$refs.mapRef.$mapPromise.then(map => {
			this.map = map
			window.map = map
			window.google.gmapApi
			this.map.setClickableIcons(false)
			this.map.addListener('click', this.clickOnMap)
			this.polyline = new google.maps.Polyline({
				path: this.pointsOfPolygon,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			})
			this.polygon = new google.maps.Polygon({
				paths: [],
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35
			})
			window.polygon = this.polygon
			this.polyline.setMap(this.map)
			this.polygon.setMap(this.map)
		})
	},
	methods: {
		...mapActions(['logout', 'getZones', 'addZone']),
		cleanPolygon() {
			this.pointsOfPolygon = []
			this.polyline.setPath(this.pointsOfPolygon)
			this.polygon.setPaths(this.pointsOfPolygon)
		},
		cancelAddZone() {
			this.cleanPolygon()
			this.makingPolygon = false
			this.errors.addZone = ''
			this.zoneName = ''
			this.typeZone = ''
		},
		async loadZones() {
			this.loadZones = true
			this.errors.loadZones = ''
			this.loaders.loadingZones = true
			try {
				const resultZones = await this.getZones()
				this.loadZones = false
				const result = resultZones && resultZones.data ? resultZones.data : []
				const zones = (result.globalPolygons || []).concat(result.userPolygons || []).map(item => {
					item.typePolygon = item.userId === 'globals' ? 'Público' : 'Personal'
					return item
				})
				this.zones = zones
			} catch (err) {
				this.loadZones = false
				this.errors.loadZones = err.message || 'Error al agregar la zona'
				console.error(err)
			} finally {
				this.loaders.loadingZones = false
			}
		},
		async onAddZone() {
			const dataset = {
				name: this.zoneName,
				typePolygon: this.typeZone,
				polygon: this.polygon
					.getPath()
					.getArray()
					.map(item => {
						return { lat: item.lat(), lng: item.lng() }
					})
			}
			this.errors.addZone = ''
			this.loaders.addingZone = true
			try {
				const result = await this.addZone(dataset)
				this.zones.push(dataset)
				this.zoneName = ''
				this.typeZone = ''
				this.makingPolygon = false
				this.errors.addZone = ''
				this.cleanPolygon()
			} catch (err) {
				this.errors.addZone = err.message || 'Error al agregar la zona'
			} finally {
				this.loaders.addingZone = false
			}
		},
		async doSignOut() {
			const result = await this.logout()
			this.$router.push('/login')
		},
		makePolygon() {
			this.makingPolygon = true
			this.cleanPolygon()
		},
		changeSelectZone() {
			console.log('selectedZone', this.selectedZone)
			this.cleanPolygon()
			if (this.selectedZone) {
				const bounds = new google.maps.LatLngBounds()
				this.selectedZone.polygon.forEach(function (element, index) {
					bounds.extend(element)
				})
				this.map.setCenter(bounds.getCenter())

				this.polygon.setPath(this.selectedZone.polygon)
			}
		},
		clickOnMap(event) {
			if (!this.makingPolygon) {
				return false
			}
			const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() }
			if (this.pointsOfPolygon.length == 0) {
				this.polygon.setPaths([])
			} else if (this.pointsOfPolygon.length > 1) {
				const lastPoint = this.pointsOfPolygon[0]
				const distance = Math.sqrt(Math.pow(lastPoint.lat - latLng.lat, 2) + Math.pow(lastPoint.lng - latLng.lng, 2))
				const distanceMinForClose = Math.exp(-(0.5 * (this.map.getZoom() - 1)))
				if (distance <= distanceMinForClose) {
					this.polygon.setPaths(this.pointsOfPolygon)
					this.pointsOfPolygon = []
					return
				}
			}
			this.pointsOfPolygon.push(latLng)
			this.polyline.setPath(this.pointsOfPolygon)
		}
	}
}
</script>
<style scoped>
.container {
	display: flex;
	height: 100%;
}
.with70 {
	width: 70%;
	height: 100%;
}
.w50 {
	width: 50%;
}
.with30 {
	width: 30%;
	height: 100%;
}
.logo {
	width: 60%;
}
a {
	color: grey;
}
select,
input,
button {
	width: 90%;
	height: 30px;
	border-radius: 0px;
	margin-top: 5px;
	margin-bottom: 5px;
}
.separation {
	border-top: 1px solid #eaeaea;
	padding-top: 5px;
	padding-bottom: 10px;
}

.warning {
	color: red;
	background: wheat;
	padding: 5px;
	font-weight: 500;
}
</style>
