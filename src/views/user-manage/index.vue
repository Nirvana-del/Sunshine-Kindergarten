<template>
  <div class="el-main">
    <el-row :gutter="20" style="margin-top:10px;">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>个人中心</span>
              </div>
            </template>
            <single-upload class="text-center" v-model="dataForm.avatar"></single-upload>
            <div class="name-role">
              <span class="sender"> {{ showInfo.nickname }}</span>
            </div>
            <div class="registe-info">
          <span class="registe-info">
          </span>
            </div>
            <el-divider></el-divider>
            <div class="personal-relation">
              <div class="relation-item">手机号:
                <div style="float: right; padding-right:20px;">{{ showInfo.mobile }}</div>
              </div>
            </div>
            <div class="personal-relation"/>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-tabs type="border-card">
            <el-tab-pane label="修改个人信息">
              <div>
                <el-form ref="userRef" :model="dataForm" label-width="80px" size="small" label-position="right">
                  <el-form-item label="用户名" prop="nickname" required>
                    <el-input auto-complete="off" v-model="dataForm.username"></el-input>
                  </el-form-item>
                  <el-form-item label="用户昵称" prop="nickname" required>
                    <el-input auto-complete="off" v-model="dataForm.nickname"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile" required>
                    <el-input auto-complete="off" v-model="dataForm.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="性别" prop="gender" required>
                    <el-select v-model="dataForm.gender" placeholder="性别">
                      <el-option
                        v-for="item in genderOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div class="dialog-footer">
                <el-button size="small" type="primary" @click="submit_chang_userInfo">提交
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>

        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {useUserStoreHook} from "@/store/modules/user";
import {getUserInfoById, updateUser} from "@/api/user";
// 昵称、性别、头像、手机号、创建时间
const {userId} = useUserStoreHook()
// const genderMap = {
//   1: '男',
//   2: '女'
// } as any
const userRef = ref()
const genderOptions = [
  {
    value: 0,
    label: '未知'
  },
  {
    value: 1,
    label: '男'
  },
  {
    value: 2,
    label: '女'
  }
]
const state = reactive({
  showInfo: {
    nickname: '',
    mobile: '',
  },
  dataForm: {
    userId,
    username: '',
    nickname: '',
    gender: 0,
    avatar: '',
    mobile: '',
    roleIds: []
  } as any,
})
const {
  dataForm,
  showInfo
} = toRefs(state)

function submit_chang_userInfo() {
  userRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await updateUser(userId, dataForm.value)
      await getUserDetail()
      ElMessage.success('修改成功')
    }
  })
}
//
async function getUserDetail() {
  const res = await getUserInfoById(userId)
  console.log(res)
  const {avatar, gender, mobile, nickname, username} = res.data.user
  const roleIds = [res.data.role[0].roleId]
  dataForm.value.avatar = avatar
  dataForm.value.gender = gender
  dataForm.value.mobile = mobile
  dataForm.value.nickname = nickname
  dataForm.value.username = username
  dataForm.value.roleIds = roleIds
  showInfo.value.nickname = nickname
  showInfo.value.mobile = mobile
}

onMounted(() => {
  getUserDetail()
})

</script>

<style lang="scss" scoped>

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  text-align: center;
  width: 178px;
  height: 178px;
  display: block;
  clear: both;
  margin: 0 auto;
}


.avatar .aligncenter {
  clear: both;
  display: block;
  margin: auto;
}


.title {
  width: 100%;
  font-size: 0;
  height: 10%;
}

.title .content img {
  width: 35%;
}

/*--主要的--*/
.content {
  display: inline-block;
  vertical-align: middle;
}

.flag {
  display: inline-block;
  vertical-align: middle;
  height: 100%;
  width: 0;
}


//卡片样式
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}

//文本样式区
.name-role {
  font-size: 16px;
  padding: 5px;
  text-align: center;
}

.sender {
  text-align: center;
}

.registe-info {
  text-align: center;
  padding-top: 10px;
}

.personal-relation {
  font-size: 16px;
  padding: 0px 5px 15px;
  margin-right: 1px;
  width: 100%
}

.relation-item {
  padding: 12px;

}

.dialog-footer {
  padding-top: 10px;
  padding-left: 10%;
}

//布局样式区
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
