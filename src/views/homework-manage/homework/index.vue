<script lang="ts">
export default {
  name: 'user'
};
</script>

<script setup lang="ts">
import {UserForm, UserPageVO} from '@/api/user/types';
import {addInfoApi, updateInfoApi} from "@/api/notice";
import {addHomeworkApi, deleteHomeworkApi, getHomeworkApi, getHomeworkListApi} from "@/api/homework";
import {getClassListApi} from "@/api/class";

const classFormRef = ref(ElForm); // 用户表单

const loading = ref(false);
const ids = ref([]);
const dialog = reactive<DialogOption>({
  visible: false
});
const dialog2 = reactive<DialogOption>({
  visible: false,
  title: '发布作业'
});

const homeworkList = ref<UserPageVO[]>();
const classList = ref<any[]>();

const formData = reactive<UserForm>({
});

const formData2 = reactive<UserForm>({});
const rules2 = reactive({
  title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
  content: [{required: true, message: '内容不能为空', trigger: 'blur'}],
});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getHomeworkListApi()
    .then(({data}) => {
      console.log(data)
      homeworkList.value = data.homeworkList;
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
 * @param homeworkId
 */
async function openDialog(homeworkId: number) {
  dialog.visible = true;
  const res = await getHomeworkApi(homeworkId)
  console.log(res)
  Object.assign(formData, res.data.homework)

}

async function openDialog2() {
  dialog2.visible = true;
  const res = await getClassListApi()
  console.log(res)
  classList.value = res.data.classList
}

/**
 * 关闭用户弹窗
 */
function closeDialog() {
  dialog.visible = false;
  dialog2.visible = false;
  resetForm();
}

/**
 * 重置表单
 */
function resetForm() {
  formData.id = undefined;
}

/**
 * 表单提交
 */
function handleSubmit() {
  classFormRef.value.validate(async (valid: any) => {
    if (valid) {
      console.log(formData2)
     const res = await addHomeworkApi(formData2)
      console.log(res)
      ElMessage.success('作业发布成功！')
      resetQuery()
      closeDialog()
    }
  });
}

/**
 * 删除用户
 */
function handleDelete(homeworkId: number) {
  ElMessageBox.confirm('确认删除作业?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    deleteHomeworkApi(homeworkId).then(() => {
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
                  @click="openDialog2()"
                  v-hasPerm="['sys:homework:add']"
                >
                  <i-ep-plus/>
                  发布作业
                </el-button
                >
              </div>
            </div>
          </template>
          <el-table
            v-loading="loading"
            :data="homeworkList"
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
              label="班级ID"
              align="center"
              prop="classId"
            />
            <el-table-column
              label="班级名称"
              width="120"
              align="center"
              prop="className"
            />
            <el-table-column
              label="老师姓名"
              width="120"
              align="center"
              prop="teacherName"
            />
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180"
            ></el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="openDialog(scope.row.id)"
                >
                  <i-ep-edit/>
                  查看详情
                </el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  v-hasPerm="['sys:homework:delete']"
                  @click="handleDelete(scope.row.id)"
                >
                  <i-ep-delete/>
                  删除作业
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
      title="作业详情"
      v-model="dialog.visible"
      width="600px"
      @close="closeDialog"
    >
      <el-descriptions>
        <el-descriptions-item label="班级ID">{{ formData.classId }}</el-descriptions-item>
        <el-descriptions-item label="班级名称">{{ formData.className }}</el-descriptions-item>
        <el-descriptions-item label="作业内容">{{ formData.content }}</el-descriptions-item>
        <el-descriptions-item label="老师">{{ formData.teacherName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">
          <el-tag size="small">{{ formData.createTime }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 表单弹窗 -->
    <el-dialog
      title="发布作业"
      v-model="dialog2.visible"
      width="600px"
      @close="closeDialog"
    >
    </el-dialog>
    <!-- 表单弹窗 -->
    <el-dialog
      :title="dialog2.title"
      v-model="dialog2.visible"
      width="600px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="classFormRef"
        :model="formData2"
        :rules="rules2"
        label-width="80px"
      >
        <el-form-item label="班级" prop="classId">
          <el-select v-model="formData2.classId" placeholder="选择班级" size="large">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作业内容" prop="content">
          <el-input type="textarea" v-model="formData2.content" placeholder="请输入作业内容"/>
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
