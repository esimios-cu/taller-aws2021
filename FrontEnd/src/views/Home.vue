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
								<button :disabled="polygon.getPaths().length === 0" type="submit">Agregar zona</button>
								<button type="reset" @click="cancelAddZone">Cancelar</button>
							</form>
						</div>
					</div>
					<div class="separation">
						<select :disabled="makingPolygon" class="text-center" v-model="selectedZone" @change="changeSelectZone">
							<option value="">Seleccione una zona</option>
							<option v-for="zone in zones" :value="zone.name" :key="zone.idZone">
								{{ zone.name }}
							</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import { mapActions, mapState } from 'vuex'

export default {
	name: 'Home',
	// components([GmapMap,GmapMarker]),
	computed: {
		...mapState({ userData: state => state.userData }),
		google: gmapApi
	},
	data() {
		return {
			selectedZone: '',
			zones: [{ name: 'Zona 1', polygon: [] }],
			center: { lat: 19.32874, lng: -99.112096 },
			markers: [],
			map: null,
			zoom: 17,
			pointsOfPolygon: [],
			polyline: null,
			polygon: null,
			makingPolygon: false,
			zoneName: ''
		}
	},
	components: {},
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
			this.polyline.setMap(this.map)
			this.polygon.setMap(this.map)
		})
	},
	methods: {
		...mapActions(['logout', 'getAllZones', 'addZone']),
		cleanPolygon() {
			this.pointsOfPolygon = []
			this.polyline.setPath(this.pointsOfPolygon)
			this.polygon.setPaths(this.pointsOfPolygon)
		},
		cancelAddZone() {
			this.cleanPolygon()
			this.makingPolygon = false
		},
		async loadZones() {
			try {
				const resultZones = await this.getAllZones()
				this.zones = resultZones.data
			} catch (err) {
				console.error(err)
			}
		},
		onAddZone() {
			const dataset = {
				name: this.zoneName,
				polygon: this.polygon
					.getPath()
					.getArray()
					.map(item => {
						return { lat: item.lat(), lng: item.lng() }
					})
			}
			this.addZone(dataset)
		},
		async doSignOut() {
			const result = await this.logout()
			this.$router.push('/login')
		},
		makePolygon() {
			this.makingPolygon = true
		},
		changeSelectZone() {
			console.log('selectedZone', this.selectedZone)
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
				console.log('distance', distance)
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
