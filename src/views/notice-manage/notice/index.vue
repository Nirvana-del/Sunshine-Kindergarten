<script lang="ts">
export default {
  name: 'user'
};
</script>

<script setup lang="ts">
import {UserForm, UserPageVO} from '@/api/user/types';
import {addInfoApi, deleteInfoApi, getInfoApi, updateInfoApi} from "@/api/notice";
import {getNoticeListApi} from "@/api/notice";

const userFormRef = ref(ElForm); // 用户表单

const loading = ref(false);
const ids = ref([]);
const dialog = reactive<DialogOption>({
  visible: false
});

const noticeList = ref<UserPageVO[]>();

const formData = reactive<UserForm>({
  status: 1
});

const rules = reactive({
  title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
  content: [{required: true, message: '内容不能为空', trigger: 'blur'}],
});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getNoticeListApi()
    .then(({data}) => {
      console.log(data)
      noticeList.value = data.circularsList;
      // total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */
function resetQuery() {
  handleQuery();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开弹窗
 *
 * @param noticeId
 */
async function openDialog(noticeId?: number) {
  console.log(noticeId)
  dialog.visible = true;
  if (noticeId) {
    dialog.title = '修改通知';
    const res = await getInfoApi(noticeId)
    console.log(res)
    //
    const newObj = {
      id: res.data.circulars.id,
      publishName: res.data.circulars.publishName,
      content: res.data.circulars.content,
      title: res.data.circulars.title,
    }
    Object.assign(formData, newObj)
  } else {
    dialog.title = '发布通知';
  }
}

/**
 * 关闭用户弹窗
 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/**
 * 重置表单
 */
function resetForm() {
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}

/**
 * 表单提交
 */
function handleSubmit() {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const noticeId = formData.id;
      loading.value = true;
      if (noticeId) {
        updateInfoApi(formData)
          .then(() => {
            ElMessage.success('修改通知成功');
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addInfoApi(formData)
          .then(() => {
            ElMessage.success('新增通知成功');
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/**
 * 删除用户
 */
function handleDelete(noticeIds: number) {
  if (!noticeIds) {
    ElMessage.warning('请勾选删除项');
    return;
  }

  ElMessageBox.confirm('确认删除通知?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    deleteInfoApi(noticeIds).then(() => {
      ElMessage.success('删除成功');
      resetQuery();
    });
  });
}


onMounted(() => {
  handleQuery(); // 初始化用户列表数据
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :lg="20" :xs="24">
        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-button
                  type="success"
                  @click="openDialog()"
                  v-hasPerm="['sys:notice:add']"
                >
                  <i-ep-plus/>
                  新增
                </el-button
                >
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="noticeList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="publishName"
              label="发布者"
              align="center"
              prop="publishName"
            />
            <el-table-column
              label="标题"
              width="120"
              align="center"
              prop="title"
            />
            <el-table-column
              label="创建时间"
              align="center"
              prop="publishTime"
              width="180"
            ></el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  size="small"
                  v-hasPerm="['sys:notice:update']"
                  @click="openDialog(scope.row.id)"
                >
                  <i-ep-edit/>
                  查看/编辑
                </el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  v-has-perm="['notice:delete']"
                  @click="handleDelete(scope.row.id)"
                >
                  <i-ep-delete/>
                  删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表单弹窗 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="600px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="通知内容" prop="content">
          <el-input type="textarea" v-model="formData.content" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>
