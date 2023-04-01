<script lang="ts">
export default {name: 'Dashboard'};
</script>

<script setup lang="ts">
import {useUserStore} from '@/store/modules/user';
import {TransitionPresets} from "@vueuse/core";
import {getClassListApi} from "@/api/class";
import {getNoticeListApi} from "@/api/notice";

const state = reactive({
  showInfo: {
    nickname: '',
    mobile: '',
  },
})

const userStore = useUserStore();

const date: Date = new Date();
const duration = 5000;
const greetings = computed(() => {
  if (date.getHours() >= 6 && date.getHours() < 8) {
    return '晨起披衣出草堂，轩窗已自喜微凉🌅！';
  } else if (date.getHours() >= 8 && date.getHours() < 12) {
    return '上午好🌞！';
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return '下午好☕！';
  } else if (date.getHours() >= 18 && date.getHours() < 24) {
    return '晚上好🌃！';
  } else if (date.getHours() >= 0 && date.getHours() < 6) {
    return '偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！';
  }
});
const classAmount = ref(0)
const noticeAmount = ref(0)
const classAmountOut = useTransition(classAmount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo
});
const noticeAmountOut = useTransition(noticeAmount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo
});
onMounted(() => {
  getClassListApi().then(res => {
    console.log(res)
    classAmount.value = res.data.classList.length
  })
  getNoticeListApi().then(res => {
    noticeAmount.value = res.data.circularsList.length
  })
})
</script>

<template>
  <div class="dashboard-container">
    <!-- github角标 -->
    <!--    <github-corner class="github-corner" />-->
    <div>
      <!-- 用户信息 -->
      <el-row class="mb-8">
        <el-card class="w-full">
          <div class="flex justify-between flex-wrap">
            <div class="flex items-center">
              <img
                class="user-avatar"
                :src="userStore.avatar + '?imageView2/1/w/80/h/80'"
                alt=""/>
              <span class="ml-[10px] text-[16px]">
              {{ userStore.nickname }}
            </span>
            </div>

            <div class="leading-[40px]">
              {{ greetings }}
            </div>
          </div>
        </el-card>
      </el-row>
      <iframe
        v-if="userStore.roles.includes('ROOT') || userStore.roles.includes('STAFF') || userStore.roles.includes('ADMIN')"
        src="/src/views/dashboard/test.html"
        style="display: flex;margin: auto"
        frameborder="no"
        scrolling="no"
        width="1000"
        height="700"
      >
      </iframe>
      <div v-else class="el-main">
        <!-- 数据卡片 -->
        <el-row :gutter="40" class="mb-4">
          <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
            <div class="data-box">
              <div
                class="text-[#40c9c6] hover:!text-white hover:bg-[#40c9c6] p-3 rounded"
              >
                <svg-icon icon-class="uv" size="3em"/>
              </div>
              <div class="flex flex-col space-y-3">
                <div class="text-[var(--el-text-color-secondary)]">班级总数</div>
                <div class="text-lg">
                  {{ Math.round(classAmountOut) }}
                </div>
              </div>
            </div>
          </el-col>

          <!--消息数-->
          <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
            <div class="data-box">
              <div
                class="text-[#36a3f7] hover:!text-white hover:bg-[#36a3f7] p-3 rounded"
              >
                <svg-icon icon-class="message" size="3em"/>
              </div>
              <div class="flex flex-col space-y-3">
                <div class="text-[var(--el-text-color-secondary)]">通知总数</div>
                <div class="text-lg">
                  {{ Math.round(noticeAmountOut) }}
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 24px;
  position: relative;

  .user-avatar {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
    z-index: 99;
  }

  .data-box {
    font-weight: bold;
    padding: 20px;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    box-shadow: var(--el-box-shadow-dark);
    border-color: var(--el-border-color);
    display: flex;
    justify-content: space-between;
  }

  .svg-icon {
    fill: currentColor !important;
  }
}

</style>
