import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ActionButtons from '@/components/ActionButtons.vue'
import p2p from '@/store/modules/p2p'


const localVue = createLocalVue()
localVue.use(Vuex)

describe('ActionButtons', () => {
  let actions
  let store
  let nuxtInst

  beforeEach(() => {
    actions = {
      camStreamAction: jest.fn(),
      screenStreamAction: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        p2p
      },
      actions: {
        camStreamAction: jest.fn(() => true)
      }
    })
    nuxtInst = {
      store, localVue,
      stubs: ['b-tooltip', 'b-icon']
    };
  })

  test('Check component', () => {
    const wrapper = shallow(ActionButtons, nuxtInst)

    expect(wrapper.findAll("b-button").length === 5).toBeTruthy()
  })

  test('Check video button', async () => {
    const wrapper = shallow(ActionButtons, nuxtInst)

    expect(wrapper.vm.videoState).toBeFalsy()
    await wrapper.findAll("b-button").wrappers[1].trigger("click");
    // expect(wrapper.vm.videoState).toBeTruthy()
  })

  test('Check audio button', async () => {
    const wrapper = shallow(ActionButtons, nuxtInst)

    expect(wrapper.vm.audioState).toBeFalsy()
    await wrapper.findAll("b-button").wrappers[2].trigger("click");
    expect(wrapper.vm.audioState).toBeTruthy()
  })
})
