import Vue from 'vue'

Vue.config.devtools = false
Vue.config.productionTip = false

interface DemoUI extends Vue {
  // Data
  input: string
  // Computed
  output: string
  // Method
  process: (data: string) => string
}

const UI = Vue.extend({
  render (this: DemoUI, h) {
    return h('div', [
      h('input', { attrs: { placeholder: 'Input something here' }, domProps: { value: this.input }, on: { input: (ev: Event) => { this.input = (ev.target as HTMLInputElement).value } } }),
      h('p', ['Output: ', this.output])
    ])
  },
  data () {
    return {
      input: 'awsl'
    }
  },
  computed: {
    output (this: DemoUI) {
      return this.process(this.input)
    }
  },
  methods: {
    process (data: string) {
      return Buffer.from(data).toString('hex')
    }
  }
})

const mount = (el: HTMLElement) => new UI({ el })

mount(document.getElementById('wrapper'))
