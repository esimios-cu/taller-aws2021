import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
	it('renders props.msg when passed', () => {
		const msg = 'new message'
		const wrapper = shallowMount(HelloWorld, {
			propsData: { msg }
		})
		console.log('wrapper', wrapper)
		console.log('wrapper.text()', wrapper.text())
		expect(wrapper.text()).toMatch(msg)
	})
})
