<!-- eslint-disable no-unused-vars -->
<template>
  <div id="app">
    <div class="flex-line">
      <van-button ref="vanBtn">Van Button</van-button>
      <atom-button>Atom Button</atom-button>
      <atom-tooltip v-model="showTooltip" content="文案">
        <template #reference>
          <atom-button type="primary">Tooltip</atom-button>
        </template>
      </atom-tooltip>
    </div>

    <atom-cell is-link title="基础用法" @click="show = true" />

    <atom-bottom-sheet v-model="show" :title="title" :description="description" />

    <div class="box-parent" v-text-fit>
      <div class="child">
        <p class="text">{{ text }}</p>
      </div>
      <div class="child">
        <p class="text">{{ text }}</p>
      </div>
      <div class="child">
        <p class="text">{{ text }}</p>
      </div>
    </div>

  <!-- <div class="exposure-test">
      <div class="top" v-exposure="handleTop">top</div>
      <div class="middle" v-exposure:[0.05]="handleMiddle">middle</div>
      <div class="bottom" v-exposure="handleBottom">bottom</div>
      </div> -->
  </div>
</template>

<script>
import '@exposure-lib/polyfill'
import { createExposure } from '@exposure-lib/core'

// function resizeText(el, binding) {
//   const parent = el.parentElement;
//   const padding = parseInt(window.getComputedStyle(parent).paddingLeft, 10);
//   const maxWidth = parent.clientWidth - padding * 2;

//   let step = 2;
//   let size = 18;
//   let gate = 10;
//   let unit = binding?.value?.unit || 'px';

//   if (binding.value && binding.value.base) {
//     if (binding.value.base === 750) {
//       size = 0.36;
//       step = 0.04;
//       gate = 0.2;
//     }
//     if (binding.value.base === 375) {
//       size = 0.18;
//       step = 0.02;
//       gate = 0.1;
//     }
//   }

//   el.style.fontSize = `${size}${unit}`;

//   while (el.offsetWidth >= maxWidth && size > gate) {
//     size -= step;

//     el.style.fontSize = `${size}${unit}`;
//   }
// }

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      showTooltip: false,
      show: false,
      title: '标题',
      description: '描述',
      handleBottom: {
        enter() {
          console.log('bottom enter');
        },
        leave() {
          console.log('bottom leave');
        }
      },
      text: '我是一个文本我是一个文本我是一个文本'
    }
  },
  methods: {
    handleMiddle() {
      alert('middle');
    },
    handleTop() {
      alert('top');
    },
  },
  mounted() {
    const exposure = createExposure();
    const vanBtn = this.$refs.vanBtn;
    exposure.observe(vanBtn, () => {
      console.log('exposure')
    });

    setTimeout(() => {
      this.text = '我是文本';
    }, 2000);
  },
  directives: {
    'text-fit': {
      inserted(el) {
        console.log(el);
        // console.log(binding);
        // resizeText(el, binding);
      },
      // componentUpdated(el, binding) {
        // resizeText(el, binding);
      // }
    }
  }
}
</script>

<style>
#app {
  box-sizing: border-box;
  padding: 16px;
  background-color: #f5f5f5;
  height: 100vh;
}

.flex-line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.atom-button {
  margin-left: 10px;
}

.top {
  background: red;
  margin-bottom: 1000px;
}

.middle {
  background: yellowgreen;
}

.bottom {
  background: blue;
  margin-top: 1000px;
}

.atom-tooltip__wrapper {
  display: inline-flex;
}

.box-parent {
  width: 200px;
  height: 200px;
  background: green;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 10px;
}

.text {
  color: white;
  font-size: 18px;
}
</style>
