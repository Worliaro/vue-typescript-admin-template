<template>
  <div class="threejs-demo-container">
    <div class="threejs-demo-body">
      <div class="demo-layout">
        <div class="demo-list-area">
          <router-link
            v-for="item in routeOptions"
            :key="item.key"
            :to="item.path"
            class="route-demo-item"
            exact
          >
            <div class="route-label">
              {{ item.label }}
            </div>
          </router-link>
        </div>
        <div class="demo-display-area">
          <div class="threejs-area">
            <transition name="fade-transform" mode="out-in">
              <keep-alive>
                <router-view />
              </keep-alive>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'MyThreejsDemosHomeDemo01'
})
export default class extends Vue {
  private routeOptions = [
    {
      key: 'MyThreejsDemosHomeDemo01',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo01',
      label: 'demo01'
    },
    {
      key: 'MyThreejsDemosHomeDemo02',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo02',
      label: 'demo02'
    },
    {
      key: 'MyThreejsDemosHomeDemo03',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo03',
      label: 'demo03'
    },
    {
      key: 'MyThreejsDemosHomeDemo04',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo04',
      label: 'demo04'
    },
    {
      key: 'MyThreejsDemosHomeDemo05',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo05',
      label: 'demo05'
    },
    {
      key: 'MyThreejsDemosHomeDemo06',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo06',
      label: 'demo06'
    },
    {
      key: 'MyThreejsDemosHomeDemo07',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo07',
      label: 'demo07'
    },
    {
      key: 'MyThreejsDemosHomeDemo08',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo08',
      label: 'demo08'
    },
    {
      key: 'MyThreejsDemosHomeDemo09',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo09',
      label: 'demo09'
    },
    {
      key: 'MyThreejsDemosHomeDemo10',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo10',
      label: 'demo10'
    },
    {
      key: 'MyThreejsDemosHomeDemo11',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo11',
      label: 'demo11'
    },
    {
      key: 'MyThreejsDemosHomeDemo12',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo12',
      label: 'demo12'
    },
    {
      key: 'MyThreejsDemosHomeDemo13',
      path: '/MyThreejsDemos/MyThreejsDemosHome/MyThreejsDemosHomeDemo13',
      label: 'demo13'
    }
  ]
}
</script>
<style lang="scss" scoped>
.threejs-demo-container {
  padding: 30px;
  background-color: RGB(240, 241, 245);
  width: 100%;
  height: 100vh;
  .threejs-demo-body {
    width: 100%;
    height: 100%;
    background-color: RGB(255, 255, 255);
    padding: 30px;
    box-shadow: 0px 0px 5px 2px lightgrey;
    .demo-layout {
      width: 100%;
      height: 100%;
      border: 1px solid lightgray;
      .demo-list-area {
        width: 150px;
        float: left;
        .route-demo-item {
          color: RGB(24, 144, 255);
          height: 32px;
          line-height: 32px;
          display: block;
          margin: 10px;

          .route-label {
            text-align: center;
            border-radius: 0px;
            &:hover {
              cursor: pointer;
              background-color: RGB(8, 68, 131);
              color: RGB(255, 255, 255);
              font-weight: bold;
            }
          }
        }
        .router-link-active {
          .route-label {
            background-color: RGB(8, 68, 131);
            color: RGB(255, 255, 255);
            font-weight: bold;
          }
        }
      }
      .demo-display-area {
        height: 100%;
        margin-left: 150px;
        // overflow: hidden;
        padding: 10px;
        position: relative;
        .threejs-area {
          height: 100%;
          width: 100%;
          margin: 0px;
          padding: 0px;
        }
        &::after {
          position: absolute;
          top: 50%;
          left: 0px;
          content: '';
          border-right: 1px solid lightgray;
          height: 100%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
