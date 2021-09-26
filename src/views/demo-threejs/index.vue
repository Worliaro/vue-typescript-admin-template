<template>
  <div class="threejs-demo-container">
    <div class="threejs-demo-body">
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'ThreeJSDemoList'
})
export default class extends Vue {
  private routeOptions = [
    {
      key: 'ThreejsDemo01',
      path: '/threejsDemo/demolist/demo01',
      label: 'demo01'
    },
    {
      key: 'ThreejsDemo02',
      path: '/threejsDemo/demolist/demo02',
      label: 'demo02'
    },
    {
      key: 'ThreejsDemo03',
      path: '/threejsDemo/demolist/demo03',
      label: 'demo03'
    }
  ];
}
</script>
<style lang="scss" scoped>
.threejs-demo-container {
  padding: 15px;
  background-color: RGB(240, 241, 245);
  height: 100vh;
  .threejs-demo-body {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: RGB(255, 255, 255);
    .demo-list-area {
      width: 150px;
      height: 100%;
      .route-demo-item {
        color: RGB(24, 144, 255);
        height: 32px;
        line-height: 32px;
        display: block;
        margin: 10px;
        margin-right: 0px;

        .route-label{
          text-align: center;
          border-radius: 4px;
          &:hover {
            cursor: pointer;
            background-color: RGB(8, 68, 131);
            color: RGB(255, 255, 255);
            font-weight: bold;
          }
        }
      }
      .router-link-active{
        .route-label{
          background-color: RGB(8, 68, 131);
          color: RGB(255, 255, 255);
          font-weight: bold;
        }
      }

    }
    .demo-display-area {
      flex: 1;
      height: 100%;
      padding: 10px;
      .threejs-area {
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
      }
    }
  }
}
</style>
