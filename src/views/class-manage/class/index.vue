<script lang="ts">
export default {
  name: 'user'
};
</script>

<script setup lang="ts">
import {UserPageVO} from '@/api/user/types';

import {
  addClassApi,
  deleteClassApi,
  getClassListApi,
  getTeachersApi,
  joinClassApi,
  unJoinClassApi,
  updateClassApi
} from "@/api/class";
import {useUserStoreHook} from "@/store/modules/user";

const {userId} = useUserStoreHook()
const classFormRef = ref(ElForm); // 用户表单

const loading = ref(false);
const ids = ref([]);
const dialog = reactive<DialogOption>({
  visible: false
});

const noticeList = ref<UserPageVO[]>();
const teacherList = ref([])
const formData = reactive<any>({
  className: "",
  classNo: "",
  id: undefined,
  teacherId: undefined,
});
watch(formData, () => {
  console.log('检测到了')
  formData.className = "阳光幼儿园" + formData.classNo + "班"
})
const rules = reactive({
  classNo: [{required: true, message: '课程编号不能为空', trigger: 'blur'}],
  className: [{required: true, message: '课程名称不能为空', trigger: 'blur'}],
  teacherId: [{required: true, message: '请选择老师', trigger: 'blur'}],
});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getClassListApi()
    .then(({data}) => {
      console.log(data)
      noticeList.value = data.classList;
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
 * @param classId
 */
async function openDialog(row?: any) {
  console.log(row)
  dialog.visible = true;
  const res = await getTeachersApi()
  console.log(res)
  teacherList.value = res.data.teacher
  if (row?.id) {
    dialog.title = '修改班级';
    // currentClass.value = row
    Object.assign(formData, row)
    // const res = await getInfoApi(classId)
    // console.log(res)
    // //
    // const newObj = {
    //   id: res.data.circulars.id,
    //   publishName: res.data.circulars.publishName,
    //   content: res.data.circulars.content,
    //   title: res.data.circulars.title,
    // }
    // Object.assign(formData, newObj)
  } else {
    dialog.title = '新增班级';
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
  classFormRef.value.resetFields();
  classFormRef.value.clearValidate();

  formData.id = undefined;
}

/**
 * 表单提交
 */
function handleSubmit() {
  classFormRef.value.validate((valid: any) => {
    if (valid) {
      const classId = formData.id;
      loading.value = true;
      if (classId) {
        updateClassApi(formData)
          .then(() => {
            ElMessage.success('修改班级成功');
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addClassApi(formData)
          .then(() => {
            ElMessage.success('新增班级成功');
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
function handleDelete(classIds: number) {

  ElMessageBox.confirm('确认删除班级?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    deleteClassApi(classIds).then(() => {
      ElMessage.success('删除成功');
      resetQuery();
    });
  });
}

async function joinClass(row: any) {
  console.log(row)
  console.log(userId)
  const res = await joinClassApi({claId: row.id, parentId: userId})
  console.log(res)
  ElMessage.success(res.message)
  resetQuery()
}
async function unJoinClass(row: any) {
  console.log(row)
  console.log(userId)
  const res = await unJoinClassApi({claId: row.id, parentId: userId})
  console.log(res)
  ElMessage.success(res.message)
  resetQuery()
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
                  v-hasPerm="'class:add'"
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
              label="班级号"
              align="center"
              prop="classNo"
            />
            <el-table-column
              label="班级名称"
              align="center"
              prop="className"
            />
            <el-table-column
              label="班主任"
              width="220"
              align="center"
              prop="teacherName"
            />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  size="small"
                  v-hasPerm="['sys:class:update']"
                  @click="openDialog(scope.row)"
                >
                  <i-ep-edit/>
                  查看/编辑
                </el-button>
                <el-button
                  type="primary"
                  link
                  v-if="userId !== 1 && scope.row.add === false"
                  size="small"
                  v-hasPerm="['sys:class:join']"
                  @click="joinClass(scope.row)"
                >
                  <i-ep-discount/>
                  加入班级
                </el-button>
                <el-button
                  type="primary"
                  link
                  v-if="userId !== 1 && scope.row.add === true"
                  size="small"
                  v-hasPerm="['sys:class:join']"
                  @click="unJoinClass(scope.row)"
                >
                  <i-ep-discount/>
                  退出班级
                </el-button>
                <el-button
                  type="primary"
                  link
                  size="small"
                  v-hasPerm="['sys:class:add']"
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
        ref="classFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="班级编号" prop="classNo">
          <el-input v-model="formData.classNo" placeholder="请输入班级编号"/>
        </el-form-item>
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="formData.className" disabled placeholder="请输入班级名称"/>
        </el-form-item>
        <el-form-item label="班主任" prop="teacherId">
          <el-select v-model="formData.teacherId" placeholder="选择老师" size="large">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
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
